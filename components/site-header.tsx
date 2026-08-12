'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BellIcon,
    ChevronDownIcon,
    MessageSquareIcon,
    SearchIcon,
} from 'lucide-react';

import { InstallApp } from '@/components/install-app';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { navigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

function Wordmark() {
    return (
        <Link href="/home" className="group/logo block shrink-0 leading-none">
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

export function SiteHeader({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <header
            className={cn(
                'flex h-20 items-center gap-4 px-5 lg:gap-8 lg:px-10',
                className
            )}
        >
            <Wordmark />

            {/* Below lg the bottom tab bar takes over, so only one primary
                navigation is ever on screen. */}
            <nav aria-label="Primary" className="hidden items-center lg:flex">
                {navigation.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={label}
                            href={href}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-[11px] font-medium tracking-[0.18em] uppercase transition-colors',
                                isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/55 hover:text-white'
                            )}
                        >
                            {/* Only the active pill carries its icon — the
                                inactive ones stay as plain text. */}
                            {isActive ? (
                                <Icon
                                    aria-hidden
                                    className="text-primary size-4"
                                />
                            ) : null}
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Submits to the same page the mobile Search tab opens. */}
            <form
                role="search"
                action="/search"
                className="mx-auto hidden w-full max-w-xs lg:block"
            >
                <InputGroup className="h-10 border-white/10 bg-white/8 backdrop-blur-sm">
                    <InputGroupInput
                        type="search"
                        name="q"
                        aria-label="Search movies and series"
                        placeholder="Search"
                        className="h-10"
                    />
                    <InputGroupAddon align="inline-end">
                        <SearchIcon aria-hidden />
                    </InputGroupAddon>
                </InputGroup>
            </form>

            <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:gap-2">
                <InstallApp className="mr-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <MessageSquareIcon />
                    <span className="sr-only">Messages</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <BellIcon />
                    <span className="bg-primary absolute top-2 right-2 size-1.5 rounded-full" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <div className="ml-1 flex items-center gap-2.5">
                    <Link
                        href="/profile"
                        className="focus-visible:ring-ring/40 flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-3"
                    >
                        <Avatar size="lg" className="ring-1 ring-white/15">
                            <AvatarFallback className="bg-white/10 text-xs font-medium text-white">
                                LP
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden leading-tight sm:block">
                            <p className="text-sm font-medium text-white">
                                Lee Phang
                            </p>
                            <p className="text-primary/90 text-xs">Premium</p>
                        </div>
                        <span className="sr-only">Your profile</span>
                    </Link>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        className="rounded-full border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                        <ChevronDownIcon />
                        <span className="sr-only">Account menu</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
