import {
    FilmIcon,
    FlameIcon,
    SearchIcon,
    SparklesIcon,
    TvIcon,
    UserIcon,
} from 'lucide-react';

/**
 * The app's primary destinations. Shared by the desktop header and the mobile
 * tab bar so the two can't drift apart.
 */
export const navigation = [
    { label: 'Board', href: '/home', icon: FlameIcon },
    { label: 'New', href: '/new', icon: SparklesIcon },
    { label: 'Movies', href: '/movies', icon: FilmIcon },
    { label: 'Series', href: '/series', icon: TvIcon },
] as const;

/**
 * Tabs the mobile bar adds on top of the primary destinations. On desktop
 * these live in the header instead — the search field and the avatar — so they
 * are deliberately not part of `navigation`.
 */
export const mobileOnlyNavigation = [
    { label: 'Search', href: '/search', icon: SearchIcon },
    { label: 'Profile', href: '/profile', icon: UserIcon },
] as const;

export const mobileNavigation = [
    ...navigation,
    ...mobileOnlyNavigation,
] as const;

export type NavItem = (typeof mobileNavigation)[number];

/**
 * Routes that render without the site header and the mobile tab bar. The auth
 * pages bring their own frame and shouldn't offer a way to wander off
 * mid-signup, so the chrome checks this list and returns `null`.
 */
export const CHROMELESS_ROUTES = ['/login', '/register'] as const;

export function isChromelessRoute(pathname: string): boolean {
    return (CHROMELESS_ROUTES as readonly string[]).includes(pathname);
}
