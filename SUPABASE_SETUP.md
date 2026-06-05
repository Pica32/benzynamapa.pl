# Komunitní ceny — nastavení Supabase (5 minut)

BenzynaMAPA.pl umožňuje uživatelům hlásit ceny paliv (`PriceReport` na stránce stanice).
Dříve se ukládaly do `/tmp` na Vercelu = **mizely** při každém cold startu a scraper je nikdy
nepřečetl. Teď se ukládají do **Supabase** (sdílená Postgres DB), ke které mají přístup:

- **Next.js API routes** (`/api/report-price`, `/api/confirm-price`, `/api/user-prices`) — zápis/čtení hlášení
- **scraper** (`scraper/build_osm_data.py`, GitHub Actions) — čte potvrzené ceny a mergne je do dat (3×/den)

Dokud nejsou env proměnné nastavené, vše funguje dál (fallback na `/tmp`), jen komunitní vrstva je neaktivní.

---

## 1) Vytvoř Supabase projekt
1. https://supabase.com → **New project** (free tier stačí), region EU (Frankfurt).
2. Po vytvoření: **Project Settings → API**:
   - `Project URL` → to je `SUPABASE_URL` (např. `https://abcd1234.supabase.co`)
   - `service_role` secret key → to je `SUPABASE_SERVICE_KEY` (⚠️ TAJNÉ, jen server — nikdy do klienta!)

## 2) Vytvoř tabulku (SQL Editor → New query → Run)
```sql
create table if not exists price_submissions (
  id            uuid primary key default gen_random_uuid(),
  station_id    text not null,
  fuel_type     text not null check (fuel_type in ('pb95','pb98','on','lpg')),
  price         numeric(5,2) not null,
  browser_id    text not null,
  submitted_at  timestamptz not null default now(),
  confirmed_by  text[] not null default '{}',
  confirmations int  not null default 0
);
create index if not exists idx_ps_station on price_submissions (station_id);
create index if not exists idx_ps_time    on price_submissions (submitted_at desc);

-- RLS zapnuté; přístup jen přes service_role (API/scraper). Anonymní klient nemá přímý přístup.
alter table price_submissions enable row level security;

-- (volitelné) automatické mazání hlášení starších 7 dní — drží tabulku malou
-- spustí se přes pg_cron, pokud je v projektu povolený:
-- select cron.schedule('purge_old_prices','0 3 * * *',
--   $$delete from price_submissions where submitted_at < now() - interval '7 days'$$);
```

## 3) Nastav env proměnné

**Vercel** (web): Project → Settings → Environment Variables (Production + Preview):
| Name | Value |
|---|---|
| `SUPABASE_URL` | tvůj Project URL |
| `SUPABASE_SERVICE_KEY` | service_role key |

→ pak **Redeploy**.

**GitHub** (scraper): repo → Settings → Secrets and variables → **Actions** → New repository secret:
| Name | Value |
|---|---|
| `SUPABASE_URL` | tvůj Project URL |
| `SUPABASE_SERVICE_KEY` | service_role key |

Workflow `.github/workflows/scraper.yml` je už předáván do scraperu.

---

## Jak to funguje (data flow)
1. Uživatel zadá cenu na `/stacja/{id}` → `POST /api/report-price` → řádek v `price_submissions`.
2. Jiný uživatel ji potvrdí → `POST /api/confirm-price` (nemůže potvrdit vlastní; 1× per browser).
3. Scraper (3×/den) přečte hlášení za posledních 24 h, vezme **medián** ceny per stanice+palivo,
   a mergne jako `source: 'community'` — **přebije odhad i cenapaliw** (nejaktuálnější + ověřené komunitou).
4. UI značí komunitní ceny jako ✓ ověřené (zelené), počítají se do průměrů, řazení i mapy.

## Ověření
- Po nastavení: nahlas cenu na stanici → v Supabase **Table editor** se objeví řádek.
- Příští běh scraperu vypíše `→ Komunitní ceny aplikovány na N stanic`.
- `stats_latest.json` → `stations_updated_today` se zvýší o komunitní stanice.
