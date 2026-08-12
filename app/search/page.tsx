import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';

import { MediaGrid } from '@/components/media-grid';
import { MediaRow } from '@/components/media-row';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { catalog, genresOf, GENRE_LABELS, search, trending } from '@/lib/media';

export const metadata: Metadata = {
    title: 'Search — Movie Gather',
    description: 'Search every movie and series on Movie Gather.',
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string | string[] }>;
}) {
    const { q } = await searchParams;
    const query = (Array.isArray(q) ? q[0] : (q ?? '')).trim();
    const results = search(query);

    return (
        <>
            <div aria-hidden className="h-20" />

            <main className="px-5 pb-24 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <h1 className="font-heading text-3xl leading-tight font-light tracking-tight text-white sm:text-4xl">
                        Search
                    </h1>

                    {/* A plain GET form: the query lives in the URL, results
                        render on the server, and it works without JavaScript. */}
                    <form
                        role="search"
                        action="/search"
                        className="mt-5 max-w-xl"
                    >
                        <InputGroup className="h-12 border-white/10 bg-white/5">
                            <InputGroupInput
                                type="search"
                                name="q"
                                defaultValue={query}
                                aria-label="Search movies and series"
                                placeholder="Search titles and categories"
                                className="h-12 text-base"
                            />
                            <InputGroupAddon align="inline-end">
                                <SearchIcon aria-hidden />
                            </InputGroupAddon>
                        </InputGroup>
                    </form>

                    {query === '' ? (
                        <div className="mt-10 space-y-12">
                            <section aria-labelledby="browse-heading">
                                <h2
                                    id="browse-heading"
                                    className="text-muted-foreground text-[11px] font-medium tracking-[0.22em] uppercase"
                                >
                                    Browse by category
                                </h2>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {genresOf(catalog).map(
                                        ({ genre, count }) => (
                                            <Link
                                                key={genre}
                                                href={`/search?q=${GENRE_LABELS[genre]}`}
                                                className="focus-visible:ring-ring/40 text-muted-foreground inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm transition-colors outline-none hover:bg-white/10 hover:text-white focus-visible:ring-3"
                                            >
                                                {GENRE_LABELS[genre]}
                                                <span className="text-xs text-white/35 tabular-nums">
                                                    {count}
                                                </span>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </section>

                            <MediaRow title="Trending now" items={trending} />
                        </div>
                    ) : (
                        <div className="mt-8">
                            <p className="text-muted-foreground text-sm">
                                {results.length}{' '}
                                {results.length === 1 ? 'result' : 'results'}{' '}
                                for{' '}
                                <span className="text-white">
                                    &ldquo;{query}&rdquo;
                                </span>
                            </p>

                            <div className="mt-6">
                                <MediaGrid
                                    items={results}
                                    showKind
                                    emptyDescription={
                                        <>
                                            Nothing matches{' '}
                                            <span className="text-foreground">
                                                &ldquo;{query}&rdquo;
                                            </span>
                                            . Try a shorter phrase, or browse a
                                            category instead.
                                        </>
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
