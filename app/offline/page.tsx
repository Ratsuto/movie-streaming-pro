import type { Metadata } from 'next';
import Link from 'next/link';
import { WifiOffIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Offline — Movie Gather',
    description: 'You are offline.',
};

/**
 * Served by the service worker when a page is requested with no connection and
 * nothing cached for it.
 */
export default function OfflinePage() {
    return (
        <>
            <div aria-hidden className="h-20" />

            <main className="grid flex-1 place-items-center px-5 py-24 lg:px-10">
                <div className="max-w-md text-center">
                    <span className="bg-primary/10 ring-primary/25 text-primary mx-auto grid size-16 place-items-center rounded-full ring-1">
                        <WifiOffIcon className="size-7" aria-hidden />
                    </span>

                    <h1 className="font-heading mt-6 text-3xl font-light tracking-tight text-white">
                        You&apos;re offline
                    </h1>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                        Movie Gather needs a connection to load new titles.
                        Pages you have already visited stay available — try one
                        of those, or reconnect and reload.
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-2">
                        <Button
                            className="rounded-full"
                            render={<Link href="/home" />}
                        >
                            Back to the board
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                            render={<Link href="/movies" />}
                        >
                            Movies
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}
