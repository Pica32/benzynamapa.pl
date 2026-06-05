import type { Metadata } from 'next';
import ProfilClient from './ProfilClient';

export const metadata: Metadata = {
  title: 'Mój profil kierowcy – punkty, rangi i odznaki | BenzynaMAPA',
  description: 'Twój profil w społeczności BenzynaMAPA. Zgłaszaj ceny paliw, zdobywaj punkty, awansuj w rangach i odblokowuj odznaki. Pomagaj kierowcom w całej Polsce.',
  alternates: { canonical: 'https://benzynamapa.pl/profil/' },
  robots: { index: false, follow: true }, // osobní stránka — neindexovat
  openGraph: {
    title: 'Mój profil kierowcy | BenzynaMAPA',
    description: 'Zdobywaj punkty i odznaki za zgłaszanie cen paliw.',
    url: 'https://benzynamapa.pl/profil/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function ProfilPage() {
  return <ProfilClient />;
}
