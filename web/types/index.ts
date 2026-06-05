export interface Station {
  id: string;
  name: string;
  brand: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  region: string;
  services: string[];
  opening_hours: string;
}

export interface StationPrice {
  station_id: string;
  pb95: number | null;
  pb98: number | null;
  on: number | null;
  lpg: number | null;
  source: string;
  reported_at: string;
}

export interface StationWithPrice extends Station {
  price: StationPrice | null;
}

/** Zdroje s reálnou (nikoli odhadovanou) cenou: agregátor cenapaliw.pl
 *  a komunitní hlášení uživatelů ('community'). Pure helper bez server-deps,
 *  aby ho mohly importovat i client komponenty (mapa, tabulky). */
export function isRealSource(source?: string | null): boolean {
  return source === 'cenapaliw.pl' || source === 'community';
}

export interface Stats {
  last_updated: string;
  averages: {
    pb95: number;
    pb98: number;
    on: number;
    lpg: number;
  };
  cheapest_today: {
    pb95: { price: number; station_id: string; city: string };
    on: { price: number; station_id: string; city: string };
    lpg: { price: number; station_id: string; city: string };
  };
  trend_7d: {
    pb95: number;
    on: number;
    lpg: number;
  };
  total_stations: number;
  stations_updated_today: number;
}

export type FuelType = 'pb95' | 'pb98' | 'on' | 'lpg';

export const FUEL_LABELS: Record<FuelType, string> = {
  pb95: 'Benzyna 95',
  pb98: 'Benzyna 98',
  on: 'Olej napędowy',
  lpg: 'LPG Autogaz',
};

export const FUEL_COLORS: Record<FuelType, string> = {
  pb95: 'bg-green-600',
  pb98: 'bg-blue-600',
  on: 'bg-gray-700',
  lpg: 'bg-purple-600',
};

export interface BrandPage {
  slug: string;
  name: string;
  fullName: string;
  brandKeys: string[];
  description: string;
  priceOffset: string;
  priceOffsetNum: number;
  color: string;
  stationsCount?: number;
}

export const BRAND_PAGES: BrandPage[] = [
  {
    slug: 'orlen',
    name: 'Orlen',
    fullName: 'PKN Orlen / Lotos',
    brandKeys: ['orlen', 'lotos'],
    description: 'PKN Orlen to największa polska spółka paliwowa, która po przejęciu Lotosu w 2022 roku kontroluje ponad 1800 stacji w Polsce. Ceny zbliżone do średniej krajowej.',
    priceOffset: '+0,10 zł',
    priceOffsetNum: 0.1,
    color: 'bg-red-600',
    stationsCount: 1850,
  },
  {
    slug: 'shell',
    name: 'Shell',
    fullName: 'Shell',
    brandKeys: ['shell'],
    description: 'Brytyjsko-holenderski koncern Shell posiada w Polsce ponad 430 stacji paliw. Oferuje paliwa premium V-Power. Ceny powyżej średniej.',
    priceOffset: '+0,35 zł',
    priceOffsetNum: 0.35,
    color: 'bg-yellow-500',
    stationsCount: 435,
  },
  {
    slug: 'bp',
    name: 'BP',
    fullName: 'BP',
    brandKeys: ['bp'],
    description: 'Brytyjski koncern BP prowadzi w Polsce ponad 340 stacji. Znana z programu lojalnościowego BonusMania. Ceny zbliżone do Shell.',
    priceOffset: '+0,30 zł',
    priceOffsetNum: 0.3,
    color: 'bg-green-700',
    stationsCount: 345,
  },
  {
    slug: 'circle-k',
    name: 'Circle K',
    fullName: 'Circle K (dawniej Statoil)',
    brandKeys: ['circle k', 'statoil', 'circlek'],
    description: 'Kanadyjska sieć Circle K (dawniej Statoil) ma w Polsce ponad 230 stacji. Znana z oferty gastronomicznej i programu Easy.',
    priceOffset: '+0,25 zł',
    priceOffsetNum: 0.25,
    color: 'bg-red-700',
    stationsCount: 235,
  },
  {
    slug: 'moya',
    name: 'Moya',
    fullName: 'Moya',
    brandKeys: ['moya'],
    description: 'Moya to polska sieć niezależnych stacji paliw z ponad 900 placówkami. Ceny konkurencyjne, zwłaszcza poza autostradami.',
    priceOffset: '−0,15 zł',
    priceOffsetNum: -0.15,
    color: 'bg-blue-600',
    stationsCount: 920,
  },
  {
    slug: 'huzar',
    name: 'Huzar',
    fullName: 'Huzar',
    brandKeys: ['huzar'],
    description: 'Huzar to polska sieć stacji paliw nastawiona na kierowców zawodowych i flotowych. Ceny zwykle poniżej średniej.',
    priceOffset: '−0,20 zł',
    priceOffsetNum: -0.2,
    color: 'bg-orange-600',
    stationsCount: 320,
  },
];

export interface City {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  region?: string;
  wikidata?: string;
  population?: number;
}

export const CITIES: City[] = [
  // Wielkie miasta (>200k)
  { name: 'Warszawa', slug: 'warszawa', lat: 52.2297, lng: 21.0122, region: 'Mazowieckie', wikidata: 'Q270', population: 1860000 },
  { name: 'Kraków', slug: 'krakow', lat: 50.0647, lng: 19.9450, region: 'Małopolskie', wikidata: 'Q31487', population: 779000 },
  { name: 'Łódź', slug: 'lodz', lat: 51.7592, lng: 19.4560, region: 'Łódzkie', wikidata: 'Q484', population: 670000 },
  { name: 'Wrocław', slug: 'wroclaw', lat: 51.1079, lng: 17.0385, region: 'Dolnośląskie', wikidata: 'Q1799', population: 674000 },
  { name: 'Poznań', slug: 'poznan', lat: 52.4064, lng: 16.9252, region: 'Wielkopolskie', wikidata: 'Q268', population: 533000 },
  { name: 'Gdańsk', slug: 'gdansk', lat: 54.3520, lng: 18.6466, region: 'Pomorskie', wikidata: 'Q1792', population: 487000 },
  { name: 'Szczecin', slug: 'szczecin', lat: 53.4285, lng: 14.5528, region: 'Zachodniopomorskie', wikidata: 'Q3937', population: 397000 },
  { name: 'Bydgoszcz', slug: 'bydgoszcz', lat: 53.1235, lng: 18.0084, region: 'Kujawsko-pomorskie', wikidata: 'Q47554', population: 339000 },
  { name: 'Lublin', slug: 'lublin', lat: 51.2465, lng: 22.5684, region: 'Lubelskie', wikidata: 'Q42415', population: 333000 },
  { name: 'Białystok', slug: 'bialystok', lat: 53.1325, lng: 23.1688, region: 'Podlaskie', wikidata: 'Q2280', population: 296000 },
  { name: 'Katowice', slug: 'katowice', lat: 50.2649, lng: 19.0238, region: 'Śląskie', wikidata: 'Q798', population: 286000 },
  { name: 'Gdynia', slug: 'gdynia', lat: 54.5189, lng: 18.5305, region: 'Pomorskie', wikidata: 'Q40966', population: 244000 },
  { name: 'Częstochowa', slug: 'czestochowa', lat: 50.8118, lng: 19.1203, region: 'Śląskie', wikidata: 'Q103349', population: 215000 },
  { name: 'Radom', slug: 'radom', lat: 51.4027, lng: 21.1471, region: 'Mazowieckie', wikidata: 'Q98454', population: 207000 },
  { name: 'Toruń', slug: 'torun', lat: 53.0138, lng: 18.5981, region: 'Kujawsko-pomorskie', wikidata: 'Q47558', population: 198000 },
  { name: 'Sosnowiec', slug: 'sosnowiec', lat: 50.2861, lng: 19.1040, region: 'Śląskie', wikidata: 'Q103376', population: 196000 },
  { name: 'Rzeszów', slug: 'rzeszow', lat: 50.0412, lng: 21.9991, region: 'Podkarpackie', wikidata: 'Q105190', population: 198000 },
  { name: 'Kielce', slug: 'kielce', lat: 50.8661, lng: 20.6286, region: 'Świętokrzyskie', wikidata: 'Q102317', population: 191000 },
  { name: 'Gliwice', slug: 'gliwice', lat: 50.2945, lng: 18.6714, region: 'Śląskie', wikidata: 'Q140763', population: 178000 },
  { name: 'Olsztyn', slug: 'olsztyn', lat: 53.7784, lng: 20.4801, region: 'Warmińsko-mazurskie', wikidata: 'Q102928', population: 169000 },
  { name: 'Bielsko-Biała', slug: 'bielsko-biala', lat: 49.8225, lng: 19.0444, region: 'Śląskie', wikidata: 'Q145332', population: 169000 },
  { name: 'Zabrze', slug: 'zabrze', lat: 50.3249, lng: 18.7857, region: 'Śląskie', wikidata: 'Q146802', population: 169000 },
  { name: 'Bytom', slug: 'bytom', lat: 50.3483, lng: 18.9163, region: 'Śląskie', wikidata: 'Q47715', population: 162000 },
  // 100k–170k
  { name: 'Zielona Góra', slug: 'zielona-gora', lat: 51.9356, lng: 15.5062, region: 'Lubuskie', wikidata: 'Q104731', population: 140000 },
  { name: 'Rybnik', slug: 'rybnik', lat: 50.1000, lng: 18.5453, region: 'Śląskie', wikidata: 'Q47743', population: 134000 },
  { name: 'Ruda Śląska', slug: 'ruda-slaska', lat: 50.2588, lng: 18.8560, region: 'Śląskie', wikidata: 'Q170662', population: 134000 },
  { name: 'Tychy', slug: 'tychy', lat: 50.1228, lng: 18.9963, region: 'Śląskie', wikidata: 'Q102739', population: 124000 },
  { name: 'Opole', slug: 'opole', lat: 50.6751, lng: 17.9213, region: 'Opolskie', wikidata: 'Q173084', population: 127000 },
  { name: 'Gorzów Wielkopolski', slug: 'gorzow-wielkopolski', lat: 52.7368, lng: 15.2288, region: 'Lubuskie', wikidata: 'Q104731', population: 116000 },
  { name: 'Dąbrowa Górnicza', slug: 'dabrowa-gornicza', lat: 50.3234, lng: 19.1833, region: 'Śląskie', wikidata: 'Q137034', population: 117000 },
  { name: 'Płock', slug: 'plock', lat: 52.5463, lng: 19.7065, region: 'Mazowieckie', wikidata: 'Q156162', population: 116000 },
  { name: 'Elbląg', slug: 'elblag', lat: 54.1522, lng: 19.4088, region: 'Warmińsko-mazurskie', wikidata: 'Q149957', population: 116000 },
  { name: 'Wałbrzych', slug: 'walbrzych', lat: 50.7714, lng: 16.2844, region: 'Dolnośląskie', wikidata: 'Q47045', population: 110000 },
  { name: 'Włocławek', slug: 'wloclawek', lat: 52.6484, lng: 19.0677, region: 'Kujawsko-pomorskie', wikidata: 'Q198569', population: 107000 },
  { name: 'Tarnów', slug: 'tarnow', lat: 50.0125, lng: 20.9879, region: 'Małopolskie', wikidata: 'Q198525', population: 105000 },
  { name: 'Chorzów', slug: 'chorzow', lat: 50.2970, lng: 18.9546, region: 'Śląskie', wikidata: 'Q102289', population: 104000 },
  { name: 'Koszalin', slug: 'koszalin', lat: 54.1944, lng: 16.1716, region: 'Zachodniopomorskie', wikidata: 'Q102993', population: 105000 },
  { name: 'Kalisz', slug: 'kalisz', lat: 51.7611, lng: 18.0913, region: 'Wielkopolskie', wikidata: 'Q193697', population: 100000 },
  { name: 'Legnica', slug: 'legnica', lat: 51.2070, lng: 16.1551, region: 'Dolnośląskie', wikidata: 'Q193767', population: 98000 },
  // 50k–100k
  { name: 'Grudziądz', slug: 'grudziadz', lat: 53.4837, lng: 18.7536, region: 'Kujawsko-pomorskie', wikidata: 'Q193722', population: 93000 },
  { name: 'Słupsk', slug: 'slupsk', lat: 54.4641, lng: 17.0285, region: 'Pomorskie', wikidata: 'Q193829', population: 89000 },
  { name: 'Jaworzno', slug: 'jaworzno', lat: 50.2049, lng: 19.2761, region: 'Śląskie', wikidata: 'Q193753', population: 89000 },
  { name: 'Jastrzębie-Zdrój', slug: 'jastrzebie-zdroj', lat: 49.9526, lng: 18.5846, region: 'Śląskie', wikidata: 'Q165166', population: 87000 },
  { name: 'Nowy Sącz', slug: 'nowy-sacz', lat: 49.6244, lng: 20.6987, region: 'Małopolskie', wikidata: 'Q201047', population: 83000 },
  { name: 'Jelenia Góra', slug: 'jelenia-gora', lat: 50.9044, lng: 15.7196, region: 'Dolnośląskie', wikidata: 'Q193791', population: 77000 },
  { name: 'Siedlce', slug: 'siedlce', lat: 52.1676, lng: 22.2902, region: 'Mazowieckie', wikidata: 'Q193859', population: 78000 },
  { name: 'Mysłowice', slug: 'myslowice', lat: 50.2334, lng: 19.1359, region: 'Śląskie', wikidata: 'Q193707', population: 73000 },
  { name: 'Konin', slug: 'konin', lat: 52.2230, lng: 18.2512, region: 'Wielkopolskie', wikidata: 'Q193821', population: 72000 },
  { name: 'Piła', slug: 'pila', lat: 53.1517, lng: 16.7385, region: 'Wielkopolskie', wikidata: 'Q193743', population: 73000 },
  { name: 'Piotrków Trybunalski', slug: 'piotrkow-trybunalski', lat: 51.4051, lng: 19.7030, region: 'Łódzkie', wikidata: 'Q193767', population: 71000 },
  { name: 'Inowrocław', slug: 'inowroclaw', lat: 52.7970, lng: 18.2506, region: 'Kujawsko-pomorskie', wikidata: 'Q193804', population: 73000 },
  { name: 'Lubin', slug: 'lubin', lat: 51.4018, lng: 16.2022, region: 'Dolnośląskie', wikidata: 'Q193832', population: 71000 },
  { name: 'Ostrów Wielkopolski', slug: 'ostrow-wielkopolski', lat: 51.6519, lng: 17.8067, region: 'Wielkopolskie', wikidata: 'Q193819', population: 70000 },
  { name: 'Suwałki', slug: 'suwalki', lat: 54.1115, lng: 22.9296, region: 'Podlaskie', wikidata: 'Q193827', population: 69000 },
  { name: 'Stargard', slug: 'stargard', lat: 53.3360, lng: 15.0501, region: 'Zachodniopomorskie', wikidata: 'Q193836', population: 67000 },
  { name: 'Gniezno', slug: 'gniezno', lat: 52.5355, lng: 17.5952, region: 'Wielkopolskie', wikidata: 'Q39522', population: 67000 },
  { name: 'Pabianice', slug: 'pabianice', lat: 51.6648, lng: 19.3552, region: 'Łódzkie', wikidata: 'Q193881', population: 65000 },
  { name: 'Siemianowice Śląskie', slug: 'siemianowice-slaskie', lat: 50.3274, lng: 19.0294, region: 'Śląskie', wikidata: 'Q193894', population: 65000 },
  { name: 'Głogów', slug: 'glogow', lat: 51.6611, lng: 16.0833, region: 'Dolnośląskie', wikidata: 'Q193800', population: 65000 },
  { name: 'Leszno', slug: 'leszno', lat: 51.8408, lng: 16.5746, region: 'Wielkopolskie', wikidata: 'Q193836', population: 62000 },
  { name: 'Żory', slug: 'zory', lat: 50.0429, lng: 18.7065, region: 'Śląskie', wikidata: 'Q175156', population: 60000 },
  { name: 'Pruszków', slug: 'pruszkow', lat: 52.1683, lng: 20.8089, region: 'Mazowieckie', wikidata: 'Q193905', population: 64000 },
  { name: 'Tomaszów Mazowiecki', slug: 'tomaszow-mazowiecki', lat: 51.5298, lng: 20.0084, region: 'Łódzkie', wikidata: 'Q193912', population: 60000 },
  { name: 'Łomża', slug: 'lomza', lat: 53.1781, lng: 22.0598, region: 'Podlaskie', wikidata: 'Q193831', population: 62000 },
  { name: 'Mielec', slug: 'mielec', lat: 50.2871, lng: 21.4239, region: 'Podkarpackie', wikidata: 'Q193924', population: 60000 },
  { name: 'Ełk', slug: 'elk', lat: 53.8275, lng: 22.3657, region: 'Warmińsko-mazurskie', wikidata: 'Q183060', population: 60000 },
  { name: 'Tczew', slug: 'tczew', lat: 54.0918, lng: 18.7791, region: 'Pomorskie', wikidata: 'Q193931', population: 59000 },
  { name: 'Stalowa Wola', slug: 'stalowa-wola', lat: 50.5826, lng: 22.0533, region: 'Podkarpackie', wikidata: 'Q193847', population: 59000 },
  { name: 'Chełm', slug: 'chelm', lat: 51.1431, lng: 23.4716, region: 'Lubelskie', wikidata: 'Q193854', population: 60000 },
  { name: 'Zamość', slug: 'zamosc', lat: 50.7242, lng: 23.2516, region: 'Lubelskie', wikidata: 'Q14716', population: 60000 },
  { name: 'Biała Podlaska', slug: 'biala-podlaska', lat: 52.0325, lng: 23.1149, region: 'Lubelskie', wikidata: 'Q193879', population: 57000 },
  { name: 'Świdnica', slug: 'swidnica', lat: 50.8421, lng: 16.4892, region: 'Dolnośląskie', wikidata: 'Q193896', population: 56000 },
  { name: 'Bełchatów', slug: 'belchatow', lat: 51.3700, lng: 19.3568, region: 'Łódzkie', wikidata: 'Q190488', population: 55000 },
  { name: 'Kędzierzyn-Koźle', slug: 'kedzierzyn-kozle', lat: 50.3392, lng: 18.2294, region: 'Opolskie', wikidata: 'Q193913', population: 58000 },
  { name: 'Świętochłowice', slug: 'swietochlowice', lat: 50.2919, lng: 18.9166, region: 'Śląskie', wikidata: 'Q193919', population: 50000 },
  { name: 'Skierniewice', slug: 'skierniewice', lat: 51.9550, lng: 20.1554, region: 'Łódzkie', wikidata: 'Q193926', population: 47000 },
  { name: 'Tarnowskie Góry', slug: 'tarnowskie-gory', lat: 50.4453, lng: 18.8612, region: 'Śląskie', wikidata: 'Q464524', population: 60000 },
  { name: 'Wejherowo', slug: 'wejherowo', lat: 54.6044, lng: 18.2367, region: 'Pomorskie', wikidata: 'Q193933', population: 50000 },
  { name: 'Tarnobrzeg', slug: 'tarnobrzeg', lat: 50.5731, lng: 21.6791, region: 'Podkarpackie', wikidata: 'Q193939', population: 45000 },
  { name: 'Otwock', slug: 'otwock', lat: 52.1056, lng: 21.2625, region: 'Mazowieckie', wikidata: 'Q193905', population: 45000 },
  { name: 'Radomsko', slug: 'radomsko', lat: 51.0676, lng: 19.4444, region: 'Łódzkie', wikidata: 'Q455119', population: 47000 },
  { name: 'Krosno', slug: 'krosno', lat: 49.6877, lng: 21.7706, region: 'Podkarpackie', wikidata: 'Q193941', population: 46000 },
  { name: 'Sieradz', slug: 'sieradz', lat: 51.5953, lng: 18.7308, region: 'Łódzkie', wikidata: 'Q193941', population: 42000 },
  { name: 'Sochaczew', slug: 'sochaczew', lat: 52.2293, lng: 20.2378, region: 'Mazowieckie', wikidata: 'Q193941', population: 37000 },
  { name: 'Kutno', slug: 'kutno', lat: 52.2306, lng: 19.3666, region: 'Łódzkie', wikidata: 'Q193941', population: 43000 },
  { name: 'Mińsk Mazowiecki', slug: 'minsk-mazowiecki', lat: 52.1798, lng: 21.5742, region: 'Mazowieckie', wikidata: 'Q455125', population: 39000 },
  { name: 'Wołomin', slug: 'wolomin', lat: 52.3450, lng: 21.2458, region: 'Mazowieckie', wikidata: 'Q455127', population: 37000 },
  { name: 'Legionowo', slug: 'legionowo', lat: 52.4015, lng: 20.9272, region: 'Mazowieckie', wikidata: 'Q455128', population: 54000 },
  { name: 'Piaseczno', slug: 'piaseczno', lat: 52.0808, lng: 21.0227, region: 'Mazowieckie', wikidata: 'Q1059559', population: 51000 },
  { name: 'Marki', slug: 'marki', lat: 52.3193, lng: 21.1067, region: 'Mazowieckie', wikidata: 'Q1112946', population: 36000 },
  { name: 'Bochnia', slug: 'bochnia', lat: 49.9690, lng: 20.4287, region: 'Małopolskie', wikidata: 'Q193941', population: 30000 },
  { name: 'Wieliczka', slug: 'wieliczka', lat: 49.9871, lng: 20.0651, region: 'Małopolskie', wikidata: 'Q487708', population: 24000 },
  { name: 'Sandomierz', slug: 'sandomierz', lat: 50.6817, lng: 21.7491, region: 'Świętokrzyskie', wikidata: 'Q200713', population: 23000 },
  { name: 'Skarżysko-Kamienna', slug: 'skarzysko-kamienna', lat: 51.1124, lng: 20.8729, region: 'Świętokrzyskie', wikidata: 'Q193971', population: 45000 },
  { name: 'Przemyśl', slug: 'przemysl', lat: 49.7838, lng: 22.7677, region: 'Podkarpackie', wikidata: 'Q193941', population: 60000 },
  { name: 'Jarosław', slug: 'jaroslaw', lat: 50.0153, lng: 22.6786, region: 'Podkarpackie', wikidata: 'Q193983', population: 37000 },
  { name: 'Sanok', slug: 'sanok', lat: 49.5563, lng: 22.2058, region: 'Podkarpackie', wikidata: 'Q193993', population: 38000 },
  { name: 'Łowicz', slug: 'lowicz', lat: 52.1060, lng: 19.9450, region: 'Łódzkie', wikidata: 'Q193997', population: 28000 },
  { name: 'Świnoujście', slug: 'swinoujscie', lat: 53.9098, lng: 14.2469, region: 'Zachodniopomorskie', wikidata: 'Q210', population: 40000 },
  { name: 'Police', slug: 'police', lat: 53.5500, lng: 14.5667, region: 'Zachodniopomorskie', wikidata: 'Q193845', population: 33000 },
  { name: 'Wałcz', slug: 'walcz', lat: 53.2729, lng: 16.4748, region: 'Zachodniopomorskie', wikidata: 'Q193960', population: 25000 },
  { name: 'Chojnice', slug: 'chojnice', lat: 53.6953, lng: 17.5567, region: 'Pomorskie', wikidata: 'Q200713', population: 40000 },
  { name: 'Brodnica', slug: 'brodnica', lat: 53.2587, lng: 19.4034, region: 'Kujawsko-pomorskie', wikidata: 'Q193983', population: 28000 },
  { name: 'Iława', slug: 'ilawa', lat: 53.5961, lng: 19.5651, region: 'Warmińsko-mazurskie', wikidata: 'Q193993', population: 33000 },
  { name: 'Giżycko', slug: 'gizycko', lat: 54.0392, lng: 21.7656, region: 'Warmińsko-mazurskie', wikidata: 'Q193997', population: 29000 },
  { name: 'Augustów', slug: 'augustow', lat: 53.8441, lng: 22.9763, region: 'Podlaskie', wikidata: 'Q193962', population: 29000 },
  { name: 'Ostrołęka', slug: 'ostroleka', lat: 53.0859, lng: 21.5765, region: 'Mazowieckie', wikidata: 'Q193845', population: 50000 },
  { name: 'Bolesławiec', slug: 'boleslawiec', lat: 51.2624, lng: 15.5685, region: 'Dolnośląskie', wikidata: 'Q193941', population: 39000 },
  { name: 'Kłodzko', slug: 'klodzko', lat: 50.4344, lng: 16.6519, region: 'Dolnośląskie', wikidata: 'Q193997', population: 28000 },
  { name: 'Dzierżoniów', slug: 'dzierzoniow', lat: 50.7283, lng: 16.6520, region: 'Dolnośląskie', wikidata: 'Q193983', population: 33000 },
  { name: 'Oława', slug: 'olawa', lat: 50.9444, lng: 17.2911, region: 'Dolnośląskie', wikidata: 'Q193962', population: 32000 },
  { name: 'Brzeg', slug: 'brzeg', lat: 50.8606, lng: 17.4671, region: 'Opolskie', wikidata: 'Q193962', population: 36000 },
  { name: 'Oleśnica', slug: 'olesnica', lat: 51.2128, lng: 17.3854, region: 'Dolnośląskie', wikidata: 'Q193845', population: 38000 },
  { name: 'Polkowice', slug: 'polkowice', lat: 51.5039, lng: 16.0739, region: 'Dolnośląskie', wikidata: 'Q193845', population: 22000 },
  { name: 'Zakopane', slug: 'zakopane', lat: 49.2992, lng: 19.9496, region: 'Małopolskie', wikidata: 'Q103906', population: 27000 },
  { name: 'Olkusz', slug: 'olkusz', lat: 50.2806, lng: 19.5651, region: 'Małopolskie', wikidata: 'Q193983', population: 35000 },
  { name: 'Łuków', slug: 'lukow', lat: 51.9298, lng: 22.3818, region: 'Lubelskie', wikidata: 'Q193845', population: 30000 },
  { name: 'Kraśnik', slug: 'krasnik', lat: 50.9225, lng: 22.2273, region: 'Lubelskie', wikidata: 'Q193941', population: 35000 },
  { name: 'Świebodzin', slug: 'swiebodzin', lat: 52.2491, lng: 15.5366, region: 'Lubuskie', wikidata: 'Q193962', population: 22000 },
  { name: 'Szczecinek', slug: 'szczecinek', lat: 53.7088, lng: 16.6985, region: 'Zachodniopomorskie', wikidata: 'Q200713', population: 39000 },
  { name: 'Pszczyna', slug: 'pszczyna', lat: 49.9806, lng: 18.9489, region: 'Śląskie', wikidata: 'Q193997', population: 26000 },
  { name: 'Lubliniec', slug: 'lubliniec', lat: 50.6709, lng: 18.6885, region: 'Śląskie', wikidata: 'Q193962', population: 24000 },
  { name: 'Zgierz', slug: 'zgierz', lat: 51.8552, lng: 19.4146, region: 'Łódzkie', wikidata: 'Q193962', population: 56000 },
  { name: 'Aleksandrów Łódzki', slug: 'aleksandrow-lodzki', lat: 51.8210, lng: 19.3050, region: 'Łódzkie', wikidata: 'Q193983', population: 21000 },
  { name: 'Knurów', slug: 'knurow', lat: 50.2192, lng: 18.6603, region: 'Śląskie', wikidata: 'Q193845', population: 38000 },
  { name: 'Mikołów', slug: 'mikolow', lat: 50.1718, lng: 18.9087, region: 'Śląskie', wikidata: 'Q193845', population: 41000 },
  { name: 'Czeladź', slug: 'czeladz', lat: 50.3243, lng: 19.0780, region: 'Śląskie', wikidata: 'Q193845', population: 32000 },
  { name: 'Andrychów', slug: 'andrychow', lat: 49.8542, lng: 19.3417, region: 'Małopolskie', wikidata: 'Q193845', population: 20000 },
  { name: 'Wadowice', slug: 'wadowice', lat: 49.8839, lng: 19.4926, region: 'Małopolskie', wikidata: 'Q198554', population: 19000 },
  { name: 'Kołobrzeg', slug: 'kolobrzeg', lat: 54.1758, lng: 15.5832, region: 'Zachodniopomorskie', wikidata: 'Q193962', population: 47000 },
  { name: 'Starogard Gdański', slug: 'starogard-gdanski', lat: 53.9694, lng: 18.5290, region: 'Pomorskie', wikidata: 'Q193962', population: 47000 },
  { name: 'Pruszcz Gdański', slug: 'pruszcz-gdanski', lat: 54.2650, lng: 18.6394, region: 'Pomorskie', wikidata: 'Q193845', population: 32000 },
  { name: 'Malbork', slug: 'malbork', lat: 54.0359, lng: 19.0457, region: 'Pomorskie', wikidata: 'Q193845', population: 38000 },
  { name: 'Rumia', slug: 'rumia', lat: 54.5694, lng: 18.4083, region: 'Pomorskie', wikidata: 'Q193845', population: 50000 },
  { name: 'Lębork', slug: 'lebork', lat: 54.5443, lng: 17.7491, region: 'Pomorskie', wikidata: 'Q193845', population: 35000 },
  { name: 'Kościerzyna', slug: 'koscierzyna', lat: 54.1247, lng: 17.9794, region: 'Pomorskie', wikidata: 'Q193845', population: 23000 },
  { name: 'Kwidzyn', slug: 'kwidzyn', lat: 53.7307, lng: 18.9311, region: 'Pomorskie', wikidata: 'Q193962', population: 38000 },
  { name: 'Ostróda', slug: 'ostroda', lat: 53.6963, lng: 19.9655, region: 'Warmińsko-mazurskie', wikidata: 'Q193845', population: 33000 },
  { name: 'Mrągowo', slug: 'mragowo', lat: 53.8665, lng: 21.3055, region: 'Warmińsko-mazurskie', wikidata: 'Q193845', population: 21000 },
  { name: 'Pisz', slug: 'pisz', lat: 53.6286, lng: 21.8146, region: 'Warmińsko-mazurskie', wikidata: 'Q193845', population: 19000 },
  { name: 'Kętrzyn', slug: 'ketrzyn', lat: 54.0764, lng: 21.3753, region: 'Warmińsko-mazurskie', wikidata: 'Q193845', population: 27000 },
  { name: 'Zambrów', slug: 'zambrow', lat: 52.9847, lng: 22.2436, region: 'Podlaskie', wikidata: 'Q193845', population: 22000 },
  { name: 'Hajnówka', slug: 'hajnowka', lat: 52.7414, lng: 23.5828, region: 'Podlaskie', wikidata: 'Q193845', population: 21000 },
  { name: 'Bielsk Podlaski', slug: 'bielsk-podlaski', lat: 52.7649, lng: 23.1864, region: 'Podlaskie', wikidata: 'Q193845', population: 26000 },
  { name: 'Sokołów Podlaski', slug: 'sokolow-podlaski', lat: 52.4081, lng: 22.2496, region: 'Mazowieckie', wikidata: 'Q193845', population: 18000 },
  { name: 'Garwolin', slug: 'garwolin', lat: 51.8989, lng: 21.6181, region: 'Mazowieckie', wikidata: 'Q193845', population: 17000 },
  { name: 'Wyszków', slug: 'wyszkow', lat: 52.5944, lng: 21.4577, region: 'Mazowieckie', wikidata: 'Q193845', population: 27000 },
  { name: 'Kozienice', slug: 'kozienice', lat: 51.5806, lng: 21.5447, region: 'Mazowieckie', wikidata: 'Q193845', population: 17000 },
  { name: 'Pułtusk', slug: 'pultusk', lat: 52.7095, lng: 21.0838, region: 'Mazowieckie', wikidata: 'Q193845', population: 19000 },
  { name: 'Ciechanów', slug: 'ciechanow', lat: 52.8809, lng: 20.6209, region: 'Mazowieckie', wikidata: 'Q193845', population: 43000 },
  { name: 'Mława', slug: 'mlawa', lat: 53.1124, lng: 20.3749, region: 'Mazowieckie', wikidata: 'Q193845', population: 30000 },
  { name: 'Nowy Targ', slug: 'nowy-targ', lat: 49.4798, lng: 20.0354, region: 'Małopolskie', wikidata: 'Q193845', population: 33000 },
  { name: 'Limanowa', slug: 'limanowa', lat: 49.7053, lng: 20.4255, region: 'Małopolskie', wikidata: 'Q193845', population: 14000 },
  { name: 'Gorlice', slug: 'gorlice', lat: 49.6577, lng: 21.1599, region: 'Małopolskie', wikidata: 'Q193845', population: 27000 },
  { name: 'Krynica-Zdrój', slug: 'krynica-zdroj', lat: 49.4209, lng: 20.9605, region: 'Małopolskie', wikidata: 'Q193845', population: 11000 },
  { name: 'Nysa', slug: 'nysa', lat: 50.4748, lng: 17.3328, region: 'Opolskie', wikidata: 'Q193845', population: 44000 },
  { name: 'Prudnik', slug: 'prudnik', lat: 50.3217, lng: 17.5784, region: 'Opolskie', wikidata: 'Q193845', population: 21000 },
  { name: 'Strzelce Opolskie', slug: 'strzelce-opolskie', lat: 50.5114, lng: 18.3045, region: 'Opolskie', wikidata: 'Q193845', population: 19000 },
  { name: 'Racibórz', slug: 'raciborz', lat: 50.0917, lng: 18.2194, region: 'Śląskie', wikidata: 'Q193845', population: 54000 },
  { name: 'Wodzisław Śląski', slug: 'wodzislaw-slaski', lat: 50.0028, lng: 18.4594, region: 'Śląskie', wikidata: 'Q200713', population: 47000 },
  { name: 'Cieszyn', slug: 'cieszyn', lat: 49.7475, lng: 18.6286, region: 'Śląskie', wikidata: 'Q193845', population: 33000 },
  { name: 'Końskie', slug: 'konskie', lat: 51.1900, lng: 20.4000, region: 'Świętokrzyskie', wikidata: 'Q193845', population: 19000 },
  { name: 'Puławy', slug: 'pulawy', lat: 51.4167, lng: 21.9667, region: 'Lubelskie', wikidata: 'Q193845', population: 47000 },
  { name: 'Świdnik', slug: 'swidnik', lat: 51.2247, lng: 22.6961, region: 'Lubelskie', wikidata: 'Q193845', population: 39000 },
  { name: 'Chełmża', slug: 'chelmza', lat: 53.1844, lng: 18.6019, region: 'Kujawsko-pomorskie', wikidata: 'Q193845', population: 14000 },
];

export interface Region {
  name: string;
  slug: string;
  capital: string;
  capitalSlug: string;
  wikidata: string;
  /** Geocenter dla mapy. */
  lat: number;
  lng: number;
  population: number;
  description: string;
}

export interface Highway {
  /** Oznaczenie ("A1", "S7"). */
  code: string;
  slug: string;
  /** Pełna nazwa, np. "Autostrada A1 (Amber One)". */
  name: string;
  /** Trasa od → do. */
  from: string;
  to: string;
  /** Długość w km. */
  lengthKm: number;
  /** Główne miasta na trasie. */
  cities: string[];
  /** Opis trasy. */
  description: string;
  /** Wikidata Q ID. */
  wikidata: string;
  /** Bounding box [southLat, westLng, northLat, eastLng] dla filtru stacji. */
  bbox: [number, number, number, number];
}

export interface Border {
  slug: string;
  /** Sąsiedni kraj. */
  country: string;
  /** Flaga ISO. */
  flag: string;
  /** Wikidata kraju. */
  wikidata: string;
  /** Główne przejścia graniczne. */
  crossings: string[];
  /** Polskie miasta przygraniczne (CITIES slugs lub bare name). */
  borderCities: string[];
  /** Średnia cena Pb95 w sąsiednim kraju (orientacyjna, zł/l po przeliczeniu). */
  avgPb95Foreign: number;
  /** Czy opłaca się tankować za granicą — short answer. */
  worthIt: 'yes' | 'mixed' | 'no';
  description: string;
}

export const BORDERS: Border[] = [
  {
    slug: 'niemcy', country: 'Niemcy', flag: '🇩🇪', wikidata: 'Q183',
    crossings: ['Świecko (A2)', 'Olszyna (A18)', 'Jędrzychowice (A4)', 'Kostrzyn nad Odrą', 'Słubice', 'Zgorzelec'],
    borderCities: ['Szczecin', 'Świnoujście', 'Gorzów Wielkopolski', 'Zielona Góra', 'Legnica', 'Jelenia Góra', 'Zgorzelec'],
    avgPb95Foreign: 7.80,
    worthIt: 'no',
    description: 'Granica z Niemcami: paliwo zazwyczaj o 0,80-1,20 zł/l droższe niż w Polsce. Tankowanie w Polsce przed przekroczeniem granicy zazwyczaj się opłaca dla mieszkańców obu krajów.',
  },
  {
    slug: 'czechy', country: 'Czechy', flag: '🇨🇿', wikidata: 'Q213',
    crossings: ['Cieszyn (D1)', 'Chyżne', 'Boboszów', 'Kudowa-Słone', 'Lubawka', 'Náchod'],
    borderCities: ['Cieszyn', 'Kłodzko', 'Wałbrzych', 'Jelenia Góra', 'Lubawka', 'Bielsko-Biała'],
    avgPb95Foreign: 6.90,
    worthIt: 'mixed',
    description: 'Granica z Czechami: ceny zbliżone do polskich. Polski Pb95 jest zazwyczaj o 0,30-0,60 zł/l tańszy, ale w Czechach lepsza dostępność premium paliw.',
  },
  {
    slug: 'slowacja', country: 'Słowacja', flag: '🇸🇰', wikidata: 'Q214',
    crossings: ['Chyżne', 'Łysa Polana', 'Niedzica', 'Korbielów', 'Ujsoły'],
    borderCities: ['Zakopane', 'Nowy Targ', 'Cieszyn', 'Bielsko-Biała'],
    avgPb95Foreign: 6.80,
    worthIt: 'mixed',
    description: 'Granica ze Słowacją: ceny porównywalne z polskimi (Polska zwykle o 0,30-0,50 zł/l tańsza). Słowacja ma droższy LPG.',
  },
  {
    slug: 'litwa', country: 'Litwa', flag: '🇱🇹', wikidata: 'Q37',
    crossings: ['Budzisko (A8)', 'Ogrodniki', 'Tuhanovičy'],
    borderCities: ['Suwałki', 'Augustów', 'Sejny'],
    avgPb95Foreign: 6.90,
    worthIt: 'mixed',
    description: 'Granica z Litwą: ceny zbliżone (Litwa droższa o 0,30-0,60 zł/l). Główne przejście: Budzisko na trasie Via Baltica.',
  },
  {
    slug: 'ukraina', country: 'Ukraina', flag: '🇺🇦', wikidata: 'Q212',
    crossings: ['Medyka', 'Korczowa (A4)', 'Hrebenne', 'Dorohusk', 'Zosin', 'Krościenko'],
    borderCities: ['Przemyśl', 'Jarosław', 'Hrubieszów', 'Chełm', 'Lubaczów'],
    avgPb95Foreign: 5.50,
    worthIt: 'yes',
    description: 'Granica z Ukrainą: paliwo na Ukrainie tańsze o 0,50-1,00 zł/l. Tankowanie na Ukrainie ograniczone limitem celnym (10 l w baku + 10 l w kanistrze bez cła).',
  },
  {
    slug: 'bialorus', country: 'Białoruś', flag: '🇧🇾', wikidata: 'Q184',
    crossings: ['Terespol (A2)', 'Kuźnica Białostocka', 'Bobrowniki'],
    borderCities: ['Białystok', 'Hajnówka', 'Biała Podlaska', 'Terespol'],
    avgPb95Foreign: 4.80,
    worthIt: 'yes',
    description: 'Granica z Białorusią: paliwo na Białorusi znacznie tańsze (~30-40%). UWAGA: ze względu na sankcje i obostrzenia po 2022 ruch tranzytowy ograniczony.',
  },
  {
    slug: 'rosja-obwod-kaliningradzki', country: 'Rosja (obwód kaliningradzki)', flag: '🇷🇺', wikidata: 'Q1749',
    crossings: ['Bezledy', 'Grzechotki', 'Gronowo'],
    borderCities: ['Elbląg', 'Olsztyn', 'Bartoszyce'],
    avgPb95Foreign: 4.50,
    worthIt: 'no',
    description: 'Granica z obwodem kaliningradzkim: paliwo w Rosji tańsze, ale od 2022 obostrzenia wjazdu (zakaz wjazdu pojazdów na rosyjskich rejestracjach). Ruch praktycznie wstrzymany.',
  },
];

export const HIGHWAYS: Highway[] = [
  {
    code: 'A1', slug: 'a1',
    name: 'Autostrada A1 (Amber One)',
    from: 'Trójmiasto (Gdańsk)', to: 'Gorzyczki / granica z Czechami',
    lengthKm: 568,
    cities: ['Gdańsk', 'Toruń', 'Łódź', 'Częstochowa', 'Katowice', 'Gliwice'],
    description: 'Autostrada A1 prowadzi z Trójmiasta przez Łódź do granicy z Czechami. Łączy Bałtyk z południem Polski. Płatna na większości odcinków.',
    wikidata: 'Q146806',
    bbox: [49.7, 18.0, 54.5, 19.5],
  },
  {
    code: 'A2', slug: 'a2',
    name: 'Autostrada A2 (Wolności)',
    from: 'Świecko / granica z Niemcami', to: 'Mińsk Mazowiecki / Terespol',
    lengthKm: 480,
    cities: ['Świecko', 'Poznań', 'Łódź', 'Warszawa', 'Mińsk Mazowiecki'],
    description: 'Autostrada A2 łączy granicę niemiecką ze stolicą Polski i dalej z Białorusią. Główna trasa wschód-zachód. Płatna na całej długości.',
    wikidata: 'Q146807',
    bbox: [51.5, 14.6, 52.6, 22.0],
  },
  {
    code: 'A4', slug: 'a4',
    name: 'Autostrada A4',
    from: 'Jędrzychowice / granica z Niemcami', to: 'Korczowa / granica z Ukrainą',
    lengthKm: 672,
    cities: ['Wrocław', 'Opole', 'Katowice', 'Kraków', 'Tarnów', 'Rzeszów'],
    description: 'Najdłuższa polska autostrada. Łączy granicę niemiecką z ukraińską przez całą południową Polskę. Płatna na większości odcinków.',
    wikidata: 'Q146808',
    bbox: [49.5, 14.9, 51.5, 23.5],
  },
  {
    code: 'A6', slug: 'a6',
    name: 'Autostrada A6',
    from: 'Rosówek / granica z Niemcami', to: 'Kijewo (Szczecin)',
    lengthKm: 28,
    cities: ['Szczecin'],
    description: 'Krótka autostrada wokół Szczecina łącząca granicę niemiecką z miastem. Bezpłatna.',
    wikidata: 'Q146809',
    bbox: [53.3, 14.4, 53.5, 14.8],
  },
  {
    code: 'S1', slug: 's1',
    name: 'Droga ekspresowa S1',
    from: 'Pyrzowice', to: 'Cieszyn / granica z Czechami',
    lengthKm: 135,
    cities: ['Pyrzowice', 'Tychy', 'Bielsko-Biała', 'Cieszyn'],
    description: 'Łączy lotnisko Katowice-Pyrzowice z granicą czeską przez Bielsko-Białą. Bezpłatna.',
    wikidata: 'Q3038340',
    bbox: [49.7, 18.6, 50.5, 19.2],
  },
  {
    code: 'S3', slug: 's3',
    name: 'Droga ekspresowa S3',
    from: 'Świnoujście', to: 'Lubawka / granica z Czechami',
    lengthKm: 480,
    cities: ['Świnoujście', 'Szczecin', 'Gorzów Wielkopolski', 'Zielona Góra', 'Legnica', 'Jelenia Góra'],
    description: 'Trasa północ-południe zachodniej Polski łącząca Bałtyk z Sudetami i granicą czeską. Bezpłatna.',
    wikidata: 'Q3038342',
    bbox: [50.7, 14.7, 53.9, 16.5],
  },
  {
    code: 'S5', slug: 's5',
    name: 'Droga ekspresowa S5',
    from: 'Nowe Marzy (A1)', to: 'Wrocław (A4)',
    lengthKm: 360,
    cities: ['Bydgoszcz', 'Poznań', 'Leszno', 'Wrocław'],
    description: 'Łączy A1 (Trójmiasto-południe) z A4 (Wrocław) przez Bydgoszcz, Poznań i Leszno. Bezpłatna.',
    wikidata: 'Q3038344',
    bbox: [51.0, 16.5, 53.5, 18.5],
  },
  {
    code: 'S7', slug: 's7',
    name: 'Droga ekspresowa S7 (Via Carpatia)',
    from: 'Gdańsk', to: 'Chyżne / granica ze Słowacją',
    lengthKm: 720,
    cities: ['Gdańsk', 'Elbląg', 'Olsztyn', 'Warszawa', 'Radom', 'Kielce', 'Kraków', 'Zakopane'],
    description: 'Najdłuższa polska droga ekspresowa łącząca Bałtyk z Tatrami. Główna trasa do Zakopanego. Bezpłatna.',
    wikidata: 'Q3038346',
    bbox: [49.3, 19.5, 54.5, 22.0],
  },
  {
    code: 'S8', slug: 's8',
    name: 'Droga ekspresowa S8',
    from: 'Wrocław', to: 'Białystok',
    lengthKm: 560,
    cities: ['Wrocław', 'Sieradz', 'Łódź', 'Warszawa', 'Białystok'],
    description: 'Łączy zachodnią Polskę z północno-wschodnią. Główna trasa do Białegostoku i krajów bałtyckich. Bezpłatna.',
    wikidata: 'Q3038348',
    bbox: [51.0, 16.9, 53.2, 23.2],
  },
  {
    code: 'S10', slug: 's10',
    name: 'Droga ekspresowa S10',
    from: 'Szczecin', to: 'Toruń (A1)',
    lengthKm: 280,
    cities: ['Szczecin', 'Piła', 'Bydgoszcz', 'Toruń'],
    description: 'Łączy Pomorze Zachodnie z A1 przez Bydgoszcz. W trakcie budowy / fragmentaryczna. Bezpłatna.',
    wikidata: 'Q3038350',
    bbox: [52.7, 14.5, 53.5, 18.7],
  },
  {
    code: 'S11', slug: 's11',
    name: 'Droga ekspresowa S11',
    from: 'Kołobrzeg', to: 'Tarnowskie Góry (A1)',
    lengthKm: 565,
    cities: ['Kołobrzeg', 'Koszalin', 'Piła', 'Poznań', 'Ostrów Wielkopolski', 'Bytom'],
    description: 'Trasa z polskiego wybrzeża do aglomeracji śląskiej. W trakcie rozbudowy. Bezpłatna.',
    wikidata: 'Q3038352',
    bbox: [50.3, 16.5, 54.2, 18.8],
  },
];

export const REGIONS: Region[] = [
  { name: 'Mazowieckie', slug: 'mazowieckie', capital: 'Warszawa', capitalSlug: 'warszawa', wikidata: 'Q54153', lat: 52.4, lng: 21.0, population: 5500000, description: 'Największe województwo Polski z Warszawą jako stolicą. Centrum biznesowe i administracyjne kraju.' },
  { name: 'Śląskie', slug: 'slaskie', capital: 'Katowice', capitalSlug: 'katowice', wikidata: 'Q54151', lat: 50.3, lng: 19.0, population: 4400000, description: 'Wysoko zurbanizowane województwo na południu Polski z aglomeracją górnośląską.' },
  { name: 'Małopolskie', slug: 'malopolskie', capital: 'Kraków', capitalSlug: 'krakow', wikidata: 'Q54150', lat: 49.9, lng: 20.4, population: 3400000, description: 'Województwo na południu Polski z Krakowem jako stolicą. Tatry i kierunki turystyczne.' },
  { name: 'Wielkopolskie', slug: 'wielkopolskie', capital: 'Poznań', capitalSlug: 'poznan', wikidata: 'Q54225', lat: 52.4, lng: 17.0, population: 3500000, description: 'Województwo w centralnej Polsce, jedno z największych powierzchnią. Stolica: Poznań.' },
  { name: 'Dolnośląskie', slug: 'dolnoslaskie', capital: 'Wrocław', capitalSlug: 'wroclaw', wikidata: 'Q54155', lat: 51.0, lng: 16.5, population: 2900000, description: 'Województwo na południowym zachodzie Polski. Stolica: Wrocław. Sudety, Karkonosze.' },
  { name: 'Łódzkie', slug: 'lodzkie', capital: 'Łódź', capitalSlug: 'lodz', wikidata: 'Q54223', lat: 51.7, lng: 19.5, population: 2400000, description: 'Województwo w centrum Polski. Stolica: Łódź. Krzyżują się tu główne autostrady.' },
  { name: 'Lubelskie', slug: 'lubelskie', capital: 'Lublin', capitalSlug: 'lublin', wikidata: 'Q54156', lat: 51.2, lng: 22.5, population: 2100000, description: 'Wschód Polski, granica z Białorusią i Ukrainą. Stolica: Lublin.' },
  { name: 'Pomorskie', slug: 'pomorskie', capital: 'Gdańsk', capitalSlug: 'gdansk', wikidata: 'Q54226', lat: 54.1, lng: 18.0, population: 2300000, description: 'Województwo nadmorskie z Trójmiastem (Gdańsk, Gdynia, Sopot).' },
  { name: 'Kujawsko-pomorskie', slug: 'kujawsko-pomorskie', capital: 'Bydgoszcz', capitalSlug: 'bydgoszcz', wikidata: 'Q54224', lat: 53.0, lng: 18.5, population: 2100000, description: 'Centralna Polska. Dwie stolice: Bydgoszcz i Toruń.' },
  { name: 'Podkarpackie', slug: 'podkarpackie', capital: 'Rzeszów', capitalSlug: 'rzeszow', wikidata: 'Q54231', lat: 50.0, lng: 22.0, population: 2100000, description: 'Południowo-wschodnia Polska, granica z Ukrainą i Słowacją. Stolica: Rzeszów. Bieszczady.' },
  { name: 'Zachodniopomorskie', slug: 'zachodniopomorskie', capital: 'Szczecin', capitalSlug: 'szczecin', wikidata: 'Q54235', lat: 53.5, lng: 15.0, population: 1700000, description: 'Północno-zachodnia Polska, granica z Niemcami. Stolica: Szczecin.' },
  { name: 'Warmińsko-mazurskie', slug: 'warminsko-mazurskie', capital: 'Olsztyn', capitalSlug: 'olsztyn', wikidata: 'Q54232', lat: 53.8, lng: 20.5, population: 1400000, description: 'Północno-wschodnia Polska, kraina jezior mazurskich. Stolica: Olsztyn.' },
  { name: 'Świętokrzyskie', slug: 'swietokrzyskie', capital: 'Kielce', capitalSlug: 'kielce', wikidata: 'Q54232', lat: 50.9, lng: 20.6, population: 1200000, description: 'Centrum Polski. Stolica: Kielce. Góry Świętokrzyskie.' },
  { name: 'Podlaskie', slug: 'podlaskie', capital: 'Białystok', capitalSlug: 'bialystok', wikidata: 'Q54227', lat: 53.1, lng: 23.0, population: 1200000, description: 'Północno-wschodnia Polska, granica z Białorusią. Stolica: Białystok. Puszcza Białowieska.' },
  { name: 'Lubuskie', slug: 'lubuskie', capital: 'Gorzów Wielkopolski', capitalSlug: 'gorzow-wielkopolski', wikidata: 'Q54228', lat: 52.0, lng: 15.5, population: 1000000, description: 'Zachodnia Polska, granica z Niemcami. Dwie stolice: Gorzów Wielkopolski i Zielona Góra.' },
  { name: 'Opolskie', slug: 'opolskie', capital: 'Opole', capitalSlug: 'opole', wikidata: 'Q54221', lat: 50.7, lng: 17.9, population: 1000000, description: 'Najmniejsze województwo, południowa Polska. Stolica: Opole.' },
];
