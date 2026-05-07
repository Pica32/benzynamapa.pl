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
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Organization', name: 'BenzynaMAPA.pl', url: 'https://benzynamapa.pl' },
        publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://benzynamapa.pl/aktualnosci/${slug}/` },
        inLanguage: 'pl',
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'BenzynaMAPA.pl', item: 'https://benzynamapa.pl/' },
          { '@type': 'ListItem', position: 2, name: 'Aktualności', item: 'https://benzynamapa.pl/aktualnosci/' },
          { '@type': 'ListItem', position: 3, name: post.title },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map(({ q, a }) => ({
          '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
        })),
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
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed border-l-4 border-green-500 pl-4">
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
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
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
