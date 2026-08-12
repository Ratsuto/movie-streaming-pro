import {HeroShowcase} from '@/components/hero-showcase';
import {MediaRow} from '@/components/media-row';
import {heroSlides, newReleases, nowWatching, trending} from '@/lib/media';
import {redirect} from "next/navigation";

export default function MainPage() {
    return (
        redirect("/home") || "/home"
    );
}
