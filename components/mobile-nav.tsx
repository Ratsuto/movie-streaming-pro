'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isChromelessRoute, mobileNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

/**
 * Bottom tab bar for phones and tablets, replacing the header's inline nav
 * below `lg`. Sits above the iOS home indicator via the safe-area inset, which
 * matters because the layout sets `viewportFit: 'cover'` for the installed app.
 *
 * The matching bottom padding that keeps page content clear of this bar lives
 * on the layout wrapper in app/layout.tsx.
 */
export function MobileNav() {
    const pathname = usePathname();

    if (isChromelessRoute(pathname)) {
        return null;
    }

    return (
        <nav
            aria-label="Primary"
            className={cn(
                'fixed inset-x-0 bottom-0 z-40 lg:hidden',
                'border-t border-white/10 bg-black/70 backdrop-blur-xl',
                'pb-[env(safe-area-inset-bottom)]'
            )}
        >
            <ul className="flex h-16 items-stretch">
                {mobileNavigation.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;

                    return (
                        <li key={href} className="flex-1">
                            <Link
                                href={href}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'focus-visible:ring-ring/40 relative flex h-full flex-col items-center justify-center gap-1 outline-none focus-visible:ring-3 focus-visible:ring-inset',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-white/55 active:text-white'
                                )}
                            >
                                {/* Sits on the border, marking the active tab. */}
                                <span
                                    aria-hidden
                                    className={cn(
                                        'bg-primary absolute top-0 h-0.5 w-8 rounded-full transition-opacity',
                                        isActive ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                <Icon
                                    aria-hidden
                                    className="size-5"
                                    strokeWidth={isActive ? 2.2 : 1.75}
                                />
                                {/* Six tabs leave ~62px each on a 375px phone,
                                    so the labels have to stay on one line. */}
                                <span className="text-[10px] leading-none font-medium whitespace-nowrap">
                                    {label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
