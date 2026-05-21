# Krok ručního nasazení: Google Search Console + Bing Webmaster + IndexNow

Vše SEO/GEO/LLM je hotové v kódu. Zbývají **manuální kroky v externích konzolích** — vyžadují tvůj přístup k doméně/Google účtu, takže to musíš udělat ty.

---

## 1. Google Search Console (15 minut, KRITICKÉ)

Bez GSC verifikace **Google ignoruje sitemap a manuální URL submission**.

### Postup:

1. Otevři **https://search.google.com/search-console**
2. Klikni **"Add property"** → vyber **"Domain"** (lepší než URL prefix)
3. Zadej `benzynamapa.pl`
4. Google vygeneruje **DNS TXT record** typu `google-site-verification=XXXXX...`
5. Přidej tento TXT record do DNS u tvého registrátora (Wedos, OVH, ...):
   - Type: TXT
   - Host: `@` (nebo prázdné)
   - Value: `google-site-verification=XXXXX...`
   - TTL: 3600
6. Počkej 5-30 minut, vrať se do GSC a klikni **"Verify"**

### Po verifikaci:

7. Levé menu → **Sitemaps**
8. Přidej sitemap: `https://benzynamapa.pl/sitemap.xml`
9. GSC by měl po pár hodinách začít indexovat — sleduj **Coverage** report

### Bonus — odeslat URL manuálně:

V GSC → **URL Inspection** → vlož URL → **Request Indexing**. Funguje pro top stránky (homepage, paliva, najtansze-X).

---

## 2. Bing Webmaster Tools (10 minut, KRITICKÉ pro AI)

**Proč Bing:** ChatGPT a Microsoft Copilot používají Bing index. Bez Bing verifikace AI vyhledávače tě prakticky nevidí.

### Postup:

1. Otevři **https://www.bing.com/webmasters/**
2. Sign in s Microsoft účtem
3. **Add a site** → `https://benzynamapa.pl`
4. Verifikace přes **DNS TXT** (preferovaná) — analogicky k GSC:
   - Type: TXT
   - Host: `@`
   - Value: vygenerovaný kód z Bing Webmaster
5. **OR import from Google Search Console** (snadnější — Bing importuje verifikaci a sitemap)
6. Sitemap: `https://benzynamapa.pl/sitemap.xml`

### Po verifikaci:

7. Levé menu → **IndexNow**
8. Klikni **"Add API Key"**
9. Zadej náš key: `0191df93d1b02a6c00fdb8d67042bdd3`
10. URL: `https://benzynamapa.pl/0191df93d1b02a6c00fdb8d67042bdd3.txt`

**Tímto se aktivuje IndexNow** — Bing dostane okamžitý ping po každém update cen (3×/den).

---

## 3. Vercel Analytics (2 minuty, doporučeno)

Real-user monitoring běží už nyní — ale dashboard musíš aktivovat:

1. Otevři **https://vercel.com/dashboard**
2. Vyber projekt benzynamapa-pl
3. **Analytics** tab → **Enable**
4. **Speed Insights** tab → **Enable**

Tarif: zdarma do 100k events/měsíc. Po překročení $20/měsíc.

---

## 4. Google Analytics 4 + Consent Mode v2 (volitelné)

GA4 už je nastavená (`G-Y900JP5XKF`). V GA admin:

1. **Admin** → **Data Streams** → tvůj stream
2. Ověř že **Enhanced measurement** je on
3. **Admin** → **Property settings** → **Consent settings** — verify Google signals OK
4. **Admin** → **Reporting Identity** → vyber **Blended** (kombinuje user-id + device + signal)

---

## 5. AdSense — verifikace (už nasazena)

AdSense (`ca-pub-5944037956815415`) je v `<head>`. Status zkontroluj v:

1. **https://www.google.com/adsense/**
2. **Sites** → benzynamapa.pl → status by měl být **"Ready"** nebo **"Limited ad serving"**
3. **Po verifikaci** ads se aktivují automaticky (po prozkoumání Google)

---

## 6. Naver (volitelné — pokud cílíš na asijské uživatele)

IndexNow už pinguje Naver automaticky. Webmaster Tools:

1. **https://searchadvisor.naver.com/**
2. Add site → benzynamapa.pl
3. DNS TXT verifikace

---

## 7. Yandex (volitelné — Rusko + bývalý ZSSR)

IndexNow už pinguje. Webmaster:

1. **https://webmaster.yandex.com/**
2. Add site → DNS TXT
3. Sitemap submission

---

## Co se stane po těchto krocích

| Časové měřítko | Co očekávat |
|---|---|
| **Den 1-3** | Google začne crawlovat sitemap, prvních ~500 URL indexovaných |
| **Týden 1** | ~3 000-5 000 URL v Google indexu |
| **Týden 2-4** | Plné indexování ~10 000 URL, AI Overviews začnou se objevovat |
| **Měsíc 1** | Bing index plný, ChatGPT/Copilot začnou citovat |
| **Měsíc 2-3** | Stabilní organický traffic, Top 10 pozice na long-tail keywords |
| **Měsíc 3-6** | Top pozice "Orlen Warszawa", "ceny paliw [město]", brand×city |

---

## Monitoring

Po nastavení sleduj weekly:

1. **GSC Coverage** — kolik URL v indexu
2. **GSC Performance** — clicks, impressions, top queries
3. **Vercel Speed Insights** — LCP, INP, CLS (cíl: all green)
4. **GA4 Acquisition** — organické trafic per landing page
5. **Bing Webmaster Traffic** — Bing share + IndexNow stats

---

## Pomoc

- GSC docs: https://support.google.com/webmasters/
- Bing docs: https://www.bing.com/webmasters/help/
- IndexNow specs: https://www.indexnow.org/documentation
