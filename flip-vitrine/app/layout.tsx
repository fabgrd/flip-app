import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import StyledComponentsRegistry from './lib/registry';
import SiteNav from './components/SiteNav';
import SiteFooter from './components/SiteFooter';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Fl!p — Jeux de soirée',
    template: '%s — Fl!p',
  },
  description: 'Les jeux de soirée. Réinventés.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <SiteNav />
          <main>{children}</main>
          <SiteFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
