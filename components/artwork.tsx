import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

type ArtworkProps = {
    /** Base hue (deg) the whole composition is built around. */
    hue: number;
    /**
     * `poster` is the portrait key-art used on cards, `backdrop` is the wide
     * still used behind the hero and on the "now watching" thumbnails.
     */
    kind?: 'poster' | 'backdrop';
    /** Rendered as the key-art title. Omit on thumbnails, where it won't fit. */
    title?: string;
    className?: string;
};

const grain =
    'repeating-linear-gradient(0deg, rgb(255 255 255 / 0.05) 0 1px, transparent 1px 3px)';

function posterLayers(hue: number): string {
    return [
        `radial-gradient(115% 85% at 78% 8%, oklch(0.86 0.15 ${hue - 25} / 0.6), transparent 62%)`,
        `radial-gradient(95% 70% at 8% 92%, oklch(0.5 0.14 ${hue + 75} / 0.55), transparent 60%)`,
        `linear-gradient(158deg, oklch(0.58 0.15 ${hue}) 0%, oklch(0.3 0.1 ${hue + 30}) 55%, oklch(0.16 0.05 ${hue + 55}) 100%)`,
    ].join(', ');
}

function backdropLayers(hue: number): string {
    return [
        `radial-gradient(70% 120% at 72% 18%, oklch(0.82 0.14 ${hue - 20} / 0.5), transparent 60%)`,
        `radial-gradient(80% 130% at 18% 95%, oklch(0.45 0.13 ${hue + 65} / 0.6), transparent 62%)`,
        `radial-gradient(45% 80% at 45% 40%, oklch(0.7 0.12 ${hue + 15} / 0.35), transparent 70%)`,
        `linear-gradient(105deg, oklch(0.24 0.07 ${hue + 40}) 0%, oklch(0.42 0.12 ${hue}) 45%, oklch(0.18 0.06 ${hue - 30}) 100%)`,
    ].join(', ');
}

export function Artwork({
    hue,
    kind = 'poster',
    title,
    className,
}: ArtworkProps) {
    const backgroundImage =
        kind === 'poster' ? posterLayers(hue) : backdropLayers(hue);

    return (
        <div
            aria-hidden
            className={cn(
                'relative isolate overflow-hidden bg-black',
                className
            )}
            style={{ backgroundImage } satisfies CSSProperties}
        >
            <div
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{ backgroundImage: grain }}
            />
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(to top, oklch(0.1 0.02 ${hue} / 0.9) 0%, oklch(0.1 0.02 ${hue} / 0.15) 45%, transparent 70%)`,
                }}
            />
            {title ? (
                <p className="font-heading absolute inset-x-0 bottom-0 line-clamp-3 px-3 pb-3 text-[0.9rem] leading-[1.05] font-bold tracking-tight text-white uppercase drop-shadow-[0_2px_8px_rgb(0_0_0/0.6)]">
                    {title}
                </p>
            ) : null}
        </div>
    );
}
