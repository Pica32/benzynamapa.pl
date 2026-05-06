import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-4 text-xs border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4">
        <span>© {new Date().getFullYear()} BenzynaMAPA.pl</span>
        <span>Ceny paliw są orientacyjne i aktualizowane 3× dziennie.</span>
        <Link href="/polityka-prywatnosci/" className="hover:text-gray-200 transition-colors">
          Polityka prywatności
        </Link>
        <Link href="/kontakt/" className="hover:text-gray-200 transition-colors">
          Kontakt
        </Link>
        <a
          href="https://benzinmapa.cz"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-400 transition-colors"
          title="Ceny paliw w Czechach"
        >
          🇨🇿 BenzinMapa.cz
        </a>
      </div>
    </footer>
  );
}
