import Link from 'next/link';
import { Fuel, Map, TrendingDown, BarChart2, Calculator, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
              <Fuel size={16} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-gray-900 dark:text-white text-lg tracking-tight">BenzynaMAPA</span>
              <span className="text-green-600 text-[10px] font-semibold tracking-widest uppercase">.pl</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Mapa', icon: Map },
              { href: '/najtansze-benzyna/', label: 'Benzyna 95', icon: TrendingDown },
              { href: '/najtansze-diesel/', label: 'Diesel', icon: TrendingDown },
              { href: '/najtansze-lpg/', label: 'LPG', icon: TrendingDown },
              { href: '/marka/', label: 'Sieci stacji', icon: BarChart2 },
              { href: '/historia-cen/', label: 'Historia cen', icon: BarChart2 },
              { href: '/kalkulator/', label: 'Kalkulator', icon: Calculator },
              { href: '/aktualnosci/', label: 'Aktualności', icon: BookOpen },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 dark:hover:text-green-400 transition-all"
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <Link href="/najtansze-diesel/" className="text-xs text-green-700 font-semibold bg-green-50 px-2 py-1 rounded-lg">
              Diesel
            </Link>
            <Link href="/najtansze-benzyna/" className="text-xs text-green-700 font-semibold bg-green-50 px-2 py-1 rounded-lg">
              Benzyna
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
