import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Roboto } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { theme } from '@/lib/theme';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Jobbi - Dein Weg zur Ausbildung',
  description:
    'Finde deine Ausbildung mit Jobbi. Die Plattform die Schulen mit Ausbildungsbetrieben verbindet — für Berufsorientierung, Praktika und den Übergang Schule-Beruf.',
  metadataBase: new URL('https://meinjobbi.de'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jobbi - Dein Weg zur Ausbildung',
    description:
      'Finde deine Ausbildung mit Jobbi. Die Plattform die Schulen mit Ausbildungsbetrieben verbindet.',
    url: 'https://meinjobbi.de',
    siteName: 'MeinJobbi',
    locale: 'de_DE',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MeinJobbi',
  url: 'https://meinjobbi.de',
  description:
    'Die Plattform die Schulen mit Ausbildungsbetrieben verbindet — für Berufsorientierung, Praktika und den Übergang Schule-Beruf.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Lanterstraße 9',
    addressLocality: 'Dinslaken',
    postalCode: '46539',
    addressCountry: 'DE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://meinjobbi.de/unternehmen',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={roboto.className}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
        <GoogleAnalytics gaId="G-SMYTYMQZDC" />
      </body>
    </html>
  );
}
