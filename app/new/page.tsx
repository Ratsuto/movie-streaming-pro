import type { Metadata } from 'next';

import { CollectionView } from '@/components/collection-view';
import { isGenre } from '@/lib/media';

export const metadata: Metadata = {
    title: 'New — Movie Gather',
    description:
        'Everything added to Movie Gather in the last two weeks, movies and series together.',
};

export default async function NewPage({
    searchParams,
}: {
    searchParams: Promise<{ genre?: string | string[] }>;
}) {
    const { genre } = await searchParams;

    return (
        <CollectionView
            basePath="/new"
            eyebrow="Just landed"
            title="New this fortnight"
            description="Everything that arrived in the last two weeks — films and series side by side, newest first."
            hue={152}
            maxAgeDays={14}
            activeGenre={isGenre(genre) ? genre : undefined}
            emptyLabel="new releases"
        />
    );
}
