import { MediaCard } from '@/components/media-card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import type { Media } from '@/lib/media';

type MediaRowProps = {
    title: string;
    items: Media[];
};

export function MediaRow({ title, items }: MediaRowProps) {
    const headingId = `row-${title.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <Carousel
            aria-labelledby={headingId}
            opts={{
                align: 'start',
                slidesToScroll: 'auto',
                containScroll: 'trimSnaps',
            }}
            className="w-full"
        >
            <div className="mb-5 flex items-center justify-between gap-4">
                <h2
                    id={headingId}
                    className="font-heading text-2xl font-medium text-white"
                >
                    {title}
                </h2>
                <div className="flex items-center gap-2">
                    <CarouselPrevious className="static inset-auto size-10 translate-y-0 border-white/12 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
                    <CarouselNext className="static inset-auto size-10 translate-y-0 border-white/35 bg-white/5 text-white hover:bg-white/10" />
                </div>
            </div>

            <CarouselContent className="-ml-4">
                {items.map((item) => (
                    <CarouselItem
                        key={item.id}
                        className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[14.2857%]"
                    >
                        <MediaCard item={item} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
