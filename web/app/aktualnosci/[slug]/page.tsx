import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, ChevronLeft } from 'lucide-react';
import { POSTS } from '../page';

type Props = { params: Promise<{ slug: string }> };

// ── Treści artykułów ─────────────────────────────────────────────────────────

const ARTICLES: Record<string, {
  content: string;
  faqs: { q: string; a: string }[];
}> = {

'kiedy-tankowac-najtaniej-dzien-pora': {
  faqs: [
    { q: 'Który dzień tygodnia jest najtańszy do tankowania?', a: 'Statystycznie najniższe ceny paliw w Polsce notuje się w poniedziałek i wtorek rano. Stacje często obniżają ceny po weekendzie, gdy spada popyt. Najdrożej bywa w piątek po południu i w sobotę.' },
    { q: 'O której godzinie tankować najtaniej?', a: 'Rano (6:00–8:00) ceny bywają nieco niższe, ponieważ gęstsze (zimniejsze) paliwo daje więcej energii na litr. Różnica jest niewielka (1–2%), ale przy pełnym baku to kilka złotych.' },
    { q: 'Czy ceny paliw rosną przed długim weekendem?', a: 'Tak. Stacje paliw przy trasach krajowych i autostradach często podnoszą ceny 2–3 dni przed majówką, wakacjami czy Bożym Narodzeniem. Warto zatankować do pełna kilka dni wcześniej.' },
    { q: 'Jak sprawdzić aktualne ceny paliw przed tankowaniem?', a: 'Skorzystaj z BenzynaMAPA.pl – aktualizujemy ceny 3 razy dziennie. Mapa pokazuje najtańsze stacje w Twojej okolicy oznaczone kolorem zielonym.' },
  ],
  content: `
## Czy dzień tygodnia naprawdę ma znaczenie?

Tak – i to bardziej niż myślisz. Analiza danych cenowych z polskich stacji paliw pokazuje wyraźny wzorzec tygodniowy. Stacje **obniżają ceny w poniedziałek i wtorek**, gdy ruch jest mniejszy po weekendzie, i **podnoszą w czwartek–piątek**, gdy kierowcy tankują przed wyjazdem na weekend.

Średnia różnica między najtańszym a najdroższym dniem tygodnia wynosi **0,08–0,15 zł/l**. Przy baku 50 litrów to 4–7,50 zł za każde tankowanie – rocznie nawet **200 zł oszczędności**.

## Najlepsze dni do tankowania w Polsce

### Poniedziałek i wtorek – złote dni

Poniedziałkowe poranki to najlepszy czas na tankowanie z kilku powodów:

- Niższy ruch w stosunku do weekendu → stacje nie mogą narzucać wysokich marż
- Obniżki po weekendzie, gdy zbiorniki zapełniają się po słabszej sprzedaży
- Ceny hurtowe z piątku (często niższe) przekładają się na niższe ceny detaliczne

### Czwartek–piątek – unikaj jeśli możesz

Przed weekendem popyt rośnie gwałtownie. Kierowcy tankują na wyjazd, stacje korzystają z okazji. W piątek między 15:00 a 19:00 ceny bywają o **0,10–0,18 zł/l wyższe** niż poniedziałkowym rankiem.

## Pora dnia: czy rano naprawdę jest taniej?

Często słyszy się radę: *tankuj rano, gdy paliwo jest zimne i gęstsze*. Czy to prawda?

**Częściowo tak.** Paliwo w temperaturze 10°C jest gęstsze niż w 25°C. Teoretycznie litr zimnego paliwa ma więcej energii niż litr ciepłego. Jednak w praktyce **zbiorniki na stacjach są zakopane w ziemi** – ich temperatura zmienia się o zaledwie 1–3°C przez całą dobę.

Realny efekt: znikomy (0,5–1%). Ważniejsze jest samo **wybranie najtańszej stacji** – różnica między najtańszą a najdroższą w tym samym mieście to często 0,20–0,40 zł/l.

## Przed długim weekendem: tankuj 3 dni wcześniej

To najważniejsza zasada. Analizy cen przy polskich długich weekendach (majówka, wakacje, Boże Narodzenie) pokazują stały wzorzec:

| Czas przed weekendem | Zmiana ceny |
|---|---|
| 5–7 dni wcześniej | Ceny normalne lub lekko niższe |
| 3–4 dni wcześniej | Wzrost o 0,05–0,10 zł/l |
| 1–2 dni wcześniej | Wzrost o 0,10–0,20 zł/l |
| W dzień wyjazdu | Szczyt cen (szczególnie przy autostradach) |

**Wniosek:** Na majówkę 2026 tankuj najpóźniej w środę 29 kwietnia.

## Podsumowanie: kiedy tankować najtaniej

1. **Dzień:** poniedziałek lub wtorek
2. **Godzina:** rano (6:00–10:00)
3. **Przed długim weekendem:** minimum 3 dni wcześniej
4. **Stacja:** unikaj autostrad i centrów miast, wybierz stację przy hipermarkecie lub sieć niezależną

Używaj BenzynaMAPA.pl – nasza mapa pokazuje aktualne ceny w Twojej okolicy i podświetla najtańsze stacje na zielono.
`,
},

'lpg-oplacalnosc-kalkulator-2026': {
  faqs: [
    { q: 'Ile kosztuje przeróbka samochodu na LPG w 2026?', a: 'Przeróbka samochodu benzynowego na LPG kosztuje w Polsce od 2 500 zł (instalacja sekwencyjna do silników wolnossących) do 5 000 zł (instalacja do silników turbodoładowanych lub z bezpośrednim wtryskiem). Przy rocznym przebiegu 20 000 km i cenie LPG 2,90 zł/l inwestycja zwraca się w 2–4 lata.' },
    { q: 'Ile LPG zużywa auto vs benzyna?', a: 'Silniki na LPG zużywają o 15–25% więcej paliwa w litrach niż na benzynie. Przy benzynie 7 l/100km, na LPG będzie to ok. 8,5–9 l/100km. Jednak LPG kosztuje ~2,90 zł/l vs ~6,40 zł/l za benzynę, więc koszt na km jest o 40–50% niższy.' },
    { q: 'Które samochody najlepiej nadają się na LPG?', a: 'Najlepiej sprawdzają się silniki benzynowe wolnossące (1,0–2,0l) starszego typu (do 2015). Silniki z bezpośrednim wtryskiem (np. Audi TSI, Ford EcoBoost) wymagają droższej instalacji i mogą mieć problemy z zaworami. Zawsze konsultuj z instalatorem LPG.' },
    { q: 'Czy LPG jest dostępne wszędzie w Polsce?', a: 'LPG jest dostępne na ok. 6 000 stacjach paliw w Polsce – to prawie 70% wszystkich stacji. Sieć jest dobrze rozwinięta, choć gorsza niż na zachodzie kraju. Na BenzynaMAPA.pl możesz filtrować stacje z LPG i sprawdzić aktualne ceny autogazu.' },
  ],
  content: `
## LPG w Polsce 2026 – aktualne ceny i popularność

Polska jest **europejskim liderem w popularności LPG** – mamy ponad 3 miliony samochodów z instalacją gazową, więcej niż jakikolwiek inny kraj EU. Dlaczego? Bo różnica cenowa jest tu wyjątkowo atrakcyjna.

| Paliwo | Cena (maj 2026) | Koszt na 100 km* |
|---|---|---|
| Benzyna 95 | ok. 6,40 zł/l | ok. 44,80 zł |
| Diesel | ok. 6,20 zł/l | ok. 37,20 zł |
| **LPG** | **ok. 2,90 zł/l** | **ok. 24,65 zł** |

*Przy typowej miejskiej jeździe (7 l/100km benzyna, 8,5 l/100km LPG)

## Kalkulator opłacalności LPG

### Założenia przykładowe

- Roczny przebieg: **20 000 km**
- Obecne auto: benzyna 7 l/100km
- LPG: 8,5 l/100km
- Koszt instalacji: **3 500 zł**

### Obliczenia

**Roczny koszt paliwa na benzynie:**
20 000 km / 100 × 7 l × 6,40 zł = **8 960 zł**

**Roczny koszt na LPG:**
20 000 km / 100 × 8,5 l × 2,90 zł = **4 930 zł**

**Oszczędność roczna: 4 030 zł**

**Zwrot inwestycji (3 500 zł): ok. 10,5 miesiąca** ✅

### Przy rocznym przebiegu 10 000 km:
Zwrot: ok. 21 miesięcy – nadal bardzo korzystne.

## Rodzaje instalacji LPG – co wybrać?

### Instalacja do silników z pośrednim wtryskiem (MPI/SPI)
- **Koszt:** 2 500–3 200 zł
- **Sprawdza się w:** Skoda Fabia, VW Polo, Toyota Yaris (starsze), Renault Clio
- **Zalety:** sprawdzona technologia, tania obsługa
- **Wady:** nie do silników TSI/GDI

### Instalacja do silników z bezpośrednim wtryskiem (GDI/TSI/FSI)
- **Koszt:** 3 500–5 000 zł
- **Sprawdza się w:** Audi A3 1.4 TSI, Opel Astra 1.6 Turbo, Ford Focus 1.5 EcoBoost
- **Zalety:** oszczędności takie same jak MPI
- **Wady:** droższa instalacja, wymaga regularnego mycia zaworów

## Ważne: serwis instalacji LPG

Instalacja LPG wymaga regularnego przeglądu:
- Co **30 000 km lub rok** – wymiana filtrów, sprawdzenie uszczelnień
- Koszt przeglądu: **150–300 zł**
- Badanie techniczne: filtr gazu ulega wymianie co 2 lata

## Podsumowanie: czy LPG się opłaca w 2026?

**Tak, jeśli:**
- Roczny przebieg > 12 000 km
- Auto ma silnik wolnossący lub prosty turbodoładowany
- Planujesz zatrzymać auto minimum 3–4 lata

**Nie warto, jeśli:**
- Roczny przebieg < 8 000 km
- Auto ma silnik GDI/TSI/EcoBoost i mały przebieg
- Planujesz sprzedać auto w ciągu 2 lat

Ceny LPG na stacjach w Twojej okolicy sprawdzisz na **BenzynaMAPA.pl** – filtruj mapę według paliwa LPG i jedź na najtańszą stację.
`,
},

'ceny-paliw-polska-vs-europa-2026': {
  faqs: [
    { q: 'Czy paliwo w Polsce jest tanie w porównaniu do Europy?', a: 'Tak. Polska należy do TOP 5 najtańszych krajów EU pod względem cen paliw. Benzyna 95 kosztuje w Polsce średnio ok. 6,40 zł/l (1,60 EUR), podczas gdy w Niemczech to ok. 1,85 EUR/l, we Francji 1,78 EUR/l, a w Holandii ponad 2,00 EUR/l.' },
    { q: 'Gdzie w Europie jest najtańsze paliwo?', a: 'Najtańsze paliwo w UE ma Bułgaria (ok. 1,35 EUR/l za PB95) i Węgry (regulowane ceny). Poza UE bardzo tanio jest w Rosji, Białorusi i Azerbejdżanie, ale tam nie dotyczy to polskich kierowców.' },
    { q: 'Dlaczego paliwo w Polsce jest tańsze niż na zachodzie Europy?', a: 'Główne przyczyny: niższe podatki akcyzowe (Polska płaci minimalną unijną stawkę), niższy VAT efektywny na paliwa, oraz tańsza logistyka wynikająca z bliskości rafinerii PKN Orlen w Płocku i Gdańsku.' },
    { q: 'Czy opłaca się tankować w Niemczech jadąc przez Polskę?', a: 'Nie – paliwo w Niemczech jest droższe o ok. 0,80 zł/l. Tankowanie w Polsce i wyjazd do Niemiec z pełnym bakiem to dobra strategia. Przy baku 50 litrów oszczędzasz ok. 40 zł tankując w Polsce zamiast w Niemczech.' },
  ],
  content: `
## Polska na mapie cen paliw w Europie 2026

Polska kierowcy mają powody do zadowolenia – pod względem cen paliw jesteśmy w europejskiej czołówce najtańszych krajów. Oto aktualne porównanie (maj 2026):

## Ranking cen benzyny 95 w Europie (maj 2026)

| Kraj | Cena EUR/l | Cena PLN/l* | vs Polska |
|---|---|---|---|
| 🇧🇬 Bułgaria | 1,30 EUR | 5,50 zł | -0,90 zł |
| 🇭🇺 Węgry | 1,40 EUR | 5,90 zł | -0,50 zł |
| 🇷🇴 Rumunia | 1,48 EUR | 6,20 zł | -0,20 zł |
| 🇵🇱 **Polska** | **1,52 EUR** | **6,40 zł** | – |
| 🇨🇿 Czechy | 1,55 EUR | 6,55 zł | +0,15 zł |
| 🇦🇹 Austria | 1,62 EUR | 6,85 zł | +0,45 zł |
| 🇩🇪 Niemcy | 1,80 EUR | 7,60 zł | +1,20 zł |
| 🇫🇷 Francja | 1,75 EUR | 7,40 zł | +1,00 zł |
| 🇧🇪 Belgia | 1,88 EUR | 7,95 zł | +1,55 zł |
| 🇳🇱 Holandia | 2,05 EUR | 8,65 zł | +2,25 zł |

*Przeliczone po kursie EUR/PLN = 4,22

## Dlaczego w Polsce jest taniej?

### 1. Niższe podatki akcyzowe

Polska stosuje **minimalną unijną stawkę akcyzy** na paliwa motoryzacyjne. Zachodnie kraje – szczególnie Niemcy, Francja, Holandia – nałożyły dodatkowe podatki klimatyczne, które windują ceny.

- Akcyza na benzynę w Polsce: **1 557 zł/1000 l**
- Niemcy: odpowiednik ok. **2 400 zł/1000 l** (+ podatek CO₂)
- Holandia: odpowiednik ok. **3 100 zł/1000 l**

### 2. Polska rafineria i logistyka

PKN Orlen (właściciel m.in. Lotosu i sieci stacji w Polsce) posiada rafinerie w Płocku i Gdańsku. Krótki łańcuch dostaw = niższe koszty logistyczne o ok. **0,15–0,25 EUR/l** w porównaniu do krajów bez własnego przetwarzania ropy.

### 3. Mniejsza marża detaliczna

Gęstość stacji paliw w Polsce (ok. 1 stacja na 6 000 mieszkańców) jest wyższa niż w Europie Zachodniej, co wymusza większą konkurencję cenową między sieciami.

## Turystyka paliwowa: gdzie i kiedy się opłaca?

### Jadąc do Czech
Ceny w Czechach są zbliżone lub nieznacznie wyższe niż w Polsce. **Nie ma sensu tankować w Czechach** – zatankuj do pełna w Polsce przed wyjazdem.

### Jadąc do Niemiec
Niemcy są droższe o ok. 1,20 zł/l. **Zawsze tankuj do pełna w Polsce** – przy wjeździe do Niemiec oszczędzasz ok. 60 zł na 50-litrowym baku.

### Jadąc z Niemiec do Polski
Tankuj w Polsce jak tylko przekroczysz granicę – możesz zaoszczędzić do **80–100 zł** na pełnym baku.

## Prognozy: czy ceny w Polsce wzrosną do poziomu europejskiego?

Presja UE na harmonizację podatków paliwowych jest realna, ale **nie szybka**. Do 2030 roku nie przewiduje się rewolucyjnych zmian w polskiej akcyzie. Większe ryzyko to:

- Wzrost podatku CO₂ w ramach ETS2 (planowany od 2027)
- Ewentualne podniesienie minimalnej stawki akcyzy UE

Na razie polscy kierowcy należą do najtaniej tankujących w Europie. Sprawdzaj aktualne ceny na **BenzynaMAPA.pl** i zawsze tankuj na najtańszej stacji w okolicy.
`,
},

'jak-oszczedzac-na-paliwie-10-sposobow': {
  faqs: [
    { q: 'Ile można zaoszczędzić na paliwie stosując eco-driving?', a: 'Spokojny styl jazdy (płynne przyspieszanie, unikanie gwałtownego hamowania, jazda na biegu jałowym zamiast wyłączania silnika) może obniżyć zużycie paliwa o 10–25%. Przy spalaniu 7 l/100km i przebiegu 20 000 km/rok to oszczędność 700–1 750 zł rocznie.' },
    { q: 'Czy klimatyzacja znacząco zwiększa zużycie paliwa?', a: 'Tak. Klimatyzacja zwiększa spalanie o 0,5–1,5 l/100km, szczególnie w korkach. Przy miejskiej jeździe latem może to być wzrost o 15–20%. Przy prędkości powyżej 80 km/h bardziej opłaca się klimatyzacja niż otwarte okna (opór aerodynamiczny).' },
    { q: 'Czy warto używać aplikacji do monitorowania cen paliw?', a: 'Zdecydowanie tak. Różnica między najtańszą a najdroższą stacją w tym samym mieście wynosi 0,20–0,50 zł/l. BenzynaMAPA.pl aktualizuje ceny 3 razy dziennie i pokazuje najtańsze stacje w okolicy na interaktywnej mapie.' },
    { q: 'Jakie ciśnienie w oponach jest optymalne dla oszczędności paliwa?', a: 'Niedopompowane opony o 0,5 bar zwiększają spalanie o ok. 2–3%. Sprawdzaj ciśnienie co miesiąc i zawsze gdy zmienia się temperatura o ponad 10°C. Optymalne ciśnienie znajdziesz w instrukcji auta lub na słupku drzwi kierowcy.' },
  ],
  content: `
## 10 sprawdzonych sposobów na tańsze tankowanie i mniejsze spalanie

Ceny paliw w Polsce są jedne z niższych w Europie, ale i tak stanowią znaczący wydatek domowy. Stosując poniższe metody możesz obniżyć wydatki na paliwo nawet o **30%** rocznie.

## 1. Wybierz właściwą stację – różnica nawet 0,50 zł/l

Największy potencjał oszczędności. Różnica między najtańszą a najdroższą stacją w tym samym mieście wynosi **0,20–0,50 zł/l**. Używaj **BenzynaMAPA.pl** – aktualizujemy ceny 3 razy dziennie. Przy baku 50 litrów i różnicy 0,40 zł/l oszczędzasz **20 zł za jedno tankowanie**.

## 2. Tankuj w poniedziałek lub wtorek rano

Ceny paliw w Polsce mają stały wzorzec tygodniowy. Najtaniej bywa w poniedziałek–wtorek rano, najdrożej w piątek–sobotę. Różnica: **0,08–0,15 zł/l**.

## 3. Unikaj autostrad i centrów miast

Stacje przy autostradach i w centrum dużych miast są droższe nawet o **0,30–0,50 zł/l**. Gdy jedziesz autostradą, zatankuj przed wjazdem na bramkę – na stacjach przy zjazdach możesz zapłacić o 30 zł więcej za pełny bak.

## 4. Eco-driving – spokojny styl jazdy (-15% spalania)

- **Płynne przyspieszanie**: zamiast "gaz do dechy" → powoli rozwijaj prędkość
- **Antycypacja**: patrz 200–300 m przed siebie, przewiduj czerwone światła
- **Optymalne obroty**: przy silnikach benzynowych – zmieniaj bieg przy 2 000–2 500 obr./min
- **Hamowanie silnikiem**: zamiast hamulca zwalniaj z włączonym biegiem

Efekt: **10–20% niższe zużycie paliwa**. Przy 7 l/100km i przebiegu 20 000 km/rok – **1 400–2 800 zł oszczędności**.

## 5. Odpompuj opony do właściwego ciśnienia (+3% oszczędności)

Sprawdzaj ciśnienie **co miesiąc**. Opony niedopompowane o 0,5 bar zwiększają opory toczenia o 5–10% i spalanie o 2–4%. Optymalne ciśnienie znajdziesz na słupku drzwi kierowcy lub w instrukcji obsługi.

## 6. Używaj kart lojalnościowych

- **Orlen Vitay**: zwrot punktów za każdy litr (ekwiwalent ~0,03 zł/l)
- **BP BonusMania**: podobny program, bonusy za tankowanie
- **Shell ClubSmart**: karty paliwowe z rabatami dla firm i flot

Karty lojalnościowe same w sobie nie zrobią rewolucji, ale połączone z wyborem najtańszej stacji dają dodatkowe **2–4% oszczędności**.

## 7. Klimatyzacja – używaj mądrze

Klimatyzacja zwiększa spalanie o **0,5–1,5 l/100km**. Zasady mądrego używania:
- W mieście: ogranicz do minimum lub jedź z oknami
- Na trasie powyżej 80 km/h: klimatyzacja jest lepsza niż otwarte okno (mniejszy opór aerodynamiczny)
- Przed wyjazdem: przez 2 minuty jedź z otwartymi oknami, żeby wywietrzyć nagrzane wnętrze, potem włącz AC

## 8. Usuń zbędny bagaż (+2% przy 50 kg)

Każde 100 kg dodatkowego ciężaru zwiększa spalanie o ok. 0,5–0,8 l/100km. Sprawdź bagażnik – czy naprawdę potrzebujesz narzędzi, ubrań lub innego balastu?

## 9. Tankuj do pełna (przy dobrych cenach)

Gdy ceny paliwa są niskie lub jesteś na najtańszej stacji – tankuj do pełna. Unikasz sytuacji, gdy następnego dnia ceny wzrosną o 0,15 zł/l, a ty musisz tankować "jak stoisz".

## 10. Rozważ LPG (przy przebiegu >15 000 km/rok)

Przy rocznym przebiegu powyżej 15 000 km instalacja LPG zwraca się w 2–3 lata i przynosi **3 000–5 000 zł oszczędności rocznie**. LPG kosztuje ok. 2,90 zł/l vs 6,40 zł/l za benzynę.

## Podsumowanie: ile możesz zaoszczędzić?

| Metoda | Oszczędność roczna |
|---|---|
| Wybór najtańszej stacji | 400–1 000 zł |
| Eco-driving | 700–1 400 zł |
| Właściwe opony | 100–200 zł |
| Klimatyzacja | 200–400 zł |
| Karta lojalnościowa | 100–200 zł |
| **Razem** | **1 500–3 200 zł** |

Zacznij od najłatwiejszego: zainstaluj **BenzynaMAPA.pl** jako zakładkę w przeglądarce i przed każdym tankowaniem sprawdź, która stacja jest najtańsza.
`,
},

'prognozy-cen-paliw-polska-2026': {
  faqs: [
    { q: 'Kiedy benzyna potanieje w 2026?', a: 'Prognoza na II połowę 2026 zakłada stabilizację lub lekki spadek cen benzyny. Kluczowe czynniki to cena ropy Brent (prognoza $70–80/baryłkę) i kurs PLN/USD. Jeśli złoty się umocni lub ropa stanieje, ceny benzyny mogą spaść o 0,20–0,30 zł/l.' },
    { q: 'Co wpływa na ceny paliw w Polsce?', a: 'Główne czynniki: cena ropy Brent (ok. 50% ceny paliwa), kurs PLN/USD (mocniejszy złoty = tańsze paliwo), stawki akcyzy i VAT (niezmienne krótkoterminowo), marże rafinerii i stacji paliw (zmienne, ok. 10–15% ceny).' },
    { q: 'Czy warto kupić więcej paliwa w kanistrach gdy jest tanio?', a: 'Kanistrowe tankowanie jest legalne i opłacalne, ale wymaga przestrzegania przepisów: maksymalnie 3 kanistr po 10 litrów lub 1 kanister 30 litrów w samochodzie osobowym. Paliwo można przechowywać ok. 3–6 miesięcy. Przy różnicy 0,20 zł/l na 30 litrach oszczędzasz 6 zł – nieduże korzyści.' },
    { q: 'Kiedy ceny rosną przez wakacje?', a: 'Lipiec–sierpień to tradycyjnie sezon wyższych cen paliw w Polsce. Wzrost cen wakacyjnych wynosi zazwyczaj 0,10–0,20 zł/l i jest związany ze wzmożonym ruchem turystycznym. Sierpień jest zwykle droższy niż lipiec.' },
  ],
  content: `
## Ceny paliw w Polsce 2026 – analiza i prognoza

Zrozumienie mechanizmów kształtowania cen paliw pozwala podejmować lepsze decyzje – kiedy tankować do pełna, kiedy tankować mniej, a kiedy sprawdzić się zakup kanistrów.

## Co kształtuje cenę paliwa w Polsce?

### 1. Ropa Brent (ok. 50% ceny paliwa)

Ropa naftowa to podstawowy surowiec. Cena baryłki Brent przeliczona na litry stanowi **45–55% ostatecznej ceny** benzyny na stacji. Gdy ropa kosztuje $80/baryłkę, litr benzyny w Europie kosztuje ok. 1,55–1,65 EUR. Gdy drożeje do $100 – ok. 1,80–1,95 EUR.

### 2. Kurs PLN/USD (wpływ pośredni)

Ropa jest wyceniana w dolarach. Mocniejszy złoty = tańsza ropa dla polskich rafinerii = niższe ceny na stacjach.

- USD/PLN = 3,80 → benzyna tańsza o ok. 0,15 zł/l vs baseline
- USD/PLN = 4,20 → ceny standardowe
- USD/PLN = 4,60 → benzyna droższa o ok. 0,20 zł/l

### 3. Podatki (stałe krótkoterminowo)

- **Akcyza**: 1 557 zł/1000 l (ok. 1,56 zł/l) – niezmieniona od 2023
- **VAT 23%**: obowiązuje od 2023, wcześniej była tarcza antyinflacyjna z 8% VAT
- Łącznie podatki stanowią ok. **45–50% ceny detalicznej**

### 4. Marże rafinerii i stacji (10–15%)

Orlen (dominujący gracz w Polsce) ma wpływ na marże przetwórcze. Marże stacji detalicznych wynoszą zazwyczaj **0,10–0,25 zł/l** i zmieniają się sezonowo.

## Prognoza cen paliw na II połowę 2026

### Scenariusz bazowy (prawdopodobieństwo: 60%)

- Ropa Brent: $72–82/baryłkę
- USD/PLN: 4,05–4,25
- **Benzyna 95: 6,20–6,60 zł/l**
- **Diesel: 6,00–6,40 zł/l**
- **LPG: 2,80–3,00 zł/l**

### Scenariusz optymistyczny (20%)

- Napięcia geopolityczne opadają, OPEC+ podnosi wydobycie
- Ropa schodzi do $65/baryłkę
- Złoty się umacnia do 3,95 USD/PLN
- **Benzyna 95 mogłaby spaść do 5,90–6,10 zł/l**

### Scenariusz pesymistyczny (20%)

- Eskalacja konfliktu na Bliskim Wschodzie lub nowe sankcje
- Ropa wzrasta do $95/baryłkę
- Osłabienie złotego
- **Benzyna 95 mogłaby wzrosnąć do 6,80–7,20 zł/l**

## Kalendarz sezonowy cen paliw

| Miesiąc | Tendencja | Powód |
|---|---|---|
| Styczeń–luty | ↓ Niższe | Mniejszy popyt po świętach |
| Marzec–kwiecień | → Stabilne | Normalizacja |
| Maj–czerwiec | ↑ Rosnące | Sezon wyjazdowy |
| Lipiec–sierpień | ↑ Szczyt | Wakacje, turystyka |
| Wrzesień–październik | ↓ Spadające | Koniec sezonu |
| Listopad–grudzień | → Stabilne lub ↑ | Zmienne, wpływ świąt |

## Praktyczne wnioski

1. **Maj–wrzesień**: tankuj do pełna przy każdej okazji, gdy widzisz dobre ceny
2. **Październik–luty**: sezon potencjalnie tańszych cen – możesz być mniej agresywny w tankowaniu
3. **Przed długimi weekendami**: zawsze tankuj min. 3 dni wcześniej
4. **Śledź cenę ropy Brent**: jeśli spadła o $5–10 w ciągu tygodnia, ceny na stacjach powinny spaść za 1–2 tygodnie

Monitoruj aktualne ceny w Twojej okolicy na **BenzynaMAPA.pl** – to najlepszy sposób na śledzenie trendów cenowych w czasie rzeczywistym.
`,
},

'adblue-co-to-jest-cena-gdzie-kupic-2026': {
  faqs: [
    { q: 'Które auta potrzebują AdBlue?', a: 'Wszystkie samochody dieselowe z normą Euro 5 (od 2011) i Euro 6 (od 2014) mają system SCR wymagający AdBlue. Dotyczy to m.in. Volkswagen, Audi, BMW, Mercedes, Volvo, Opel, Ford, Renault, Toyota (hybryd diesel), Skoda. Sprawdź instrukcję obsługi – jeśli jest zbiornik AdBlue, musisz go regularnie uzupełniać.' },
    { q: 'Ile AdBlue zużywa samochód?', a: 'Przeciętny samochód osobowy zużywa 1–1,5 litra AdBlue na każde 1000 km. Przy przebiegu 20 000 km/rok to 20–30 litrów rocznie. Dostawczaki i SUV zużywają więcej – nawet 2–3 l/1000 km.' },
    { q: 'Czy mogę dolać wodę zamiast AdBlue?', a: 'Absolutnie nie! Dolanie wody lub nieodpowiedniego płynu zamiast AdBlue może uszkodzić układ SCR, co skutkuje naprawą za 5 000–20 000 zł. Używaj tylko oryginalnego AdBlue (specyfikacja ISO 22241).' },
    { q: 'Gdzie najtaniej kupić AdBlue w Polsce?', a: 'Najtaniej w sklepach motoryzacyjnych (Obi, Leroy Merlin) lub w hurtowniach – 4–6 zł/l za 10-litrowy kanister. Na stacjach paliw (Orlen, Shell, BP) kosztuje 8–15 zł/l. Różnica jest kolosalna – przy 20 litrach rocznie oszczędzasz 40–180 zł kupując poza stacją.' },
  ],
  content: `
## Co to jest AdBlue?

**AdBlue** to wodny roztwór mocznika (32,5% czysta mocznik + 67,5% demineralizowana woda). Nie jest to paliwo – to środek chemiczny używany do **redukcji szkodliwych emisji** z silników dieselowych.

Stosuje się go w systemie **SCR** (Selective Catalytic Reduction), który rozkłada tlenki azotu (NOₓ) z spalin na nieszkodliwy azot (N₂) i wodę. To właśnie dzięki AdBlue nowoczesne silniki Diesla spełniają rygorystyczne normy emisji Euro 5 i Euro 6.

## Które samochody potrzebują AdBlue?

Praktycznie każdy **diesel zakupiony w Polsce po 2011 roku** (Euro 5+). Obejmuje to:

- **Volkswagen/Audi/Skoda/SEAT**: TDI 2.0 od 2013, wszystkie od 2016
- **BMW**: silniki 20d, 30d od 2011
- **Mercedes**: OM651, OM654 – praktycznie wszystkie diesle od 2012
- **Ford**: TDCi EcoBlue od 2017
- **Opel/Vauxhall**: CDTi od 2015
- **Renault/Dacia**: dCi od 2014
- **Toyota**: RAV4 i Proace z dieslem

Jeśli nie jesteś pewien – sprawdź instrukcję obsługi lub poszukaj niebieskiej nakrętki przy wlewie paliwa (lub osobnego wlewu z niebieską etykietą).

## Ceny AdBlue w Polsce 2026 – gdzie najtaniej?

Różnica cen AdBlue między miejscami zakupu jest **ogromna**:

| Miejsce zakupu | Cena za litr | Uwagi |
|---|---|---|
| Obi / Leroy Merlin (10L) | 3,50–5,00 zł | Kanister 10L, najtaniej |
| Amazon.pl (10L, 20L) | 4,00–5,50 zł | Dostawa do domu |
| Hurtownie motoryzacyjne | 3,80–5,20 zł | Przy zakupie 20L+ |
| Orlen – stojan | 8,90–12,00 zł | Wygodne, ale drogie |
| Shell/BP – stojan | 10,00–15,00 zł | Najdrożej |
| Niezależne stacje | 7,00–10,00 zł | Różnie |

**Wniosek:** Kupuj AdBlue w kanisterach 10–20L w sklepach DIY lub online. Oszczędność przy 20 litrach rocznie: **60–200 zł**.

## Co się stanie, gdy AdBlue skończy się całkowicie?

To jedno z częstszych pytań kierowców. Konsekwencje różnią się w zależności od marki:

1. **Pierwsze ostrzeżenie**: przy ~2 500 km przed końcem (lampka kontrolna)
2. **Drugie ostrzeżenie**: przy ~500 km – głośny alarm, ograniczenie prędkości
3. **Całkowite opróżnienie**:
   - VW/Audi/Skoda: auto nie odpali po wyłączeniu silnika
   - BMW/Mercedes: przejście w tryb awaryjny, ograniczenie do 90 km/h
   - Ford/Opel: ograniczenie mocy o 50%

**Nigdy nie ignoruj lampki AdBlue.**

## Jak i gdzie uzupełnić AdBlue?

### Na stacji paliw
Większość stacji Orlen, BP, Shell, Lotos ma dystrybutory AdBlue. Wystarczy podejść do specjalnego pistoletu (niebieska oznaczenie). Wygodne, ale drogie – 8–15 zł/l.

### Samodzielnie – kanister
Kup 10-litrowy kanister w sklepie motoryzacyjnym (Midas, Bosch Car Service) lub markecie. Wlej przez lejek – wlew AdBlue ma specjalny kształt, nie pomylisz z wlewem paliwa.

**Uwaga:** AdBlue krystalizuje w kontakcie z metalem – używaj plastikowych pojemników i lejków.

## Podsumowanie

AdBlue to konieczność w każdym nowoczesnym dieslu – nie ma od tego ucieczki. Ale możesz znacznie ograniczyć koszty:

1. Kupuj w kanisterach 10–20L w Obi/Leroy Merlin (3–5 zł/l, nie 12 zł/l)
2. Uzupełniaj regularnie – nie czekaj na czerwone ostrzeżenie
3. Przechowuj w chłodnym miejscu (nie zamarza do -11°C, nie zostawiaj w aucie latem)

Ceny diesla i lokalizacje stacji z AdBlue sprawdzisz na **BenzynaMAPA.pl**.
`,
},

'karty-paliwowe-orlen-vitay-bp-porownanie-2026': {
  faqs: [
    { q: 'Która karta lojalnościowa stacji paliw jest najlepsza w Polsce?', a: 'Orlen Vitay to najpopularniejsza karta w Polsce (największa sieć stacji). Daje ok. 0,03 zł zwrotu na każdy litr. BP BonusMania ma podobny program. Dla firm najlepsze są karty flotowe Orlenu lub Shella – dają stały rabat 0,10–0,20 zł/l.' },
    { q: 'Czy karty lojalnościowe na stacjach naprawdę się opłacają?', a: 'Karty lojalnościowe dają rabaty 0,03–0,08 zł/l – to realny zysk, ale mały. Ważniejsze jest wybranie najtańszej stacji w okolicy – różnica między najdroższą a najtańszą stacją w mieście (0,20–0,50 zł/l) jest 5–10 razy większa niż korzyść z karty lojalnościowej.' },
    { q: 'Czym różni się karta flotowa od karty lojalnościowej?', a: 'Karta flotowa (paliwowa) to karta dla firm umożliwiająca tankowanie na kredyt z fakturą VAT i ewentualnymi rabatami zależnymi od wolumenu. Karta lojalnościowa to program punktowy dla klientów indywidualnych. Firmy powinny mieć obie.' },
    { q: 'Jak działa Orlen Vitay?', a: 'Za każdy litr kupionego paliwa na stacjach Orlen, Lotos i w sklepach Stop Cafe zbierasz punkty Vitay. 1 punkt = ok. 1 grosz rabatu. Za 50-litrowe tankowanie zbierasz ~50 punktów = 0,50 zł wartości. Punkty można wymieniać na zniżki na paliwo, produkty w sklepie lub vouchery.' },
  ],
  content: `
## Karty paliwowe i lojalnościowe – czy warto?

Programy lojalnościowe stacji paliw to temat, który budzi skrajne opinie. Jedni uważają je za rewolucję w oszczędzaniu, inni za marketingowy chwyt. Prawda leży pośrodku – **warto mieć kartę, ale nie powinna być głównym kryterium wyboru stacji**.

## Najważniejsze programy lojalnościowe w Polsce 2026

### Orlen Vitay (Orlen + Lotos)

**Dostępność:** ok. 1 800 stacji Orlen i Lotos w Polsce – największa sieć

**Jak działa:**
- 1 punkt za każde 2 zł wydane na paliwo
- 1 punkt za każde 1 zł wydane w sklepie Stop Cafe
- 100 punktów = 1 zł wartości (0,03 zł/l przy cenie 6,40 zł/l)

**Korzyść na 1 000 litrów paliwa:** ok. 30 zł

**Dodatkowe zalety:**
- Zniżki w sklepach partnerskich (Empik, Decathlon)
- Rabaty na myjnie samochodowe
- Aplikacja mobilna z historią zakupów

**Ocena:** ⭐⭐⭐⭐ – dobry program, warto mieć jeśli tankowałeś dotąd na Orlenie

---

### BP BonusMania

**Dostępność:** ok. 340 stacji BP w Polsce

**Jak działa:**
- Zbierasz punkty za zakupy na stacji (paliwo + sklep)
- Punkty wymieniane na nagrody lub zniżki paliwowe
- Podobny poziom korzyści jak Vitay (~0,03 zł/l)

**Korzyść na 1 000 litrów:** ok. 25–35 zł

**Ocena:** ⭐⭐⭐ – mniejsza sieć niż Orlen, ale program zbliżony

---

### Shell ClubSmart

**Dostępność:** ok. 430 stacji Shell w Polsce

**Jak działa:**
- Karta z punktami za tankowanie
- Dodatkowe oferty "Wybierz i Zysk" – cotygodniowe produkty w niskiej cenie

**Uwaga:** Shell jest regularnie droższy od średniej o 0,30–0,40 zł/l. Karta lojalnościowa Shell nie wynagrodzi tej różnicy.

**Ocena:** ⭐⭐ – zbyt droga sieć, żeby karta miała sens

---

### Circle K Easy

**Dostępność:** ok. 230 stacji Circle K

**Jak działa:**
- Aplikacja mobilna z kuponami i rabatami
- Comiesięczne oferty specjalne
- Zbierasz "piastry" za tankowanie

**Ocena:** ⭐⭐⭐ – ciekawe oferty, ale mała sieć

---

## Karty flotowe dla firm

Jeśli prowadzisz firmę z flotą samochodów, karty flotowe są znacznie ważniejsze niż lojalnościowe:

| Karta | Rabat na litrze | Faktura VAT | Raportowanie |
|---|---|---|---|
| Orlen Flota | 0,08–0,20 zł/l | ✅ | ✅ Online |
| Shell Fleet Card | 0,05–0,15 zł/l | ✅ | ✅ Online |
| BP Flota | 0,05–0,12 zł/l | ✅ | ✅ Online |
| Circle K Fleet | 0,05–0,10 zł/l | ✅ | ✅ Online |

Rabat zależy od miesięcznego wolumenu. Przy 5 000 litrów/miesiąc możesz negocjować lepsze warunki.

## Strategia: połącz kartę z BenzynaMAPA.pl

Największy błąd użytkowników kart lojalnościowych to **tankowanie na "swojej" stacji** bez sprawdzenia cen w okolicy.

Optymalna strategia:
1. Sprawdź ceny na **BenzynaMAPA.pl** – wybierz najtańszą stację w okolicy
2. Jeśli najtańsza stacja ma kartę lojalnościową (np. Orlen) – użyj jej
3. Jeśli najtańsza stacja nie ma "twojej" karty – i tak tam tankuj (różnica w cenie ważniejsza niż punkty)

Pamiętaj: **0,30 zł/l różnicy ceny > 0,03 zł/l wartości punktów**. Zawsze ważniejsza jest cena bazowa.
`,
},

'turystyka-paliwowa-polska-niemcy-czechy-2026': {
  faqs: [
    { q: 'Ile mogę przywieźć paliwa z zagranicy?', a: 'Do Polski możesz przywieźć paliwo tylko w standardowym zbiorniku pojazdu. Nie możesz wozić paliwa w kanistrach przez granicę (wymaga specjalnych pozwoleń przy większych ilościach). W samochodzie osobowym dozwolone jest max. 30 litrów w kanisterze – ale to zasada dla jazdy po Polsce, nie importu.' },
    { q: 'Czy tankowanie w Czechach się opłaca?', a: 'Rzadko. Ceny paliw w Czechach są zbliżone lub nieznacznie wyższe niż w Polsce. Wyjątkiem są regiony przygraniczne, gdzie ceny mogą być podobne. Generalnie – nie warto jeździć specjalnie po tańsze paliwo do Czech.' },
    { q: 'W jakich krajach paliwo jest tańsze niż w Polsce?', a: 'W Unii Europejskiej tańsze paliwo od Polski ma Bułgaria i Węgry. Poza UE: Białoruś i Ukraina (ale sytuacja niestabilna). Nie ma sensu jeździć do Bułgarii po tańsze paliwo – koszt dojazdu wielokrotnie przewyższy oszczędności.' },
    { q: 'Co zrobić gdy ceny na stacji autostradowej są bardzo wysokie?', a: 'Najlepiej zatankować przed wyjazdem na autostradę. Jeśli musisz tankować na autostradzie, poszukaj stacji przy zjeździe (MOP – Miejsca Obsługi Podróżnych) – często są tańsze niż stacje na "kluczowych" węzłach.' },
  ],
  content: `
## Turystyka paliwowa: kiedy i gdzie warto tankować za granicą?

"Turystyka paliwowa" to zjawisko polegające na celowym wyjeździe za granicę w celu zatankowania tańszego paliwa. W Polsce dotyczyło to głównie mieszkańców przygranicza: na wschodzie – Białoruś, na zachodzie – Niemcy (paradoksalnie w kierunku droższym).

Zobaczmy, jak wygląda sytuacja w 2026.

## Polska vs sąsiedzi: aktualne ceny (maj 2026)

| Kraj | Benzyna 95 | vs Polska | Diesel | vs Polska |
|---|---|---|---|---|
| 🇩🇪 Niemcy | ok. 7,60 zł/l | **+1,20 zł** | ok. 7,20 zł/l | **+1,20 zł** |
| 🇨🇿 Czechy | ok. 6,55 zł/l | **+0,15 zł** | ok. 6,35 zł/l | **+0,15 zł** |
| 🇸🇰 Słowacja | ok. 6,70 zł/l | **+0,30 zł** | ok. 6,50 zł/l | **+0,30 zł** |
| 🇱🇹 Litwa | ok. 6,20 zł/l | **-0,20 zł** | ok. 5,95 zł/l | **-0,25 zł** |
| 🇺🇦 Ukraina | ok. 5,50 zł/l | **-0,90 zł** | ok. 5,30 zł/l | **-0,90 zł** |

## Czy warto tankować za granicą?

### Niemcy (drożej niż Polska)
**Strategia:** Zawsze tankuj do PEŁNA w Polsce przed wyjazdem do Niemiec.

Przy baku 55 litrów i różnicy 1,20 zł/l – **oszczędzasz 66 zł** tankując w Polsce zamiast w Niemczech. To znacząca kwota, szczególnie przy dłuższych podróżach.

**Przykład:** Wyjazd Warszawa–Berlin (ok. 575 km):
- Koszty paliwa tankując w Polsce: ok. 7 l/100km × 5,75 × 6,40 zł = **257 zł**
- Koszty tankując w Niemczech: 7 l/100km × 5,75 × 7,60 zł = **305 zł**
- **Oszczędność: ok. 48 zł** (bak na 40 litrów w Polsce)

### Czechy (zbliżone ceny)
Różnica cen między Polską a Czechami jest minimalna (ok. 0,15 zł/l). **Nie ma sensu specjalnie jeździć do Czech** po paliwo. Jeśli jesteś w Czechach i musisz tankować – tanku spokojnie tam.

### Litwa (nieznacznie tańsza)
Litwa jest nieznacznie tańsza (~0,20 zł/l). Mieszkańcy Suwalszczyzny przy granicy z Litwą mogą oszczędzić kilka złotych, ale nie jest to kwota uzasadniająca specjalny wyjazd.

## Stacje przy autostradach – uważaj na ceny!

Największe ceny różnic nie dzieją się na granicy, ale **na autostradach i drogach ekspresowych**. Polskie stacje przy autostradach (ORLEN, Shell, BP na MOP-ach) często mają ceny **o 0,20–0,50 zł/l wyższe** niż te same stacje w pobliskich miastach.

**Strategia na trasy autostradowe:**

1. Zatankuj do pełna przed wjazdem na autostradę
2. Jeśli musisz tankować – szukaj stacji przy zjeździe (kilka km od autostrady), a nie na MOP-ie
3. Używaj BenzynaMAPA.pl do wyszukania najtańszej stacji w pobliżu planowanego zjazdu

**Przykład oszczędności:** Trasa A1 Gdańsk–Katowice (ok. 490 km)
- Tankując na autostradzie (cena 6,80 zł/l): ok. 7 l/100km × 4,9 × 6,80 = **233 zł**
- Tankując przy zjeździe (cena 6,30 zł/l): 7 l/100km × 4,9 × 6,30 = **216 zł**
- **Oszczędność: 17 zł** – bez żadnego wysiłku

## Praktyczne porady dla podróżujących

### Wakacje za granicą

| Kierunek | Gdzie tankować? |
|---|---|
| Niemcy, Austria | Do pełna w Polsce, potem tylko gdy konieczne |
| Czechy, Słowacja | Gdzie wygodnie – różnica minimalna |
| Włochy, Francja | Do pełna w Polsce, uzupełniaj we Włoszech/Francji (droże niż PL) |
| Bałkany (Chorwacja, Serbia) | W Polsce i Węgrzech (tańsze) |

### Paliwo a granica

Pamiętaj, że wjeżdżając do krajów spoza strefy Schengen możesz być pytany o ilość paliwa. Do wielu krajów możesz wjechać z pełnym bakiem, ale kanistry paliwa mogą podlegać deklaracji celnej.

## Podsumowanie

Turystyka paliwowa to temat głównie historyczny – gdy Białoruś była tańsza o 3 zł/l, opłacało się jeździć. Dziś **największe oszczędności są w Polsce**, nie za granicą:

1. ✅ Tankuj w Polsce przed wyjazdem do Niemiec/Austrii
2. ✅ Szukaj stacji poza autostradą przy dłuższych trasach
3. ✅ Używaj BenzynaMAPA.pl do znalezienia najtańszej stacji na trasie
4. ❌ Nie warto specjalnie jeździć do Czech/Słowacji po tańsze paliwo
`,
},

// ── P1.10: 11 nowych artykułów ────────────────────────────────────────────

'akcyza-paliwowa-2026-waloryzacja': {
  faqs: [
    { q: 'Ile wynosi akcyza na paliwo w 2026?', a: 'W Polsce: benzyna bezołowiowa Pb95/Pb98 - 1,529 zł/l, olej napędowy (diesel) - 1,176 zł/l, LPG autogaz - 0,387 zł/l. Stawki ustala Ministerstwo Finansów.' },
    { q: 'Czy będzie waloryzacja akcyzy?', a: 'Akcyza nie jest automatycznie waloryzowana inflacją (jak np. minimum krajowe). Każda zmiana wymaga uchwały Sejmu. Od 2022 stawki utrzymują się na podobnym poziomie z drobnymi zmianami.' },
    { q: 'Jaki udział akcyzy w cenie litra?', a: 'Akcyza stanowi ~24% ceny detalicznej benzyny i ~20% diesla. Z dodatkiem opłaty paliwowej, opłaty emisyjnej i VAT 23% łączne podatki przekraczają 50% ceny.' },
    { q: 'Polska vs UE - jak wypada akcyza?', a: 'Polska ma jedną z najniższych akcyz w UE. Średnia UE: ~2,5 zł/l, Niemcy ~3,0 zł/l, Holandia ~3,2 zł/l, Polska 1,529 zł/l. Stąd polskie paliwo jest tańsze niż w większości krajów UE.' },
    { q: 'Czy akcyza wzrośnie z powodu ETS2?', a: 'ETS2 (od 2027) to oddzielny mechanizm - nie waloryzacja akcyzy, ale dodatkowy koszt CO2 na importera/rafinera. Eksperci szacują wpływ +0,30-0,80 zł/l do 2030.' },
  ],
  content: `
## Akcyza paliwowa 2026 w Polsce

Akcyza to drugi największy podatek od paliwa (po VAT). W 2026 stawki w Polsce wynoszą:

| Paliwo | Akcyza zł/l | Udział w cenie |
|---|---|---|
| Benzyna Pb95/Pb98 | **1,529 zł** | ~24% |
| Olej napędowy (Diesel) | **1,176 zł** | ~20% |
| LPG (autogaz) | **0,387 zł** | ~14% |
| CNG | 0 zł | 0% (zwolnione) |

Razem z **opłatą paliwową** (0,298 zł/l) i **opłatą emisyjną** (0,08 zł/l) oraz **VAT 23%** od całości, łączne obciążenia podatkowe wynoszą **ponad 50% ceny detalicznej**.

## Polska vs UE

Polska należy do krajów z najniższą akcyzą na paliwo w UE. Średnia unijna to ok. 2,5 zł/l, Niemcy 3,0 zł, Holandia 3,2 zł. To główny powód dla którego paliwo w Polsce jest tańsze niż na zachodzie Europy.

## Czy szykuje się waloryzacja?

Akcyza nie podlega automatycznej waloryzacji inflacją. Każda zmiana wymaga ustawy. Od 2022 stawki są stabilne. **Niezwiązany ze akcyzą** jest nowy system **ETS2** (od 2027), który nałoży dodatkowe koszty CO2 na rafinerie - szacunkowo +0,30-0,80 zł/l do 2030.

Więcej: [Składowe ceny paliwa](/maksymalne-ceny-paliw/) | [ETS2 a ceny paliw](/aktualnosci/ets2-system-handlu-emisjami-paliwa-2027/)
`,
},

'ets2-system-handlu-emisjami-paliwa-2027': {
  faqs: [
    { q: 'Co to jest ETS2?', a: 'ETS2 (Emissions Trading System 2) to nowy system UE handlu emisjami CO2 obejmujący transport drogowy i budownictwo. Działa od 2027 - rafinerie muszą kupować pozwolenia na emisję CO2 z paliw, koszt przerzucają na konsumenta.' },
    { q: 'Jak ETS2 wpłynie na ceny paliw w Polsce?', a: 'Szacunki Komisji Europejskiej: +0,30-0,80 zł/l od 2027, narastająco do +1,00-1,50 zł/l w 2030. Dokładny wpływ zależy od ceny pozwolenia CO2 na rynku ETS2.' },
    { q: 'Czy Polska może się wycofać z ETS2?', a: 'Nie. ETS2 to obowiązkowa regulacja UE - obejmuje wszystkie kraje członkowskie. Polska może lobbować za złagodzeniem (mechanizm rekompensaty cenowej), ale nie może się wycofać bez wystąpienia z UE.' },
    { q: 'Kiedy ETS2 startuje?', a: 'Oficjalny start: 1 stycznia 2027. Pierwsze 2 lata (2027-2028) z mechanizmem stabilizacji cen (max 45 EUR/tCO2). Pełna swoboda cenowa od 2029.' },
    { q: 'Jak przygotować się jako kierowca?', a: 'Rozważ: (1) wymianę auta na bardziej oszczędne, (2) hybrydę lub elektryka jeśli dużo jeździsz, (3) LPG (zwolniony z ETS2!), (4) optymalizacja jazdy (tempomat, ciśnienie opon).' },
  ],
  content: `
## ETS2 - co to jest i kogo dotyczy

**ETS2** (Emissions Trading System 2) to drugi po znanym ETS system handlu emisjami UE, obejmujący od 2027:

- **Transport drogowy** - benzyna, diesel, LPG (CNG zwolniony)
- **Budownictwo** - ogrzewanie domów

Mechanizm: rafinerie i importerzy paliw muszą kupować pozwolenia na emisję CO2. Koszt przerzucają na cenę paliwa.

## Szacunkowy wpływ na ceny w Polsce

| Rok | Cena CO2 ETS2 | Wpływ na Pb95 zł/l |
|---|---|---|
| 2027 | ~30 EUR/t | +0,15 - 0,30 zł |
| 2028 | ~40 EUR/t | +0,25 - 0,40 zł |
| 2030 | ~60-80 EUR/t | +0,50 - 1,00 zł |
| 2035 | ~100 EUR/t | +1,00 - 1,50 zł |

Spalanie 1 l benzyny = ~2,3 kg CO2. Przy 40 EUR/t to +0,09 EUR/l = +0,40 zł/l.

## Co zrobić?

- **Krótkoterminowo** (2026-2027): bez zmian
- **Średnio** (2028-2030): rozważ tańsze paliwo (LPG zwolniony), bardziej oszczędne auto
- **Długo** (2030+): elektryk lub hybryda

[Akcyza 2026](/aktualnosci/akcyza-paliwowa-2026-waloryzacja/) | [LPG 2026](/lpg/)
`,
},

'najtansze-stacje-a1-a2-a4-ranking-2026': {
  faqs: [
    { q: 'Czy stacje na autostradzie są droższe?', a: 'Tak, zazwyczaj o 0,30-0,50 zł/l. Wyjątki: niektóre Orlen i Lotos przy A2/A4. Najtańsze rozwiązanie: zjazd do najbliższego miasta (1-3 km), tankowanie tam, powrót na autostradę.' },
    { q: 'Najtańsza stacja na A2?', a: 'Ranking zmienia się dziennie. Pełna lista: BenzynaMAPA.pl/autostrada/a2/. Historycznie najtańsze są stacje Orlen Konin i Łowicz, oraz Moya w okolicach Poznania.' },
    { q: 'Najtańsza stacja na A4?', a: 'A4 to najdłuższa polska autostrada (672 km Zgorzelec-Korczowa). Najtańsze stacje to zwykle Orlen w okolicach Wrocławia, Tarnowa i Rzeszowa.' },
    { q: 'Czy warto zjeżdżać z autostrady po tańsze paliwo?', a: 'Tak, jeśli zjazd jest blisko (do 3 km od autostrady) i różnica cenowa min. 0,30 zł/l. Przy 50l baku 0,30 zł × 50 = 15 zł oszczędności pokrywa zjazd i powrót.' },
    { q: 'Karty lojalnościowe na autostradzie?', a: 'Tak - Orlen Vitay, BP BonusMania, Shell ClubSmart działają na wszystkich stacjach sieci, też na autostradach. Rabat 0,05-0,15 zł/l dodatkowo do bazowej ceny.' },
  ],
  content: `
## Stacje przy autostradzie - dlaczego drożej?

Stacje paliw bezpośrednio przy zjazdach autostradowych są zwykle o **0,30-0,50 zł/l droższe** niż średnia w regionie. Powody:

- **24/7 obsługa** = wyższe koszty pracy
- **Duża restauracja, parking** = wyższe koszty operacyjne
- **Inelastyczny popyt** = zmęczeni kierowcy płacą każdą cenę
- **Marża sieciowa** = "premium location" w cenniku

## Strategia: zjazd do najbliższego miasta

**Test ekonomiczny:** Zjazd 1-3 km od autostrady, tankowanie w mieście, powrót. Przy różnicy 0,30 zł/l i baku 50 l - **oszczędzasz 15 zł**, pokryjesz 6-10 km objazdu (zużycie 0,5-1l = 3-6 zł).

## Ranking według trasy

| Autostrada | Najtańsze stacje | Drożej |
|---|---|---|
| **A1** (Trójmiasto - granica CZ) | Orlen Tczew, Lotos Toruń | Shell, BP MOP |
| **A2** (Świecko - Terespol) | Orlen Konin, Moya Poznań | Shell, BP MOP |
| **A4** (granica DE - Korczowa) | Orlen Wrocław, Verva Tarnów | Shell, OMV |
| **S7** (Gdańsk - Chyżne) | Orlen Olsztyn, Lotos Kielce | Premium MOP |
| **S8** (Wrocław - Białystok) | Orlen Łódź, Moya | BP MOP |

Aktualne ceny: [Mapa BenzynaMAPA.pl](/) z filtrem "Najtańsze".

[Strony autostrad](/autostrada/) | [Karty paliwowe](/aktualnosci/karty-paliwowe-orlen-vitay-bp-porownanie-2026/)
`,
},

'lotos-navigator-vs-orlen-vitay-2026': {
  faqs: [
    { q: 'Czy Lotos Navigator nadal działa po fuzji?', a: 'Tak. Po przejęciu Lotosu przez Orlen (2022) Navigator nadal działa równolegle z Vitay. Możesz mieć obie karty. Stopniowo Lotos przechodzi na markę Orlen, ale Navigator pozostaje aktywny.' },
    { q: 'Czym Lotos Navigator różni się od Orlen Vitay?', a: 'Navigator - punkty za zakup paliwa (1 pkt/l), wymiana na rabat lub gadżety. Vitay - punkty + benefity Orlen, integracja z aplikacją mobilną, rabaty na myjnie i car wash.' },
    { q: 'Ile można zaoszczędzić na karcie?', a: 'Realny rabat: 0,05-0,15 zł/l (1-3% od ceny). Przy rocznym przebiegu 15 000 km i 7l/100km to 1050 l × 0,10 zł = ~105 zł rocznie.' },
    { q: 'Czy można łączyć karty Vitay i Navigator?', a: 'Tak - jeśli masz obie. Vitay przy tankowaniu na Orlen, Navigator przy Lotos. Punkty są osobne, nie łączą się.' },
    { q: 'Karta lojalnościowa vs cena - co ważniejsze?', a: 'Cena. Rabat z karty (0,10 zł/l) jest mniejszy niż różnica między tanią a drogą stacją (0,30-0,50 zł/l). Najpierw szukaj najtańszej stacji, potem dodaj kartę.' },
  ],
  content: `
## Lotos Navigator vs Orlen Vitay po fuzji 2022

Po przejęciu Grupy Lotos przez Orlen w 2022 obie marki działają jako jeden koncern, ale **programy lojalnościowe pozostają osobne**.

## Porównanie programów

| Cecha | Orlen Vitay | Lotos Navigator |
|---|---|---|
| Stacje | ~1850 Orlen | ~400 byłych Lotos |
| Punkty za 1l | 1 pkt | 1 pkt |
| Wymiana 1 pkt = | ~0,01 zł rabatu | ~0,01 zł rabatu |
| Realny rabat | 0,05-0,15 zł/l | 0,05-0,12 zł/l |
| Aplikacja | Vitay (lepsza) | Navigator (prostsza) |
| Sklep nagród | Większy wybór | Mniejszy wybór |
| Karta plastikowa | Tak | Tak |

## Strategia 2026

1. **Załóż obie karty** - są bezpłatne, dają rabat na obu sieciach
2. **Tankuj w Orlen** preferowanie (więcej stacji w Polsce)
3. **Nie kupuj droższego paliwa tylko dla punktów** - rabat 0,10 zł/l nie pokryje 0,40 zł/l różnicy z tańszą siecią
4. **Stacje przy autostradzie** - karta lojalnościowa pomoże, ale i tak są drogie

## Czy fuzja oznacza koniec Lotosu?

Marka **Lotos powoli znika** z polskiego rynku - większość stacji rebrandowana na Orlen w latach 2023-2026. Pozostałe ~400 stacji nadal akceptują Navigator. **Punkty Navigator zachowują wartość** - nie przepadają.

[Karty paliwowe 2026](/aktualnosci/karty-paliwowe-orlen-vitay-bp-porownanie-2026/) | [Orlen ceny](/marka/orlen/)
`,
},

'paliwo-w-firmie-pit-vat-kilometrowka-2026': {
  faqs: [
    { q: 'Ile VAT mogę odliczyć z paliwa do firmy?', a: 'Auto osobowe wykorzystywane częściowo prywatnie: 50% VAT (czyli ~11,5% z ceny brutto). Auto wykorzystywane wyłącznie do działalności (ciężarowe, dostawcze) lub w VAT pełnym: 100% VAT (23%).' },
    { q: 'Co to jest kilometrówka 2026?', a: 'Stawka za 1 km przy używaniu prywatnego auta do celów służbowych. W 2026: 1,15 zł/km (samochody osobowe), 0,52 zł/km (motocykl). Maksymalnie 0,5358 PLN/km pełna refundacja bez podatku.' },
    { q: 'Czy mogę wliczyć paliwo do PIT bez ewidencji?', a: 'Nie. PIT wymaga ewidencji przebiegu (data, cel, km, paliwo). Bez ewidencji - max 20% rzeczywistych kosztów paliwa. Z ewidencją - 100%.' },
    { q: 'Paliwo dla pracownika - jak rozliczać?', a: 'Pracownik używający służbowego auta: nieodpłatne świadczenie 250 zł/miesiąc (auto do 1600 cm3) lub 400 zł/miesiąc (powyżej 1600 cm3) doliczane do PIT pracownika. Pracodawca odlicza VAT i koszt.' },
    { q: 'Karta flotowa vs prywatna - co się opłaca firmie?', a: 'Karty flotowe (Orlen Fleet, BP Fuel Card, Shell euroShell) dają: faktury VAT z każdego tankowania (łatwiej księgować), rabaty 0,05-0,20 zł/l, jednoczesne tankowanie wielu aut. Opłaca się od 3+ aut firmowych.' },
  ],
  content: `
## Paliwo w firmie - PIT i VAT 2026

Rozliczanie paliwa w działalności gospodarczej zależy od typu pojazdu:

### Auto osobowe (sedan, SUV, kombi)
- **VAT:** 50% (~11,5% z ceny brutto)
- **Koszty:** 100% (do limitu 75% przy aucie wykorzystywanym częściowo prywatnie)
- **Wymagana ewidencja** kilometrów

### Auto ciężarowe / dostawcze (do 3,5 t)
- **VAT:** 100% (23%)
- **Koszty:** 100%
- **Bez limitu**

### Auto prywatne do celów służbowych
- **Kilometrówka 2026:** 1,15 zł/km (osobowe), 0,52 zł/km (motocykl)
- **Refundacja bez PIT:** maks. 0,5358 zł/km dla samochodu osobowego
- **Powyżej limitu** - obciążenie PIT pracownika

## Ewidencja przebiegu - co musi zawierać

| Element | Wymóg |
|---|---|
| Data | TAK |
| Cel podróży | TAK (klient, dostawca, miasto) |
| Trasa (skąd-dokąd) | TAK |
| Liczba km | TAK |
| Numer rejestracyjny | TAK |
| Stan licznika | TAK |
| Podpis kierowcy | TAK |

**Bez ewidencji** US może uznać max 20% kosztów paliwa jako koszt firmy.

## Karty flotowe - kiedy się opłacają

Karta flotowa (Orlen Fleet, BP Fuel Card, Shell euroShell, Circle K Routex) jest opłacalna od **3+ aut firmowych**. Korzyści:

- Jedna faktura VAT zbiorcza
- Rabat 0,05-0,20 zł/l
- Limity dzienne/miesięczne
- Sprawozdania flotowe online

[Karty paliwowe 2026](/aktualnosci/karty-paliwowe-orlen-vitay-bp-porownanie-2026/) | [Kalkulator paliwa](/kalkulator/)
`,
},

'pb95-vs-pb98-do-mojego-auta': {
  faqs: [
    { q: 'Skąd wiem czy moje auto wymaga 95 czy 98?', a: 'Sprawdź naklejkę w wlewie paliwa - jest tam "RON 95" lub "RON 98 min." Drugie miejsce: instrukcja obsługi. Jeśli nie ma napisu, najczęściej wystarczy 95.' },
    { q: 'Pomyłkowo zatankowałem 95 zamiast 98 - co robić?', a: 'Jedź łagodnie do najbliższej stacji i dotankuj 98. Pojedyncze zatankowanie nie zniszczy silnika, ale można usłyszeć "stukanie" (knocking). Długoterminowo szkodliwe.' },
    { q: 'Czy 98 daje korzyść w aucie wymagającym 95?', a: 'Bardzo niewielką. Silnik nie wykorzysta wyższej oktanowej. Jedyna potencjalna korzyść: dodatkowe detergenty w paliwach premium (Shell V-Power, Orlen Verva). Cena 0,40 zł/l nadpłaty rzadko się opłaca.' },
    { q: 'Czy 98 daje większą moc?', a: 'Tylko w silnikach zaprojektowanych na 98+. W aucie 95 - mocy nie przybędzie. W aucie 98 - silnik wykorzystuje wyższą oktanową i może produkować pełną moc fabryczną.' },
    { q: 'Jakie marki aut wymagają PB98?', a: 'BMW M (M2, M3, M4, M5), Mercedes-AMG (A45, C63, E63, G63), Porsche (911, Boxster), Audi RS/S, Ford ST/RS, Honda Type R, Subaru WRX/STI, niektóre Audi 1.4 TSI sport.' },
  ],
  content: `
## PB95 czy PB98 - jak wybrać

Liczba oktanowa (RON - Research Octane Number) określa odporność benzyny na samozapłon. Im wyższa, tym wyższe sprężanie silnik może zastosować.

**Reguła:** Tankuj benzynę o liczbie RON **równej lub wyższej** niż wymaga producent. Niższa = "stukanie" silnika i długoterminowe uszkodzenia.

## Sprawdź swoją instrukcję

W 90% aut benzynowych w Polsce wystarczy **PB95**. Wymóg PB98 mają głównie:

- **Sportowe BMW M** - M2 Competition, M3, M4, M5, M8
- **Mercedes-AMG** - A45, C63, E63, G63, GT
- **Porsche** - wszystkie modele
- **Audi RS / S** - RS3, RS4, RS6, S5, S6, S8
- **Ford ST / RS** - Focus ST, Fiesta ST
- **Honda Type R** - Civic Type R
- **Subaru WRX / STI**
- **Niektóre VAG 1.4 TSI sport** (Polo GTI, Fabia RS)

## Pomyłkowe zatankowanie

| Pomyłka | Co się stanie |
|---|---|
| 95 w aucie wymagającym 95 | ✅ Wszystko OK |
| 98 w aucie wymagającym 95 | ✅ OK, brak korzyści |
| **95 w aucie wymagającym 98** | ⚠ Stukanie silnika, ECU obniża moc, długoterminowo szkodzi |
| 98 w aucie wymagającym 98 | ✅ Optymalna praca |

**Pomyłkowe zatankowanie 95 zamiast 98:** Jedź łagodnie do następnej stacji, dotankuj 98. Pojedyncze zatankowanie nie zniszczy silnika.

## Paliwa premium (V-Power, Verva, Ultimate)

Warianty premium PB98 (Shell V-Power, Orlen Verva, BP Ultimate, Circle K miles) dodają **pakiet detergentów** czyszczących wtryskiwacze. Korzyść mierzalna głównie przy:

- Starszych autach z osadami
- Częstej jeździe miejskiej z krótkimi trasami
- Silnikach z bezpośrednim wtryskiem (FSI, TSI)

W normalnym użytkowaniu na trasie - korzyść znikoma.

[Benzyna 95](/benzyna-95/) | [Benzyna 98](/benzyna-98/) | [Najtańsza Pb98](/najtansze-benzyna/)
`,
},

'czy-orlen-ma-najtansze-paliwo-2026': {
  faqs: [
    { q: 'Czy Orlen jest najtańszą siecią w Polsce?', a: 'Nie. Średnie odchylenie cen Orlen vs średnia krajowa: +0,10 zł/l (lekko drożej). Najtańsze sieci: Moya (-0,15 zł), Huzar (-0,20 zł), stacje przy hipermarketach. Najdroższe: Shell (+0,35 zł), BP (+0,30 zł).' },
    { q: 'Dlaczego Orlen nie jest najtańszy mimo że to państwowa firma?', a: 'Orlen to spółka giełdowa (Skarb Państwa ma 49,9%). Działa jak komercyjna firma maksymalizująca zysk. Ceny zbliżone do średniej dają najlepsze EBITDA z największej sieci 1850 stacji.' },
    { q: 'Czy Orlen Vitay opłaca się?', a: 'Tak, jako dodatek do bazowej ceny. Rabat 0,05-0,15 zł/l. Ale nie warto przejeżdżać do Orlen jeśli inna stacja jest tańsza o 0,30 zł/l.' },
    { q: 'Czy są regiony gdzie Orlen jest najtańszy?', a: 'Tak - na peryferiach (małe miejscowości) gdzie brak konkurencji. W dużych miastach Orlen ma cenę zbliżoną do średniej, a tańsze są Moya/Huzar/Auchan.' },
    { q: 'Co to jest Verva i czy się opłaca?', a: 'Verva to premium paliwo Orlen (Pb98 i diesel premium). Dodatki detergentowe + wyższa liczba oktanowa/cetanowa. Cena: +0,40 zł/l. Opłaca się głównie dla silników wymagających 98+.' },
  ],
  content: `
## Analiza: czy Orlen ma najtańsze paliwo?

Orlen to największa polska sieć stacji paliw (~1850 stacji po fuzji z Lotosem). Naturalne pytanie: czy "polska" firma oferuje najniższe ceny dla polskich kierowców?

**Krótka odpowiedź:** Nie. Orlen ma ceny **zbliżone do średniej krajowej** (~+0,10 zł/l), nie najtańsze.

## Ranking sieci według odchylenia cenowego (Pb95)

| Sieć | Odchylenie vs średnia | Pozycja |
|---|---|---|
| Huzar | **−0,20 zł/l** | 🥇 najtańsza |
| Moya | **−0,15 zł/l** | 🥈 |
| Hipermarket (Auchan, Makro) | **−0,10 zł/l** | 🥉 |
| **Orlen/Lotos** | **+0,10 zł/l** | 4 |
| Circle K | +0,25 zł/l | 5 |
| BP | +0,30 zł/l | 6 |
| Shell | +0,35 zł/l | 🚫 najdroższa |

## Dlaczego Orlen nie jest najtańszy?

1. **Spółka giełdowa** - maksymalizuje zysk dla akcjonariuszy (Skarb Państwa 49,9%, reszta giełda)
2. **Premium lokalizacje** - autostrady, centra miast, główne trasy
3. **Brak presji cenowej** - dominacja rynkowa (~38% stacji w Polsce)
4. **Marketing premium** - Verva, programy lojalnościowe, kawiarnia, samochody do mycia

## Strategia oszczędnościowa

1. **Codzienne tankowanie:** Moya, Huzar, stacja przy hipermarkecie (oszczędność 0,20-0,40 zł/l)
2. **Podróże dalekie:** Orlen po drodze (gęsta sieć, dobra jakość Verva)
3. **Karta lojalnościowa:** Orlen Vitay daje 0,05-0,15 zł rabatu - dodaj do bazowej ceny

## Werdykt

**Orlen = solidna jakość za średnią cenę**, nie najtańszy. Dla najlepszych cen szukaj **Moya, Huzar** lub **stacji przy hipermarketach**.

[Porównanie sieci](/marka/) | [Najtańsza Pb95](/najtansze-benzyna/)
`,
},

'on-arktic-diesel-zimowy-2026': {
  faqs: [
    { q: 'Kiedy tankować ON Arktic?', a: 'Gdy prognoza pokazuje mróz poniżej -20°C (CFPP standardowego zimowego ON). W Polsce głównie w styczniu-lutym w Bieszczadach, Tatrach, Suwałkach. Wczesna tankowanie przed wyjazdem w góry.' },
    { q: 'Czym ON Arktic różni się od standardowego zimowego diesla?', a: 'CFPP (Cold Filter Plugging Point) -32°C vs -20°C. Mniej parafin krystalizujących w mrozie. Wyższa cena: +0,10-0,30 zł/l vs zwykły zimowy ON.' },
    { q: 'Czy mogę dolewać benzynę do diesla aby nie żelował?', a: 'NIE. Mit lat 90. Współczesne silniki z bezpośrednim wtryskiem ulegają zniszczeniu (~10-20 tys. zł naprawy). Zamiast tego: tankuj ON Arktic lub używaj dodatków antyżelujących (Bardahl, K2).' },
    { q: 'Co zrobić jeśli diesel zżelował?', a: 'Wstaw auto do garażu/ogrzewanego miejsca. Po rozmrożeniu (kilkanaście godzin) wymień filtr paliwa, uruchom silnik. Nie próbuj startować na zewnątrz w mrozie - rozładujesz akumulator.' },
    { q: 'Gdzie kupić ON Arktic?', a: 'Większe stacje Orlen, Lotos, Shell, BP w regionach górskich i północno-wschodnich (Bieszczady, Tatry, Suwałki). Sprawdź przed wyjazdem - nie każda stacja ma w ofercie.' },
  ],
  content: `
## ON Arktic - diesel na ostre mrozy

W Polsce standardowo dostępne są dwa typy diesla zimowego:

| Typ | CFPP | Okres dostępności |
|---|---|---|
| Standardowy zimowy | -20°C | listopad-luty |
| **ON Arktic** | **-32°C** | grudzień-luty (regiony górskie/PN-W) |

**CFPP** (Cold Filter Plugging Point) = temperatura przy której parafiny krystalizują i blokują filtr paliwa.

## Kiedy tankować Arktic?

- **Mrozy poniżej -20°C** w prognozie
- **Wyjazd w góry** (Tatry, Bieszczady, Beskidy)
- **Mazury, Suwałki w styczniu/lutym**
- **Parkowanie na zewnątrz** (nieogrzewany garaż = pełne ryzyko)

## Jeśli mrozy przyszły niespodzianie

1. **Tankuj jak najszybciej Arktic** (rozcieńczy zwykły ON w baku)
2. **Dodatki antyżelujące** - K2, Bardahl, Wynn's (40-80 zł/butelka, do 60l ON)
3. **Garaż / ogrzewany parking** na noc
4. **NIE dolewaj benzyny** - zniszczy silnik (mit lat 90.)

## Co zrobić gdy diesel zżelował

| Krok | Czas |
|---|---|
| 1. Auto do garażu | 0 |
| 2. Pełne rozmrożenie | 12-24 h |
| 3. Wymiana filtra paliwa | 30 min |
| 4. Start silnika | natychmiast |
| 5. Dotankowanie Arktic | przy następnej stacji |

Koszt naprawy: filtr paliwa 30-100 zł + ewentualne czyszczenie wtryskiwaczy (jeśli zatkane).

[Olej napędowy](/olej-napedowy/) | [AdBlue - zamarza w -11°C](/adblue/)
`,
},

'benzyna-e10-czy-niszczy-silnik': {
  faqs: [
    { q: 'Co to jest benzyna E10?', a: 'E10 to benzyna z dodatkiem do 10% bioetanolu (etanolu produkowanego z roślin). W Polsce od 2024 standard na większości stacji. Spełnia normę PN-EN 228:2012.' },
    { q: 'Czy E10 jest niebezpieczna dla silnika?', a: 'Dla 90% aut polskich (rok 2000+) - nie. Dla starszych aut (1990-) lub niektórych modeli z bezpośrednim wtryskiem - może uszkodzić uszczelki paliwowe. Sprawdź naklejkę w wlewie lub instrukcję.' },
    { q: 'Jak rozpoznać czy moje auto obsługuje E10?', a: 'Sprawdź naklejkę w wlewie paliwa: "E10" oznacza zgodność. Brak naklejki + auto sprzed 2000 = sprawdź instrukcję lub stronę producenta. Lista zgodnych aut: gov.pl/web/klimat.' },
    { q: 'Gdzie kupić jeszcze E5?', a: 'E5 jest oferowana jako "Premium 95" lub "Protect 95" na większych stacjach (głównie Shell, BP, Verva 95 Orlen). Cena: +0,15-0,30 zł/l vs E10. Pełna lista stacji oferujących E5: rozporządzenie Ministerstwa Klimatu.' },
    { q: 'Czy E10 daje większe zużycie?', a: 'Tak, o 1-3% (etanol ma niższą wartość kaloryczną niż benzyna). Auto które spala 7l/100km na E5, spali ~7,1-7,2 l/100km na E10. Różnica niewielka, w praktyce niezauważalna.' },
  ],
  content: `
## Benzyna E10 - co to jest

Od 2024 w Polsce większość stacji oferuje **E10** (do 10% bioetanolu) zamiast wcześniejszej **E5** (do 5%). To unijny wymóg ograniczenia emisji CO2 z transportu.

## Czy uszkodzi mój silnik?

| Wiek auta | Zgodność z E10 |
|---|---|
| 2011+ (wszystkie nowe) | ✅ 100% zgodne |
| 2000-2010 | ✅ 95% zgodne |
| 1990-2000 | ⚠ Sprawdź naklejkę / instrukcję |
| Przed 1990 | ❌ Wymaga E5 |

**Sprawdź naklejkę w wlewie:** "E10" oznacza zgodność. Brak = sprawdź instrukcję obsługi lub stronę producenta.

## Modele wymagające E5 (lista częściowa)

- Niektóre BMW lat 90 (E30, E36)
- Mercedes W124, W201
- VW Golf I, II, III (1.6, 1.8)
- Audi 80, 100 (do 1995)
- Klasyczne sportowe (Porsche 911 air-cooled, Ferrari)
- Niektóre Subaru z fabrycznym LPG

## Gdzie kupić E5

E5 jest oferowana jako paliwo premium pod nazwami:
- **Shell V-Power 95**
- **BP Ultimate 95**
- **Orlen Verva 95**
- **Circle K miles 95**

Cena: +0,15-0,30 zł/l vs zwykła E10. Pełna lista stacji: rozporządzenie Ministerstwa Klimatu (gov.pl/web/klimat).

## Wpływ na auto

- **Zużycie:** +1-3% (etanol = niższa wartość kaloryczna)
- **Moc:** brak zmian
- **Emisje:** -3% CO2 (cel ekologiczny)
- **Uszczelki gumowe:** w starych autach mogą się rozpuszczać (od 1995+ uszczelki są E10-safe)

**Wniosek:** Dla 90% kierowców w Polsce E10 to standard bez problemów. Jeśli masz wątpliwości - sprawdź naklejkę w wlewie.

[Benzyna 95](/benzyna-95/) | [Benzyna 98](/benzyna-98/)
`,
},

'stacje-samoobslugowe-vs-obslugowe-cena': {
  faqs: [
    { q: 'Czy stacje samoobsługowe są tańsze?', a: 'Tak, średnio o 0,10-0,30 zł/l. Mniej personelu = niższe koszty operacyjne, które przekładają się na cenę. Najtańsze samoobsługowe sieci: Moya, Auchan, niektóre Orlen "Stop Cafe".' },
    { q: 'Czy stacje samoobsługowe są bezpieczne?', a: 'Tak. Procedura: wsuń kartę/wybierz stanowisko → wybierz paliwo → tankuj → kasa lub mobilna płatność. Wszystkie samoobsługowe stacje w Polsce są monitorowane CCTV.' },
    { q: 'Jak korzystać ze stacji samoobsługowej?', a: '1) Włącz dystrybutor (kartą lub w kasie wybierz numer dystrybutora). 2) Wybierz paliwo. 3) Tankuj samodzielnie. 4) Zapłać kartą bezpośrednio w dystrybutorze lub idź do kasy/sklepu.' },
    { q: 'Czy mogę zapłacić gotówką na stacji samoobsługowej?', a: 'Często tak, ale głównie w sklepie/kasie (nie w samym dystrybutorze). Niektóre stacje 24h przyjmują tylko karty po godz. 22:00.' },
    { q: 'Czy moja karta lojalnościowa działa na samoobsługowej?', a: 'Zwykle tak. Po zatankowaniu zapłać w kasie, podaj kartę przed transakcją. Niektóre dystrybutory mają wbudowane czytniki karty lojalnościowej.' },
  ],
  content: `
## Stacje samoobsługowe - tańsze i sprawniejsze

W Polsce ok. 20% stacji oferuje samoobsługę. Trend rośnie - obniża koszty operacyjne i przyspiesza obsługę.

## Najtańsze sieci samoobsługowe

| Sieć | Charakterystyka | Cena vs średnia |
|---|---|---|
| **Moya** | Większość samoobsługowa | −0,15 zł/l |
| **Auchan** | Wszystkie samoobsługowe | −0,10 zł/l |
| **Makro** | Wszystkie samoobsługowe | −0,15 zł/l |
| **Carrefour** | Większość samoobsługowa | −0,10 zł/l |
| **E.Leclerc** | Wszystkie samoobsługowe | −0,10 zł/l |
| **Niektóre Orlen Stop Cafe** | Hybryda | 0 do +0,05 zł/l |

## Jak korzystać ze stacji samoobsługowej

1. **Włącz dystrybutor:**
   - Karta płatnicza w czytniku dystrybutora (najnowsze stacje)
   - Lub: w kasie sklepu wybierz numer dystrybutora, zapłać zaliczkę
2. **Wybierz paliwo:** Pb95 / Pb98 / ON / LPG
3. **Tankuj samodzielnie** - dystrybutor zatrzyma się sam gdy bak będzie pełny
4. **Płatność:** karta w dystrybutorze (różnica zwrotu od zaliczki) lub w kasie

## Tipy

- **Kasa = sklep** - możesz przy okazji zrobić zakupy
- **Karty lojalnościowe** działają - zapłać w kasie i pokaż kartę
- **24h** - po 22:00 niektóre stacje przyjmują tylko karty
- **LPG** zawsze tankuje pracownik (przepisy bezpieczeństwa)
- **Brak personelu = trudne pytania** (jakość paliwa, reklamacje) załatwisz tylko mailem/telefonicznie

[Najtańsza Pb95](/najtansze-benzyna/) | [Marki stacji](/marka/)
`,
},

'tankowanie-zima-porady-paliwa-mroz': {
  faqs: [
    { q: 'Jakie paliwo tankować zimą?', a: 'Diesel: zwykły zimowy (CFPP -20°C, dostępny XI-II) lub ON Arktic (-32°C, dla mrozów poniżej -20°C). Benzyna: zimowa ma niższą lotność (DVPE 60-90 kPa vs 45-60 letniej) - tankowana automatycznie listopad-luty.' },
    { q: 'Czy benzyna może zamarznąć?', a: 'Praktycznie nie. Benzyna nie zamarza do ok. -100°C. Mogą jednak zamarznąć: woda w paliwie (1-3% kondensacji), filtr paliwa, czujnik poziomu. Tank pełny zimą = mniej kondensacji.' },
    { q: 'AdBlue w mrozie - co zrobić?', a: 'AdBlue zamarza w -11°C. Auto ma ogrzewacz zbiornika i przewodów - działa automatycznie. Problemem są tylko kanistry zostawione na zewnątrz. Po rozmrożeniu AdBlue zachowuje właściwości.' },
    { q: 'Czy zimą jest gorsze spalanie?', a: 'Tak, o 10-25%. Powody: gęstszy powietrze, zimny olej, dłuższe nagrzewanie silnika, ogrzewanie kabiny, oświetlenie cały czas. Krótkie trasy zimą = +30% zużycia.' },
    { q: 'Diesel mrozem - kiedy zaczyna mieć problemy?', a: 'Standardowy zimowy ON (CFPP -20°C) zaczyna mieć problemy w -22°C i niżej. ON Arktic (-32°C) - bezpieczny do -34°C. Poniżej tych wartości: garaż lub ON Arktic + dodatki.' },
  ],
  content: `
## Tankowanie zimą - 7 porad

### 1. Tankuj pełny bak
- Mniej miejsca dla kondensacji wody
- Woda w paliwie + mróz = problem (zamarznięty filtr)
- 100% bak vs 20% bak = 5× mniej powietrza w zbiorniku

### 2. Sprawdzaj rodzaj diesla
Listopad-luty stacje powinny oferować **zimowy ON (CFPP -20°C)**. Sprawdź naklejkę na dystrybutorze. Niektóre stacje przy granicy z PL/UA/BY mogą mieć letni ON nawet w styczniu - unikaj.

### 3. Mrozy poniżej -20°C → ON Arktic
Tankuj ON Arktic (CFPP -32°C) gdy:
- Prognoza pokazuje mróz poniżej -20°C
- Wyjazd w góry (Tatry, Bieszczady, Beskidy)
- Mazury, Suwałki w styczniu/lutym
- Auto na zewnątrz nocą

Cena: +0,10-0,30 zł/l. Dostępność: większe Orlen, Lotos, Shell w regionach górskich.

### 4. NIE dolewaj benzyny do diesla
Mit lat 90. Współczesne silniki z bezpośrednim wtryskiem ulegają zniszczeniu (10-20 tys. zł naprawy). Zamiast tego:
- **Dodatki antyżelujące** (K2, Bardahl, Wynn's) - 40-80 zł/butelka, do 60l ON
- **ON Arktic** - bezpieczniejsze

### 5. AdBlue zamarza w -11°C
- Auto ma ogrzewacz zbiornika i przewodów (działa automatycznie)
- Kanister AdBlue w bagażniku w mróz: rozmrożenie 12-24h
- Po rozmrożeniu AdBlue zachowuje pełne właściwości

### 6. Akumulator - sprawdź przed mrozami
- W mrozie -20°C akumulator daje 50% pojemności
- Stary akumulator = brak startu rano
- Wymień jeśli ma 4+ lat lub start trwa >3 sekundy

### 7. Spalanie zimą wyższe o 10-25%
- Gęstsze powietrze
- Zimny olej (wyższe tarcie)
- Dłuższe nagrzewanie silnika (krótkie trasy = +30%)
- Ogrzewanie kabiny, podgrzewanie szyb

**Tip:** Używaj remote start (jeśli auto wspiera) - rozgrzeje silnik bez czekania w aucie.

[Olej napędowy (Diesel)](/olej-napedowy/) | [AdBlue](/adblue/) | [Jak oszczędzać na paliwie](/aktualnosci/jak-oszczedzac-na-paliwie-10-sposobow/)
`,
},

};

// ── Strona artykułu ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find(p => p.slug === slug);
  const article = ARTICLES[slug];
  if (!post || !article) return { title: 'Artykuł nie znaleziony' };

  return {
    title: `${post.title} | BenzynaMAPA.pl`,
    description: post.excerpt,
    alternates: { canonical: `https://benzynamapa.pl/aktualnosci/${slug}/` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://benzynamapa.pl/aktualnosci/${slug}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      publishedTime: post.date,
    },
  };
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (!tableBuffer.length) return;
    const rows = tableBuffer.map(r => r.split('|').map(c => c.trim()).filter(Boolean));
    const header = rows[0];
    const body = rows.slice(2);
    elements.push(
      <div key={`table-${i}`} className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {header.map((h, j) => <th key={j} className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {body.map((row, j) => (
              <tr key={j} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                {row.map((cell, k) => <td key={k} className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('|')) {
      tableBuffer.push(line);
      i++;
      continue;
    }
    if (tableBuffer.length) flushTable();

    if (!line.trim()) { i++; continue; }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">{line.slice(3)}</h2>);
    } else if (line.startsWith('- ')) {
      const items = [line];
      while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) { i++; items.push(lines[i]); }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-gray-700 dark:text-gray-300">
          {items.map((item, j) => {
            const text = item.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return <li key={j} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />;
          })}
        </ul>
      );
    } else if (line.startsWith('1. ') || line.startsWith('2. ')) {
      const items = [line];
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i + 1])) { i++; items.push(lines[i]); }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-gray-700 dark:text-gray-300">
          {items.map((item, j) => {
            const text = item.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return <li key={j} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />;
          })}
        </ol>
      );
    } else {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      elements.push(<p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: html }} />);
    }
    i++;
  }
  if (tableBuffer.length) flushTable();
  return elements;
}

import React from 'react';

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find(p => p.slug === slug);
  const article = ARTICLES[slug];
  if (!post || !article) notFound();

  const TAG_COLORS: Record<string, string> = {
    'Porady':     'bg-green-100 text-green-800',
    'Poradnik':   'bg-blue-100 text-blue-800',
    'Porównanie': 'bg-purple-100 text-purple-800',
    'Analiza':    'bg-amber-100 text-amber-800',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          // NewsArticle (silnější signál než Article pro Google News i AI Overviews)
          {
            '@type': 'NewsArticle',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl', url: 'https://benzynamapa.pl' },
            publisher: {
              '@type': 'Organization',
              name: 'BenzynaMAPA.pl',
              logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png', width: 512, height: 512 },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://benzynamapa.pl/aktualnosci/${slug}/` },
            inLanguage: 'pl',
            articleSection: post.tag,
            wordCount: article.content.split(/\s+/).length,
            image: 'https://benzynamapa.pl/og-image.jpg',
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.article-excerpt', 'h2', '.faq-question'] },
          },
          // BreadcrumbList
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'BenzynaMAPA.pl', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Aktualności', item: 'https://benzynamapa.pl/aktualnosci/' },
              { '@type': 'ListItem', position: 3, name: post.title },
            ],
          },
          // FAQPage + Speakable
          {
            '@type': 'FAQPage',
            mainEntity: article.faqs.map(({ q, a }) => ({
              '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
            })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.faq-question'] },
          },
        ],
      }) }} />

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span>›</span>
          <Link href="/aktualnosci/" className="hover:text-green-600">Aktualności</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{post.title.split('–')[0].trim()}</span>
        </nav>

        {/* Header artykułu */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[post.tag] ?? 'bg-gray-100 text-gray-700'}`}>
              {post.tag}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={12} />
              {post.readTime}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(post.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="article-excerpt text-lg text-gray-600 dark:text-gray-400 leading-relaxed border-l-4 border-green-500 pl-4">
            {post.excerpt}
          </p>
        </div>

        {/* Treść artykułu */}
        <article className="prose prose-gray dark:prose-invert max-w-none">
          {renderMarkdown(article.content)}
        </article>

        {/* FAQ */}
        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Często zadawane pytania</h2>
          <div className="space-y-3">
            {article.faqs.map(({ q, a }) => (
              <details key={q} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-green-600 ml-3 flex-shrink-0 text-xs">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold mb-2">Sprawdź aktualne ceny paliw w Twojej okolicy</h3>
          <p className="text-green-200 text-sm mb-4">
            BenzynaMAPA.pl monitoruje ceny na 8 600+ stacjach paliw w Polsce. Aktualizacja 3× dziennie.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors text-sm">
            Otwórz mapę stacji →
          </Link>
        </div>

        {/* Inne artykuły */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Przeczytaj też</h3>
          <div className="space-y-3">
            {POSTS.filter(p => p.slug !== slug).slice(0, 3).map(p => (
              <Link key={p.slug} href={`/aktualnosci/${p.slug}/`}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-colors group">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${TAG_COLORS[p.tag] ?? 'bg-gray-100 text-gray-700'}`}>{p.tag}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-green-700 dark:group-hover:text-green-400 line-clamp-1">{p.title}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <Link href="/aktualnosci/" className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400 hover:underline font-medium">
            <ChevronLeft size={16} /> Wszystkie artykuły
          </Link>
        </div>
      </div>
    </>
  );
}
