import type { Metadata } from 'next';

import { CollectionView } from '@/components/collection-view';
import { isGenre } from '@/lib/media';

export const metadata: Metadata = {
    title: 'Movies — Movie Gather',
    description:
        'The full film catalogue on Movie Gather, filterable by category.',
};

export default async function MoviesPage({
    searchParams,
}: {
    searchParams: Promise<{ genre?: string | string[] }>;
}) {
    const { genre } = await searchParams;

    return (
        <CollectionView
            basePath="/movies"
            eyebrow="Feature films"
            title="Movies"
            description="Blockbusters, festival darlings and quiet documentaries. Pick a category to narrow the shelf."
            hue={25}
            kind="movie"
            activeGenre={isGenre(genre) ? genre : undefined}
            emptyLabel="films"
        />
    );
}
