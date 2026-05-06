# BenzynaMAPA.pl — Pravidla pro Claude

## Stack

- `web/` — Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 (App Router)
- `scraper/` — Python scraper (cenapaliw.pl → OSM → JSON)
- `.github/workflows/` — GitHub Actions (ceny 3×/den)

## Jazyk projektu

- **Polský web** — veškerý UI text v polštině
- Paliva: `pb95` (Benzyna 95), `pb98` (Benzyna 98), `on` (Olej napędowy/Diesel), `lpg` (LPG Autogaz)
- Měna: **zł (PLN)** — formátovat `6,38 zł` (čárka jako des. oddělovač)
- Locale: `pl-PL`

## Knihovny — co používat

### UI Komponenty
- **Primární**: `shadcn/ui` — instaluj přes `npx shadcn@latest add <component>`
- Ikony: `lucide-react`

### Animace
- **Primární**: `motion` — import z `motion/react`

### Mapa
- **MapLibre GL** (`maplibre-gl`) — dynamický import, center Polska: `[19.15, 52.10]`, zoom: 7
- Clustering přes GeoJSON source (cluster: true, clusterMaxZoom: 12)

### Grafy
- `recharts` — pro historii cen

---

## Datový model

Typy viz `web/types/index.ts`:
- `FuelType`: `'pb95' | 'pb98' | 'on' | 'lpg'`
- `StationPrice`: pole `pb95`, `pb98`, `on`, `lpg` (ne natural_95/nafta jako v .cz!)
- `source`: `'cenapaliw.pl'` pro reálné ceny, `'estimate'` pro odhady
- Ceny v PLN, rozsah: pb95/on/pb98 ~5–10 zł, lpg ~2–4 zł

## Next.js 16 — klíčová pravidla

- App Router — žádné Pages Router vzory
- Server Components jsou výchozí — `"use client"` jen kde nutné
- Metadata: `generateMetadata()` async funkce
- Images: `next/image` vždy
- `output: 'export'` v next.config.ts — statický export

## Tailwind CSS v4 — klíčová pravidla

- Konfigurace v CSS souboru (`@theme`, `@utility`)
- Dark mode: `@variant dark`

## SEO šablona

```tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "...",
    description: "...",
    alternates: { canonical: "https://benzynamapa.pl/..." },
    openGraph: {
      title: "...",
      description: "...",
      url: "https://benzynamapa.pl/...",
      siteName: "BenzynaMAPA",
      locale: "pl_PL",
      type: "website",
    },
  };
}
```

## Scraper

- `scraper/build_osm_data.py` — OSM (Polsko) + cenapaliw.pl → JSON
- Výstup do `web/public/data/`
- Hesla a API klíče NIKDY do gitu
- Spuštění: `python scraper/build_osm_data.py`
