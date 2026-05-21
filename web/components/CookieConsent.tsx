'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';

const CONSENT_KEY = 'bm_cookie_consent_v1';

type ConsentChoice = 'all' | 'analytics' | 'necessary';
type ConsentState = 'granted' | 'denied';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function updateGtagConsent(analytics: ConsentState, ads: ConsentState) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag ?? function (...args: unknown[]) { window.dataLayer!.push(args); };
  gtag('consent', 'update', {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: analytics,
  });
}

function applyChoice(choice: ConsentChoice) {
  if (choice === 'all') updateGtagConsent('granted', 'granted');
  else if (choice === 'analytics') updateGtagConsent('granted', 'denied');
  else updateGtagConsent('denied', 'denied');
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;
    if (!saved) {
      setOpen(true);
      return;
    }
    applyChoice(saved);
  }, []);

  const save = (choice: ConsentChoice) => {
    localStorage.setItem(CONSENT_KEY, choice);
    applyChoice(choice);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Zgoda na pliki cookies"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[2000] border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-2xl dark:border-gray-700 dark:bg-gray-900/95"
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Cookie size={18} className="text-green-600" />
              <p className="font-bold text-gray-900 dark:text-white">
                Ta strona używa plików cookies
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Używamy ciasteczek aby zapewnić poprawne działanie strony, mierzyć ruch (Google Analytics)
              i wyświetlać reklamy (Google AdSense). Możesz zaakceptować wszystkie, tylko analityczne,
              lub odrzucić niepotrzebne.{' '}
              <Link href="/cookies/" className="underline text-green-700 dark:text-green-400 hover:text-green-800">
                Więcej informacji
              </Link>{' '}lub{' '}
              <button
                type="button"
                onClick={() => setShowDetails(s => !s)}
                className="underline text-green-700 dark:text-green-400 hover:text-green-800"
              >
                {showDetails ? 'ukryj szczegóły' : 'pokaż szczegóły'}
              </button>.
            </p>

            {showDetails && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="font-bold text-green-700 dark:text-green-300 mb-1">✓ Niezbędne</div>
                  <p className="text-gray-600 dark:text-gray-400">Bezpieczeństwo, zapamiętanie wyboru zgody. Zawsze aktywne.</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="font-bold text-blue-700 dark:text-blue-300 mb-1">📊 Analityczne</div>
                  <p className="text-gray-600 dark:text-gray-400">Google Analytics 4 — anonimowy ruch, najpopularniejsze strony.</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                  <div className="font-bold text-purple-700 dark:text-purple-300 mb-1">🎯 Marketingowe</div>
                  <p className="text-gray-600 dark:text-gray-400">Google AdSense — spersonalizowane reklamy. Możesz odrzucić.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap md:w-auto md:min-w-[200px]">
            <button
              type="button"
              onClick={() => save('all')}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors order-1 md:order-1"
            >
              Akceptuj wszystkie
            </button>
            <button
              type="button"
              onClick={() => save('analytics')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors order-2 md:order-2"
            >
              Tylko analityczne
            </button>
            <button
              type="button"
              onClick={() => save('necessary')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors order-3 md:order-3"
            >
              Odrzuć niepotrzebne
            </button>
          </div>

          <button
            type="button"
            onClick={() => save('necessary')}
            aria-label="Zamknij baner"
            className="absolute top-2 right-2 md:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
