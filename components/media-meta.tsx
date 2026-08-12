import { MessageSquareIcon, StarIcon, UsersIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type MediaMetaProps = {
    rating: number;
    comments: number;
    viewers?: number;
    className?: string;
};

export function MediaMeta({
    rating,
    comments,
    viewers,
    className,
}: MediaMetaProps) {
    return (
        <div
            className={cn(
                'text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs',
                className
            )}
        >
            {viewers !== undefined ? (
                <span className="inline-flex items-center gap-1.5">
                    <UsersIcon className="size-3.5" aria-hidden />
                    <span className="sr-only">Watching now:</span>
                    {viewers}
                </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
                <StarIcon className="size-3.5" aria-hidden />
                {rating.toFixed(1)}
                <span className="sr-only">out of 10 on</span> iMDB
            </span>
            <span className="inline-flex items-center gap-1.5">
                <MessageSquareIcon className="size-3.5" aria-hidden />
                <span className="sr-only">Comments:</span>
                {comments}
            </span>
        </div>
    );
}
