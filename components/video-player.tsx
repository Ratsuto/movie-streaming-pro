'use client';

import { useEffect, useRef, useState } from 'react';
import {
    MaximizeIcon,
    PauseIcon,
    PlayIcon,
    RotateCcwIcon,
    RotateCwIcon,
    SettingsIcon,
    SubtitlesIcon,
    Volume2Icon,
    VolumeXIcon,
} from 'lucide-react';

import { Artwork } from '@/components/artwork';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type VideoPlayerProps = {
    title: string;
    /** Line above the title — the year, or "S1 E4 · Cold Open". */
    label: string;
    hue: number;
    durationMinutes: number;
    /** 0–1 of the way in to start, for resuming a part-watched title. */
    startAt?: number;
};

function formatTime(totalSeconds: number): string {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = seconds % 60;
    const padded = `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;

    return hours > 0 ? `${hours}:${padded}` : padded;
}

function first(value: number | readonly number[]): number {
    return Array.isArray(value) ? (value[0] ?? 0) : (value as number);
}

/**
 * Playback is simulated — there is no media file in the repo. To play real
 * video, drop a `<video ref={videoRef} src={…} />` in place of `<Artwork />`
 * and point these handlers at it: `time` ↔ `currentTime`, `playing` ↔
 * `play()`/`pause()`, `volume` ↔ `volume`. The control bar needs no changes.
 */
export function VideoPlayer({
    title,
    label,
    hue,
    durationMinutes,
    startAt = 0,
}: VideoPlayerProps) {
    const duration = durationMinutes * 60;
    const stageRef = useRef<HTMLDivElement>(null);

    const [time, setTime] = useState(Math.round(duration * startAt));
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(70);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        if (!playing) return;

        const timer = setInterval(() => {
            setTime((current) => {
                if (current >= duration) {
                    setPlaying(false);
                    return duration;
                }
                return current + 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [playing, duration]);

    const seek = (delta: number) =>
        setTime((current) => Math.min(duration, Math.max(0, current + delta)));

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            void document.exitFullscreen();
        } else {
            void stageRef.current?.requestFullscreen();
        }
    };

    const percent = duration === 0 ? 0 : (time / duration) * 100;

    return (
        <div
            ref={stageRef}
            className="group/player bg-background relative isolate aspect-video w-full overflow-hidden rounded-3xl ring-1 ring-white/10"
        >
            <Artwork hue={hue} kind="backdrop" className="absolute inset-0" />
            <div className="absolute inset-0 bg-black/35" />

            {/* Title, top-left */}
            <div
                className={cn(
                    'absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-5 transition-opacity duration-300 lg:p-7',
                    playing && 'opacity-0 group-hover/player:opacity-100'
                )}
            >
                <p className="text-xs tracking-[0.18em] text-white/70 uppercase">
                    {label}
                </p>
                <p className="font-heading mt-1 text-lg font-medium text-white lg:text-2xl">
                    {title}
                </p>
            </div>

            {/* Centre play control */}
            <button
                type="button"
                onClick={() => setPlaying((current) => !current)}
                aria-label={playing ? 'Pause' : 'Play'}
                className="focus-visible:ring-ring/40 absolute inset-0 grid place-items-center outline-none focus-visible:ring-3 focus-visible:ring-inset"
            >
                <span
                    className={cn(
                        'bg-primary/20 ring-primary/30 text-primary grid size-16 place-items-center rounded-full ring-1 backdrop-blur-[2px] transition-all duration-300 lg:size-24',
                        playing
                            ? 'scale-90 opacity-0 group-hover/player:scale-100 group-hover/player:opacity-100'
                            : 'opacity-100'
                    )}
                >
                    {playing ? (
                        <PauseIcon
                            strokeWidth={1.25}
                            className="size-7 lg:size-10"
                        />
                    ) : (
                        <PlayIcon
                            strokeWidth={1.25}
                            className="size-7 translate-x-[0.05em] lg:size-10"
                        />
                    )}
                </span>
            </button>

            {/* Control bar */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pt-16 pb-4 lg:px-7 lg:pb-6">
                <Slider
                    value={[time]}
                    min={0}
                    max={duration}
                    step={1}
                    onValueChange={(value) => setTime(first(value))}
                    aria-label="Seek"
                    className={cn(
                        '[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-white/25',
                        '[&_[data-slot=slider-thumb]]:size-3.5 [&_[data-slot=slider-thumb]]:w-3.5'
                    )}
                />

                <div className="mt-3 flex items-center gap-1 text-white lg:gap-2">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setPlaying((current) => !current)}
                        className="rounded-full text-white hover:bg-white/15"
                    >
                        {playing ? <PauseIcon /> : <PlayIcon />}
                        <span className="sr-only">
                            {playing ? 'Pause' : 'Play'}
                        </span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => seek(-10)}
                        className="rounded-full text-white hover:bg-white/15"
                    >
                        <RotateCcwIcon />
                        <span className="sr-only">Back 10 seconds</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => seek(10)}
                        className="rounded-full text-white hover:bg-white/15"
                    >
                        <RotateCwIcon />
                        <span className="sr-only">Forward 10 seconds</span>
                    </Button>

                    <p className="ml-1 text-xs text-white/80 tabular-nums">
                        {formatTime(time)}
                        <span className="text-white/40">
                            {' / '}
                            {formatTime(duration)}
                        </span>
                    </p>

                    <div className="ml-auto flex items-center gap-1 lg:gap-2">
                        <div className="hidden items-center gap-2 sm:flex">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setMuted((current) => !current)}
                                className="rounded-full text-white hover:bg-white/15"
                            >
                                {muted || volume === 0 ? (
                                    <VolumeXIcon />
                                ) : (
                                    <Volume2Icon />
                                )}
                                <span className="sr-only">
                                    {muted ? 'Unmute' : 'Mute'}
                                </span>
                            </Button>
                            {/* Sized by the wrapper: the Slider's own
                                `data-horizontal:w-full` outranks a `w-*` class
                                passed to it, which collapses it to 0 in a flex
                                row. */}
                            <div className="w-20">
                                <Slider
                                    value={[muted ? 0 : volume]}
                                    min={0}
                                    max={100}
                                    onValueChange={(value) => {
                                        setVolume(first(value));
                                        setMuted(false);
                                    }}
                                    aria-label="Volume"
                                    className={cn(
                                        '[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-white/25',
                                        '[&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:w-3'
                                    )}
                                />
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full text-white hover:bg-white/15"
                        >
                            <SubtitlesIcon />
                            <span className="sr-only">Subtitles</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full text-white hover:bg-white/15"
                        >
                            <SettingsIcon />
                            <span className="sr-only">Quality settings</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleFullscreen}
                            className="rounded-full text-white hover:bg-white/15"
                        >
                            <MaximizeIcon />
                            <span className="sr-only">Fullscreen</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Thin progress line, visible once the controls fade */}
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 bg-white/15"
            >
                <div
                    className="bg-primary h-full transition-[width] duration-1000 ease-linear"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
