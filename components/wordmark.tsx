import Link from 'next/link';

import { cn } from '@/lib/utils';

/**
 * The Movie Gather logotype. Shared by the site header and the auth pages so
 * the "O" ring and letter-spacing only have to be right in one place.
 */
export function Wordmark({ className }: { className?: string }) {
    return (
        <Link
            href="/home"
            className={cn('group/logo block shrink-0 leading-none', className)}
        >
            <span className="font-heading flex items-center text-base font-medium tracking-[0.28em] text-white uppercase">
                M
                <span className="border-primary/70 relative mx-[0.1em] inline-grid size-[0.7em] place-items-center rounded-full border">
                    <span className="bg-primary size-[0.24em] rounded-full" />
                </span>
                VIE
            </span>
            <span className="mt-1.5 block text-[9px] tracking-[0.52em] text-white/45 uppercase">
                Gather
            </span>
        </Link>
    );
}
