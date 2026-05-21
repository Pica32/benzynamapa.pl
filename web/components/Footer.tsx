import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 text-sm border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hlavní navigační sekce */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Ceny paliw</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-green-400 transition-colors">Mapa stacji</Link></li>
              <li><Link href="/najtansze-benzyna/" className="hover:text-green-400 transition-colors">Najtańsza benzyna 95</Link></li>
              <li><Link href="/najtansze-diesel/" className="hover:text-green-400 transition-colors">Najtańszy diesel</Link></li>
              <li><Link href="/najtansze-lpg/" className="hover:text-green-400 transition-colors">Najtańszy LPG autogaz</Link></li>
              <li><Link href="/stacje-ladowania-ev/" className="hover:text-green-400 transition-colors">Stacje ładowania EV</Link></li>
              <li><Link href="/historia-cen/" className="hover:text-green-400 transition-colors">Historia cen 90 dni</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Lokalizacja</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/wojewodztwo/" className="hover:text-green-400 transition-colors">Województwa</Link></li>
              <li><Link href="/miasto/warszawa/" className="hover:text-green-400 transition-colors">Paliwa Warszawa</Link></li>
              <li><Link href="/miasto/krakow/" className="hover:text-green-400 transition-colors">Paliwa Kraków</Link></li>
              <li><Link href="/miasto/wroclaw/" className="hover:text-green-400 transition-colors">Paliwa Wrocław</Link></li>
              <li><Link href="/miasto/poznan/" className="hover:text-green-400 transition-colors">Paliwa Poznań</Link></li>
              <li><Link href="/miasto/gdansk/" className="hover:text-green-400 transition-colors">Paliwa Gdańsk</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Sieci stacji</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/marka/" className="hover:text-green-400 transition-colors">Wszystkie sieci</Link></li>
              <li><Link href="/marka/orlen/" className="hover:text-green-400 transition-colors">Orlen / Lotos</Link></li>
              <li><Link href="/marka/shell/" className="hover:text-green-400 transition-colors">Shell</Link></li>
              <li><Link href="/marka/bp/" className="hover:text-green-400 transition-colors">BP</Link></li>
              <li><Link href="/marka/circle-k/" className="hover:text-green-400 transition-colors">Circle K</Link></li>
              <li><Link href="/marka/moya/" className="hover:text-green-400 transition-colors">Moya</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Informacje</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/o-nas/" className="hover:text-green-400 transition-colors">O nas</Link></li>
              <li><Link href="/jak-dziala/" className="hover:text-green-400 transition-colors">Jak działa</Link></li>
              <li><Link href="/maksymalne-ceny-paliw/" className="hover:text-green-400 transition-colors">Akcyza, VAT, składowe ceny</Link></li>
              <li><Link href="/kalkulator/" className="hover:text-green-400 transition-colors">Kalkulator zużycia</Link></li>
              <li><Link href="/benzyna-vs-diesel/" className="hover:text-green-400 transition-colors">Benzyna vs diesel</Link></li>
              <li><Link href="/aktualnosci/" className="hover:text-green-400 transition-colors">Aktualności i porady</Link></li>
              <li><Link href="/kontakt/" className="hover:text-green-400 transition-colors">Kontakt</Link></li>
            </ul>
          </div>
        </div>

        {/* Spodní pruh */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
            <span>© {year} BenzynaMAPA.pl</span>
            <Link href="/regulamin/" className="hover:text-green-400 transition-colors">Regulamin</Link>
            <Link href="/polityka-prywatnosci/" className="hover:text-green-400 transition-colors">Polityka prywatności</Link>
            <Link href="/cookies/" className="hover:text-green-400 transition-colors">Cookies</Link>
            <Link href="/api-docs/" className="hover:text-green-400 transition-colors">API – dokumentacja</Link>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <a href="https://benzinmapa.cz" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" hrefLang="cs" title="Ceny paliv v ČR (Czechy)">
              🇨🇿 BenzinMapa.cz – ceny paliw w Czechach
            </a>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4 text-center md:text-left">
          Ceny paliw są orientacyjne i aktualizowane 3× dziennie z polskich źródeł danych oraz OpenStreetMap.
        </p>
      </div>
    </footer>
  );
}
