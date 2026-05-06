
Shrnutí a metodika
Připravujeme lokalizaci webu benzinmapa.cz pro Polsko s cílem maximální SEO viditelnosti a technické připravenosti. Výstup zahrnuje title/klíčová slova, zdroje cen, konkurenci, datový model, ETL, API, UX, obsahový plán a monetizaci.
Metodika: Pro SEO jsme sbírali relevantní polské termíny (Google Keyword Planner, české/poľské překlady). Pro zdroje cen jsme prohledali oficiální portály (gov.pl) a existující aplikace (tuTankuj, cenapaliw.pl). Konkurenční služby získány z polských automobilových médií a SimilarWeb trendů
. Datový model a ETL navrhujeme podle standardů GIS/databází, frekvence sběru (3× denně) a validace cen. Obsahový plán tvoříme na základě long-tail českých témat adaptovaných do polštiny. Časovou osu navrhujeme pro 0–6 měsíců vývoje i marketingu.
1. SEO titulek a klíčová slova
Návrh SEO titulu (polsky): „Mapa cen paliw i najtańsze stacje w Polsce 2026“
Klíčová slova/fráze (PL, long-tail):

ceny paliw Polska
najtańsza benzyna w Polsce
benzyna 95 cena mapa
stacje paliw najtaniej
e-petrol aktualne ceny
porównanie cen paliw PL
aplikacja ceny paliwa
tanie paliwo Warszawa
gdzie zatankować najtaniej
LPG Polska ceny
benzyna Pb95 Pb98 CNG
Tento titul a klíčová slova využívají lokalní slova („paliwa“, „stacje“) a long-tail fráze („najtańsza benzyna“, „porównanie cen paliw“). Veškerý text (title, meta) by měl být lokalizován do polštiny.

2. Zdroje cen paliv v Polsku
Oficiální portály/API: Polská vláda neposkytuje veřejné API cen paliv. Maximální ceny stanovuje Ministerstvo Klimatu (např. „Maksymalne ceny detaliczne“
) formou denních dekrety. Tyto jsou zveřejňovány na vlámských stránkách (gov.pl). API: žádné; budeme skenovat text (scraping) z gov.pl nebo AutoCentrum.
Energetické agentury: Neexistuje obdobné CRA (jako E-Control) pro běžný spotřebitel.
Crowdsourcing/databáze:
tuTankuj (tutankuj.pl): dříve populární app (aktualizována do 2018, nyní neudržována
). Nicméně má databázi stanic (připojená k e-petrol.pl). API: neznámo, pravděpodobně žádné.
Cenapaliw.pl: nový agregátor (SimilarWeb uvádí silný růst
). Působí jako web, API neznámo.
Fuelio: globální appka, obsáhlé crowdsourcingové ceny, ale spíše osobní deník.
Waze/Google Maps: mají funkci zobrazení cen (zdroj komunitní)
.
OpenStreetMap: Pokrytí čerpacích stanic v Polsku v OSM je dobré (Polsko dlouho komunitně mapuje). Můžeme využít OSM k získání lokací stanic.
Scraping: Možnosti: stránky autopetrol, AutoCentrum (ceny průměrů), lokální news portály (Otomoto news
). Technicky možné, ale nutno řešit frekvenci a zmrazení IP.
Partnerství s řetězci: Orlen/Lotos/Shell/PKN nemají veřejná cenová API. Je možné uvažovat o partnerství (např. přístup k interním datům), avšak doposud žádná oficiální integrace není známa. Orlen nabízí hurtowe ceny (velkoodběratelé)
 – pro nás irelevantní.
Zdroj	URL	API/dostupnost	Poznámka
Gov.pl cen.	[gov.pl/paliwa] (denní max)	nespecifikováno	oficiální max. ceny (text)
tuTankuj app	tutankuj.pl	žádné API	neudržováno (data stará)
Cenapaliw.pl	cenapaliw.pl	nespecifikováno	roste, pravděpodobně HTML
Waze/Google	waze.com/maps	API ne (data z crowd)	pokrývá PL paliva
Fuelio	fuelioapp.com	tak (SDK)	mezinárodní data (multijaz.)
OSM	openstreetmap.org (gas stations)	ano	POI stanic, bez cen

3. Konkurenti v Polsku
Název	URL	Traffic (pln)	Funkce	Slabiny
tuTankuj	tutankuj.pl	Trenduje (TOP100)
mobilní appka, uživatelské hlášení cen, integrace e-petrol	zastaralá (Android nie), méně aktivních uživatelů
Cenapaliw.pl	cenapaliw.pl	TOP100 (trend stoupá)
webová mapka, podle infa „znajdziesz ceny paliw”	nové, ROI neznámá, omezené funkce
Fuelio	fuelioapp.com	n/d (celosv. stah.)	sledování tankování, crowd-ceny	méně lokalizovaná (PL UI/čerpáčky)
Waze	waze.com/maps	miliony uživatelů	navigace + ceny od komunity (fuel feature)	primárně navigace, ne full fuel app
Google Maps	maps.google.com	extremně vysoký	navigate + ceny stanic (crowd)	stejná jako Waze
Inne portale	autotemp.pl apod.	nespecifikováno	agregují průměry (GPInfo)	nenabízí crowdsourcing, pouze statistiky

Traffic je orientační – tuTankuj je populární Trendující (SimilarWeb)
, Waze/Maps vysoký globální, Fuelio má stahování (Google Play). Slabiny tuTankuj: neaktualizace
, Fuelio: zaměřen na osobní účty, má omezený zobrazení lokálních cen.

4. Datový model
Navrhujeme relační model (SQL) s následujícími tabulkami:

Tabulka	Klíčová pole (PK→*) a typy	Příklad záznamu
stations	station_id INT<br>name VARCHAR<br>brand VARCHAR<br>lat DOUBLE<br>lon DOUBLE<br>address TEXT<br>active BOOL	(1, „Orlen Kraków ul. Warszawska”, „ORLEN”, 50.067, 19.950, „ul. Warszawska 1, 30-123 Kraków”, true)
fuels	fuel_id INT<br>code VARCHAR<br>desc VARCHAR	(1, „PB95”, „Benzyna 95”), (2, „PB98”, „Benzyna 98”), (3, „ON”, „Olej napędowy”), (4, „LPG”, „Autogaz”)
prices	price_id INT<br>station_id INT (FK)<br>fuel_id INT (FK)<br>price DECIMAL(5,2)<br>dt DATETIME<br>source VARCHAR	(1001, 1, 1, 6.49, ‘2026-05-05T09:00:00’, „oficjalny”), např. cena ORL PB95 max.
reports	report_id INT<br>station_id INT<br>fuel_id INT<br>price DECIMAL(5,2)<br>dt DATETIME<br>user_id INT (nullable)	(5001, 1, 1, 6.45, ‘2026-05-05T09:30:00’, null) – user report ceny
sources	source_id INT<br>name VARCHAR<br>type VARCHAR	(1, „GovPortal”, „oficialny”), (2, „UserApp”, „crowd”), (3, „WebScrape”, „scrape”)

stations: každý záznam popisuje čerpací stanici (název, značka, geo-souřadnice).
fuels: seznam typů paliva s kódy (PB95, ON atd.).
prices: historie cen; ukládá každou změřenou/aktualizovanou cenu s datem a zdrojem.
reports: uživatelské hlášení ceny (může být použito pro crowdsourcing).
sources: přehled zdrojů dat pro sledování (někdy nepotřebné, ale může pomoci).
V JSON (OpenAPI) budeme odkazovat na stejné entity; níže přidáme JSON schema a SQL DDL.

5. ETL / Ingest dat
Zdroje dat:
Oficiální maxima: každý den (např. 6:00) stáhnout novou tabulku maksy z gov.pl (scrap obdrženého PDF/HTML).
Crowdsourcing: přes klientskou app (Claude Code backend) přijímat POST s cenou.
OSM: jednorázový import databáze stations z OSM (možnost periodicky aktualizovat).
Frekvence: minimalně 3× denně aktualizace cen – ráno, odpoledne, večer.
Deduplikace: pokud existuje více záznamů pro stejnou station+fuel ve stejný den, použít nejnovější; duplicitní ID ignorovat.
Validace: porovnat nové ceny s předchozími; pokud změna >20 %, flagovat chybu (zprávu do logu).
Fallback: pokud stanice nemá hlášenou cenu, použít průměrnou cenu značky nebo regionu jako odhad.
Logování: všechny získané vstupy (API volání, scrapes, user POST) se logují pro audit. Chyby/timeouty datových zdrojů jsou zaznamenány a upozorňují vývojáře.
ETL plán v tabulce:

Krok	Popis	Frekvence
1. Stahování OSM	Import adres a značek stanic z OSM (import)	1× (reset)
2. Oficiální ceny	Scraping max cen z gov.pl (PB95, PB98, ON, LPG)	1× denně
3. Crowdsourcing	Příjem cen z mobilní app (POST do API)	kontinuálně
4. Zápis cen	Uložení do tabulky prices (zdroje + validace)	3× denně
5. Validace/dedupl.	Kontrola extrémních odchylek, odstranění duplicit	po každé aktualizaci
6. Fallback cen	Výpočet odhadu, pokud cena chybí	po každé aktualizaci

6. Interní API (JSON/REST)
Navrhujeme tyto endpointy pro interní použití (Swagger/OpenAPI-like):

GET /stations – výpis stanic
Parametry: fuel, brand, region (volitelné filtry).
Vrací: seznam stanic (id, name, brand, lat, lon, address).
POST /price – přidání/aktualizace ceny
Tělo JSON: { "station_id": int, "fuel": string, "price": decimal, "source": string }.
Rozdíl: lze specifikovat source ("trusted", "user").
Odpověď: status (OK/ERR) + záznam.
GET /station/{id}/prices – historie cen stanice
Parametry: žádné.
Vrací: pole cen (price, dt, source) pro všechny typy paliv.
POST /report – uživatelský hlášení ceny
Tělo: { "station_id": int, "fuel": string, "price": decimal, "user": string }.
Přidá do reports a (možná) do prices po schválení.
GET /health – kontrola statusu
Bez parametrů.
Vrací: systémový stav (čas poslední aktualizace, API OK).
Každý endpoint vrací JSON, například /stations by mohl vracet:

json
Zkopírovat
[
  {"id":1,"name":"Orlen Warszawa","brand":"ORLEN","lat":52.23,"lon":21.01,"address":"Ul. Marszałkowska 10"}
  // ...
]
Pro /station/1/prices:

json
Zkopírovat
{
  "station_id":1,
  "prices":[
    {"fuel":"PB95","price":6.49,"dt":"2026-05-05T09:00:00","source":"GovPortal"},
    {"fuel":"ON","price":7.23,"dt":"2026-05-05T09:00:00","source":"GovPortal"},
    {"fuel":"PB95","price":6.45,"dt":"2026-05-05T10:30:00","source":"User"}
  ]
}
7. Frontend MVP (Polsko)
Klíčové obrazovky:
Mapa: interaktivní mapa Polska s ikonkami stanic. Filtry palivo (PB95/PB98/ON/LPG) a značky. Dotknutím markeru se zobrazí stručný detail.
Seznam nejlevnějších stanic: tříděný přehled (top 20) pro každé palivo (podobně jako benzinmapa).
Detail stanice: kompletní údaje (název, adresa, aktuální ceny, otevírací doba (pokud známo), možnost navigace). Tlačítko pro „Nahlásit cenu“.
Report paliva: formulář pro uživatele k odeslání ceny (palivo, částka, fotka účtenky).
Graf vývoje cen: sekce v detailu stanice s časovým grafem (průměr za den) pro každé palivo (např. 30 dní).
UX poznámky: uživatelské chování je obdobné jako v ČR. Klíčové prvky: rychlé filtrování (Poláci občas hledají „benzynań drożej niż…”), přehlednost. Místní názvy: Benzyna 95/98 (PB95, PB98), Olej napędowy (ON), LPG (Autogaz). Na webu použít plné názvy i kódy.
Lokalizace textů: všechno do polštiny, seznam paliv viz výše. Značky (np. PKN Orlen, Lotos, Shell, BP) se chovají stejně.
Struktura URL (SEO): přátelská URL, např. /stacje/świętokrzyskie/benzyna-95/ pro region. Mapa na úvodní / s možnostmi filtrů.
UX pro mobil: důraz na rychlý přístup k „nejbližší stanice“ (GeoGPS).
8. SEO obsahový plán
Kategorie (blog/FAQ): Např. Aktualności/Ceny, Poradniki/FAQ, Promocje.
Tituly článků (PL, long-tail):

Najtańsze stacje paliw w [miasto] – meta: „Sprawdź, gdzie zatankujesz najtaniej w [miasto]“. H1: „Najtańsze stacje paliw w [miasto]“.
Jak zaoszczędzić na benzynie? 10 porad kierowcy – meta: „Dowiedz się, jak tankować taniej“. H1: „10 sposobów na tańsze tankowanie benzyny“.
Ceny paliw w Polsce: prognozy i trendy 2026 – meta: „Analiza cen paliw i czynniki wpływające na ceny“.
PB95 vs PB98 vs ON: co wybrać? – meta: „Porównanie rodzajów paliw i ich zalety“.
Stacje benzynowe a komfort podróżowania: co oferują? – H1: „Zalety współczesnych stacji benzynowych“.
Czy tankować LPG? Plusy i minusy autogazu – meta: „Paliwo LPG: czy warto tankować w Polsce?“.
Karty paliwowe i programy lojalnościowe porównanie – meta: „Najlepsze karty lojalnościowe na benzynę“.
Co to jest cena referencyjna ON i jak wpływa na ceny? – H1: „Cena maksymalna ON w Polsce“.
Tankowanie za granicą: gdzie opłaca się jechać po tańszy paliwo? – meta: „Porównanie cen paliw Polska/Niemcy/Czechy“.
Język branży paliw: Pb95, ON, CNG – co oznacza? – meta: „Definicje i skróty paliw“.
Czy ceny na stacjach są regulowane prawnie? – H1: „Regulacje cen paliw w Polsce“.
Polecane aplikacje motoryzacyjne w 2026: kontroluj swój samochód – meta: „Najlepsze aplikacje dla kierowców (tankowanie, nawigacja)“.
Každý článek: případná kategorie FAQ/poradnik. Důraz na long-tail a lokální klíčová slova (města, rodzaj paliwa, promocje).

9. Monetizace a reklamní sazby
Reklama (AdSense itp.): automobilové klíčová slova (benzyna, ON) mají středně vysoké CPC (~0,3–0,5 EUR) a eCPM display ~1–2 EUR. Polský trh je velký, očekáváme CPC okolo 1–2 PLN (0,2–0,5 EUR)
.
Affiliate: mohla by využít karty lojalnościowe (Orlen Vitay, Lotos Biznes), srovnávače autopojištění a financování (poptávka po A-Karten). Odměna za registraci u karty ~20–50 PLN.
Premium/B2B: detailní data pro dopravce, tuning firmy. Možné denní výpisy cen. (Méně pravděpodobné v MVP.)
Příklady CPC/eCPM: přes Marketplace by mohla být ~1,5–2 PLN/click, eCPM ~5–10 PLN (1-2 EUR).
Monetizační kanál	Odhad CPC (EUR)	eCPM (EUR)
Display reklama	0.30–0.50 (1,50–2,50 PLN)	1.00–2.00
Affiliate (karty)	není CPC	– (komise)

10. Check-list a časová osa
Časová osa 0–6 měs. (MVP): implementace krok po kroku.

2025 Q2
Průzkum (legalitacen, API scraping) +design datovéhomodelu
Sběr OSM dat &initial import stanic
2025 Q3
Vývoj backendu (APIendpoints, databáze)+ ETL pipelines(scraping gov.pl)
Vývoj MVP frontend(mapa, seznam,detail)
2025 Q4
Testy, integracecrowdsourcing(appka) + validacedat
Příprava obsahovéhoplánu a SEO(publikace prvníchčlánků)
2026 Q1
Soft launch (základníverze) + marketing(PPC, social media)
Feedback, opravy,přidání pokročilýchfunkcí
2026 Q2
Plný launch +vyjednávánípartnerství (Orlen,analýza B2B)
Pokračujícípublikační areklamní aktivity


Ukázat kód
Odpovědnosti:

Dev team: vývoj backend (ETL, API) + frontend mapa/GUI.
Data team: shromáždění a test zdrojů, správa databází.
Marketing: SEO a kampaně, obsahová strategie (články, sociální sítě).
Právník: analýza právních omezení cen, GDPR (zpracování uživatelských reportů).
11. JSON schema a SQL DDL
SQL DDL (PostgreSQL syntaxi):

sql
Zkopírovat
CREATE TABLE fuels (
  fuel_id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  description VARCHAR(50)
);
CREATE TABLE stations (
  station_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  brand VARCHAR(50),
  address TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  active BOOLEAN DEFAULT TRUE
);
CREATE TABLE prices (
  price_id SERIAL PRIMARY KEY,
  station_id INT REFERENCES stations(station_id),
  fuel_id INT REFERENCES fuels(fuel_id),
  price NUMERIC(5,2),
  dt TIMESTAMP,
  source VARCHAR(20)
);
CREATE TABLE reports (
  report_id SERIAL PRIMARY KEY,
  station_id INT REFERENCES stations(station_id),
  fuel_id INT REFERENCES fuels(fuel_id),
  price NUMERIC(5,2),
  dt TIMESTAMP,
  user_id INT
);
OpenAPI-like JSON schéma (ve zkratu):

json
Zkopírovat
{
  "Station": {
    "type": "object",
    "properties": {
      "station_id": {"type": "integer"},
      "name": {"type": "string"},
      "brand": {"type": "string"},
      "address": {"type": "string"},
      "lat": {"type": "number"},
      "lon": {"type": "number"}
    }
  },
  "Price": {
    "type": "object",
    "properties": {
      "fuel": {"type": "string"},
      "price": {"type": "number"},
      "dt": {"type": "string", "format": "date-time"},
      "source": {"type": "string"}
    }
  }
}
Ukázkový JSON záznam: (Station s cenami)

json
Zkopírovat
{
  "station": {
    "station_id": 1,
    "name": "Orlen Kraków Pl. Inwalidów",
    "brand": "Orlen",
    "address": "Pl. Inwalidów 2, Kraków",
    "lat": 50.060,
    "lon": 19.926
  },
  "prices": [
    {"fuel":"PB95","price":6.49,"dt":"2026-05-05T09:00:00Z","source":"GovPortal"},
    {"fuel":"ON","price":7.23,"dt":"2026-05-05T09:00:00Z","source":"GovPortal"},
    {"fuel":"PB95","price":6.45,"dt":"2026-05-05T10:30:00Z","source":"UserApp"}
  ]
}
Zdroj údajů: Lokální polské portály (gov.pl) a appky (tuTankuj, cenapaliw.pl)
, SimilarWeb (ranking cenapaliw)
. Pokud jsou konkrétní zdroje neznámé, bylo to označeno jako „nespecifikováno“.