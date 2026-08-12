import { CollectionBanner } from '@/components/collection-banner';
import { GenreFilter } from '@/components/genre-filter';
import { MediaGrid } from '@/components/media-grid';
import {
    collection,
    genresOf,
    GENRE_LABELS,
    type Genre,
    type MediaKind,
} from '@/lib/media';

type CollectionViewProps = {
    /** Route the category chips link back to, e.g. `/movies`. */
    basePath: string;
    eyebrow: string;
    title: string;
    description: string;
    hue: number;
    /** Omitted on `/new`, which mixes movies and series. */
    kind?: MediaKind;
    maxAgeDays?: number;
    activeGenre?: Genre;
    /** Plural noun for the empty state, e.g. "series". */
    emptyLabel: string;
};

export function CollectionView({
    basePath,
    eyebrow,
    title,
    description,
    hue,
    kind,
    maxAgeDays,
    activeGenre,
    emptyLabel,
}: CollectionViewProps) {
    const everything = collection({ kind, maxAgeDays });
    const items = collection({ kind, maxAgeDays, genre: activeGenre });
    const options = genresOf(everything);

    const stats = [
        `${everything.length} titles`,
        `${options.length} categories`,
        activeGenre
            ? `Showing ${items.length} in ${GENRE_LABELS[activeGenre]}`
            : 'Updated every week',
    ];

    return (
        <>
            <CollectionBanner
                eyebrow={eyebrow}
                title={title}
                description={description}
                stats={stats}
                hue={hue}
            />

            <main className="px-5 pb-24 lg:px-10">
                <GenreFilter
                    basePath={basePath}
                    options={options}
                    active={activeGenre}
                    totalCount={everything.length}
                />

                <div className="mt-8">
                    <MediaGrid
                        items={items}
                        showKind={kind === undefined}
                        emptyDescription={`We have no ${emptyLabel} in this category right now. Try another one — the catalogue updates every week.`}
                    />
                </div>
            </main>
        </>
    );
}
