import { SearchXIcon } from 'lucide-react';

import { MediaCard } from '@/components/media-card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import type { Media } from '@/lib/media';

type MediaGridProps = {
    items: Media[];
    showKind?: boolean;
    /** Named in the empty state so the dead end explains itself. */
    emptyLabel: string;
};

export function MediaGrid({ items, showKind, emptyLabel }: MediaGridProps) {
    if (items.length === 0) {
        return (
            <Empty className="border border-dashed border-white/10 bg-white/2">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <SearchXIcon />
                    </EmptyMedia>
                    <EmptyTitle>Nothing here yet</EmptyTitle>
                    <EmptyDescription>
                        We have no {emptyLabel} in this category right now. Try
                        another one — the catalogue updates every week.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {items.map((item) => (
                <li key={item.id}>
                    <MediaCard item={item} showKind={showKind} />
                </li>
            ))}
        </ul>
    );
}
