import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/lib/auth/session';
import { initialsOf } from '@/lib/utils';

/**
 * The right-hand end of the site header: the signed-in user, or a way in.
 *
 * Split out of `SiteHeader` so the `cookies()` read stays in a leaf the layout
 * can wrap in `<Suspense>` — awaiting it in the layout itself would hold every
 * page's first byte behind the session lookup.
 */

export function SiteHeaderAccountFallback() {
    return (
        <div className="flex items-center gap-2.5">
            <Skeleton className="size-10 rounded-full" />
            <div className="hidden space-y-1.5 sm:block">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-14" />
            </div>
        </div>
    );
}

export async function SiteHeaderAccount() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    render={<Link href="/login" />}
                    variant="ghost"
                    className="text-white/70 hover:bg-white/10 hover:text-white"
                >
                    Sign in
                </Button>
                <Button render={<Link href="/register" />}>Join free</Button>
            </div>
        );
    }

    return (
        <Link
            href="/profile"
            className="focus-visible:ring-ring/40 flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-3"
        >
            <Avatar size="lg" className="ring-1 ring-white/15">
                <AvatarFallback className="bg-white/10 text-xs font-medium text-white">
                    {initialsOf(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-primary/90 text-xs">Premium</p>
            </div>
            <span className="sr-only">Your profile</span>
        </Link>
    );
}
