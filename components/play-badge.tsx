import { PlayIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const sizes = {
    sm: 'size-9 [&_svg]:size-3.5',
    md: 'size-12 [&_svg]:size-5',
    lg: 'size-16 [&_svg]:size-7 sm:size-24 sm:[&_svg]:size-10 lg:size-28 lg:[&_svg]:size-12',
} as const;

type PlayBadgeProps = {
    size?: keyof typeof sizes;
    className?: string;
};

/**
 * The translucent disc with a play glyph that sits over artwork. Purely
 * decorative — the surrounding link or button owns the interaction.
 */
export function PlayBadge({ size = 'md', className }: PlayBadgeProps) {
    return (
        <span
            aria-hidden
            className={cn(
                'grid shrink-0 place-items-center rounded-full backdrop-blur-[2px] transition-colors',
                'bg-primary/15 ring-primary/30 text-primary ring-1',
                sizes[size],
                className
            )}
        >
            <PlayIcon strokeWidth={1.25} className="translate-x-[0.05em]" />
        </span>
    );
}
