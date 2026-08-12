import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Outfit } from 'next/font/google';
import './globals.css';
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
    title: 'Movie Gather — Stream movies and series',
    description:
        'Watch new releases, follow what everyone is streaming right now, and pick up your series where you left off.',
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
                    route opens with a full-bleed image behind it. */}
                <div className="bg-background relative flex flex-1 flex-col">
                    <SiteHeader className="absolute inset-x-0 top-0 z-30" />
                    {children}
                </div>
            </body>
        </html>
    );
}
