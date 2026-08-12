import Link from 'next/link';

import { GENRE_LABELS, type Genre } from '@/lib/media';
import { cn } from '@/lib/utils';

type GenreFilterProps = {
    /** Route the chips link back to, e.g. `/movies`. */
    basePath: string;
    options: { genre: Genre; count: number }[];
    /** `undefined` means "All". */
    active?: Genre;
    totalCount: number;
};

function Chip({
    href,
    label,
    count,
    isActive,
}: {
    href: string;
    label: string;
    count: number;
    isActive: boolean;
}) {
    return (
        <Link
            href={href}
            scroll={false}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
                'focus-visible:ring-ring/40 inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors outline-none focus-visible:ring-3',
                isActive
                    ? 'bg-primary text-primary-foreground border-transparent font-medium'
                    : 'text-muted-foreground border-white/10 bg-white/5 hover:bg-white/10 hover:text-white'
            )}
        >
            {label}
            <span
                className={cn(
                    'text-xs tabular-nums',
                    isActive ? 'text-primary-foreground/70' : 'text-white/35'
                )}
            >
                {count}
            </span>
        </Link>
    );
}

export function GenreFilter({
    basePath,
    options,
    active,
    totalCount,
}: GenreFilterProps) {
    return (
        <nav aria-label="Filter by category">
            <h2 className="text-muted-foreground text-[11px] font-medium tracking-[0.22em] uppercase">
                Categories
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <Chip
                    href={basePath}
                    label="All"
                    count={totalCount}
                    isActive={active === undefined}
                />
                {options.map(({ genre, count }) => (
                    <Chip
                        key={genre}
                        href={`${basePath}?genre=${genre}`}
                        label={GENRE_LABELS[genre]}
                        count={count}
                        isActive={active === genre}
                    />
                ))}
            </div>
        </nav>
    );
}
