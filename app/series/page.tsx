import type { Metadata } from 'next';

import { CollectionView } from '@/components/collection-view';
import { isGenre } from '@/lib/media';

export const metadata: Metadata = {
    title: 'Series — Movie Gather',
    description:
        'Every series on Movie Gather, from anime to slow-burn thrillers.',
};

export default async function SeriesPage({
    searchParams,
}: {
    searchParams: Promise<{ genre?: string | string[] }>;
}) {
    const { genre } = await searchParams;

    return (
        <CollectionView
            basePath="/series"
            eyebrow="Episodes & seasons"
            title="Series"
            description="Long-form stories to sink into — anime, slow-burn thrillers and the comfort shows you rewatch."
            hue={228}
            kind="series"
            activeGenre={isGenre(genre) ? genre : undefined}
            emptyLabel="series"
        />
    );
}
