import { HeroShowcase } from '@/components/hero-showcase';
import { MediaRow } from '@/components/media-row';
import { heroSlides, newReleases, nowWatching, trending } from '@/lib/media';

export default function Home() {
    return (
        <>
            <HeroShowcase slides={heroSlides} nowWatching={nowWatching} />

            <main className="space-y-14 px-5 pt-4 pb-24 lg:px-10">
                <MediaRow title="New" items={newReleases} />
                <MediaRow title="Trending" items={trending} />
            </main>
        </>
    );
}
