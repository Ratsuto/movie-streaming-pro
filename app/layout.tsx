import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Inter, Outfit } from 'next/font/google';
import './globals.css';
import { THEME_COLOR } from './manifest';
import { MobileNav } from '@/components/mobile-nav';
import { ServiceWorker } from '@/components/service-worker';
import { SiteHeader } from '@/components/site-header';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' });

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    applicationName: 'Movie Gather',
    title: 'Movie Gather — Stream movies and series',
    description:
        'Watch new releases, follow what everyone is streaming right now, and pick up your series where you left off.',
    manifest: '/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        title: 'Movie Gather',
        // Lets the dark page art run under the status bar on iOS.
        statusBarStyle: 'black-translucent',
    },
    icons: {
        icon: [
            { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    },
    formatDetection: { telephone: false },
    other: {
        // Next emits the standardised `mobile-web-app-capable`, which iOS only
        // honours from 17.4. Without the legacy name, older iPhones and iPads
        // add the icon to the Home Screen but launch it inside Safari's chrome
        // instead of as a standalone app.
        'apple-mobile-web-app-capable': 'yes',
    },
};

export const viewport: Viewport = {
    themeColor: THEME_COLOR,
    colorScheme: 'dark',
    width: 'device-width',
    initialScale: 1,
    // Draws into the notch/home-indicator area once installed.
    viewportFit: 'cover',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(
                'dark h-full scheme-dark',
                'antialiased',
                geistSans.variable,
                geistMono.variable,
                'font-sans',
                inter.variable,
                outfit.variable
            )}
        >
            <body className="flex min-h-full flex-col">
                {/* The header floats over each page's banner artwork, so every
                    route opens with a full-bleed image behind it. The bottom
                    padding clears the mobile tab bar, which is fixed. */}
                {/* Underscores become spaces: CSS calc() requires whitespace
                    around `+`, and without it the whole declaration is dropped. */}
                <div className="bg-background relative flex flex-1 flex-col pb-[calc(4rem_+_env(safe-area-inset-bottom))] lg:pb-0">
                    <SiteHeader className="absolute inset-x-0 top-0 z-30" />
                    {children}
                </div>
                <MobileNav />
                <ServiceWorker />
            </body>
        </html>
    );
}
