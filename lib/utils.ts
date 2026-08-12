import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Avatar fallback text: up to two initials, or `?` for an unusable name. */
export function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).slice(0, 2);

    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || '?';
}
