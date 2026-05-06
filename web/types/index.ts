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

export const CITIES = [
  { name: 'Warszawa', slug: 'warszawa', lat: 52.2297, lng: 21.0122 },
  { name: 'Kraków', slug: 'krakow', lat: 50.0647, lng: 19.9450 },
  { name: 'Łódź', slug: 'lodz', lat: 51.7592, lng: 19.4560 },
  { name: 'Wrocław', slug: 'wroclaw', lat: 51.1079, lng: 17.0385 },
  { name: 'Poznań', slug: 'poznan', lat: 52.4064, lng: 16.9252 },
  { name: 'Gdańsk', slug: 'gdansk', lat: 54.3520, lng: 18.6466 },
  { name: 'Szczecin', slug: 'szczecin', lat: 53.4285, lng: 14.5528 },
  { name: 'Bydgoszcz', slug: 'bydgoszcz', lat: 53.1235, lng: 18.0084 },
  { name: 'Lublin', slug: 'lublin', lat: 51.2465, lng: 22.5684 },
  { name: 'Katowice', slug: 'katowice', lat: 50.2649, lng: 19.0238 },
  { name: 'Białystok', slug: 'bialystok', lat: 53.1325, lng: 23.1688 },
  { name: 'Gdynia', slug: 'gdynia', lat: 54.5189, lng: 18.5305 },
  { name: 'Częstochowa', slug: 'czestochowa', lat: 50.8118, lng: 19.1203 },
  { name: 'Radom', slug: 'radom', lat: 51.4027, lng: 21.1471 },
  { name: 'Sosnowiec', slug: 'sosnowiec', lat: 50.2861, lng: 19.1040 },
  { name: 'Toruń', slug: 'torun', lat: 53.0138, lng: 18.5981 },
  { name: 'Kielce', slug: 'kielce', lat: 50.8661, lng: 20.6286 },
  { name: 'Rzeszów', slug: 'rzeszow', lat: 50.0412, lng: 21.9991 },
  { name: 'Gliwice', slug: 'gliwice', lat: 50.2945, lng: 18.6714 },
  { name: 'Zabrze', slug: 'zabrze', lat: 50.3249, lng: 18.7857 },
  { name: 'Bytom', slug: 'bytom', lat: 50.3483, lng: 18.9163 },
  { name: 'Bielsko-Biała', slug: 'bielsko-biala', lat: 49.8225, lng: 19.0444 },
  { name: 'Olsztyn', slug: 'olsztyn', lat: 53.7784, lng: 20.4801 },
  { name: 'Ruda Śląska', slug: 'ruda-slaska', lat: 50.2588, lng: 18.8560 },
  { name: 'Rybnik', slug: 'rybnik', lat: 50.1000, lng: 18.5453 },
  { name: 'Tychy', slug: 'tychy', lat: 50.1228, lng: 18.9963 },
  { name: 'Dąbrowa Górnicza', slug: 'dabrowa-gornicza', lat: 50.3234, lng: 19.1833 },
  { name: 'Opole', slug: 'opole', lat: 50.6751, lng: 17.9213 },
  { name: 'Elbląg', slug: 'elblag', lat: 54.1522, lng: 19.4088 },
  { name: 'Płock', slug: 'plock', lat: 52.5463, lng: 19.7065 },
  { name: 'Wałbrzych', slug: 'walbrzych', lat: 50.7714, lng: 16.2844 },
  { name: 'Włocławek', slug: 'wloclawek', lat: 52.6484, lng: 19.0677 },
  { name: 'Tarnów', slug: 'tarnow', lat: 50.0125, lng: 20.9879 },
  { name: 'Chorzów', slug: 'chorzow', lat: 50.2970, lng: 18.9546 },
  { name: 'Koszalin', slug: 'koszalin', lat: 54.1944, lng: 16.1716 },
  { name: 'Legnica', slug: 'legnica', lat: 51.2070, lng: 16.1551 },
  { name: 'Zielona Góra', slug: 'zielona-gora', lat: 51.9356, lng: 15.5062 },
  { name: 'Wodzisław Śląski', slug: 'wodzislaw-slaski', lat: 50.0028, lng: 18.4594 },
  { name: 'Nowy Sącz', slug: 'nowy-sacz', lat: 49.6244, lng: 20.6987 },
  { name: 'Jelenia Góra', slug: 'jelenia-gora', lat: 50.9044, lng: 15.7196 },
  { name: 'Jastrzębie-Zdrój', slug: 'jastrzebie-zdroj', lat: 49.9526, lng: 18.5846 },
  { name: 'Lubin', slug: 'lubin', lat: 51.4018, lng: 16.2022 },
  { name: 'Siedlce', slug: 'siedlce', lat: 52.1676, lng: 22.2902 },
  { name: 'Inowrocław', slug: 'inowroclaw', lat: 52.7970, lng: 18.2506 },
  { name: 'Gniezno', slug: 'gniezno', lat: 52.5355, lng: 17.5952 },
  { name: 'Starachowice', slug: 'starachowice', lat: 51.0500, lng: 21.0676 },
  { name: 'Ostrowiec Świętokrzyski', slug: 'ostrowiec-swietokrzyski', lat: 50.9290, lng: 21.3858 },
  { name: 'Piotrków Trybunalski', slug: 'piotrkow-trybunalski', lat: 51.4051, lng: 19.7030 },
  { name: 'Konin', slug: 'konin', lat: 52.2230, lng: 18.2512 },
];

export const REGIONS = [
  { name: 'Dolnośląskie', slug: 'dolnoslaskie' },
  { name: 'Kujawsko-pomorskie', slug: 'kujawsko-pomorskie' },
  { name: 'Lubelskie', slug: 'lubelskie' },
  { name: 'Lubuskie', slug: 'lubuskie' },
  { name: 'Łódzkie', slug: 'lodzkie' },
  { name: 'Małopolskie', slug: 'malopolskie' },
  { name: 'Mazowieckie', slug: 'mazowieckie' },
  { name: 'Opolskie', slug: 'opolskie' },
  { name: 'Podkarpackie', slug: 'podkarpackie' },
  { name: 'Podlaskie', slug: 'podlaskie' },
  { name: 'Pomorskie', slug: 'pomorskie' },
  { name: 'Śląskie', slug: 'slaskie' },
  { name: 'Świętokrzyskie', slug: 'swietokrzyskie' },
  { name: 'Warmińsko-mazurskie', slug: 'warminsko-mazurskie' },
  { name: 'Wielkopolskie', slug: 'wielkopolskie' },
  { name: 'Zachodniopomorskie', slug: 'zachodniopomorskie' },
];
