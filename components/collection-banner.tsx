import { Artwork } from '@/components/artwork';

type CollectionBannerProps = {
    eyebrow: string;
    title: string;
    description: string;
    /** Short facts rendered under the description, e.g. "32 titles". */
    stats: string[];
    /** Base hue for the banner artwork. */
    hue: number;
};

export function CollectionBanner({
    eyebrow,
    title,
    description,
    stats,
    hue,
}: CollectionBannerProps) {
    return (
        <section className="relative isolate">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <Artwork hue={hue} kind="backdrop" className="size-full" />
                <div className="from-background/95 via-background/60 absolute inset-0 bg-gradient-to-r to-transparent" />
                <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
            </div>

            {/* Reserves the row the absolutely positioned header sits in. */}
            <div aria-hidden className="h-20" />

            <div className="max-w-2xl px-5 pt-10 pb-12 lg:px-10 lg:pt-14 lg:pb-16">
                <p className="text-primary text-[11px] font-medium tracking-[0.22em] uppercase">
                    {eyebrow}
                </p>
                <h1 className="font-heading mt-3 text-4xl leading-[1.05] font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {title}
                </h1>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
                    {description}
                </p>

                <ul className="text-muted-foreground mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {stats.map((stat, index) => (
                        <li key={stat} className="flex items-center gap-3">
                            {index > 0 ? (
                                <span
                                    aria-hidden
                                    className="size-1 rounded-full bg-white/30"
                                />
                            ) : null}
                            {stat}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
