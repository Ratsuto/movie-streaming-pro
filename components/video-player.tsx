'use client';

import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from 'react';
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
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { VideoSource } from '@/lib/video';

type VideoPlayerProps = {
    title: string;
    /** Line above the title — the year, or "S1 E4 · Cold Open". */
    label: string;
    hue: number;
    /**
     * Catalogue runtime, used for the duration readout until the file reports
     * its own. The demo clips are far shorter than the runtimes in the
     * catalogue, so this visibly corrects itself once metadata lands.
     */
    durationMinutes: number;
    /** 0–1 of the way in to start, for resuming a part-watched title. */
    startAt?: number;
    /** Stream to load — see lib/video.ts. */
    source: VideoSource;
};

/** Starting volume, as a percentage. */
const INITIAL_VOLUME = 70;

/** How long the pointer must sit still before the chrome fades, in ms. */
const IDLE_DELAY = 3000;

function formatTime(totalSeconds: number): string {
    if (!Number.isFinite(totalSeconds)) return '00:00';

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

/** How far the browser has buffered continuously from the current position. */
function bufferedUpTo(video: HTMLVideoElement): number {
    const { buffered, currentTime } = video;

    for (let index = 0; index < buffered.length; index += 1) {
        if (
            buffered.start(index) <= currentTime &&
            currentTime <= buffered.end(index)
        ) {
            return buffered.end(index);
        }
    }

    return 0;
}

/**
 * The `<video>` element is the source of truth: every control writes to it, and
 * the React state below only mirrors what the element reports back through its
 * events. A `play()` the browser refuses, a seek that lands somewhere else, or
 * the volume changed from the OS all leave the UI honest that way.
 */
export function VideoPlayer({
    title,
    label,
    hue,
    durationMinutes,
    startAt = 0,
    source,
}: VideoPlayerProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [duration, setDuration] = useState(durationMinutes * 60);
    const [time, setTime] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(INITIAL_VOLUME);
    const [muted, setMuted] = useState(false);
    /** True while the seek bar is being dragged — `timeupdate` stands back. */
    const [scrubbing, setScrubbing] = useState(false);
    /** First frame decoded: the artwork poster can come down. */
    const [ready, setReady] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [failed, setFailed] = useState(false);
    /** Pointer has gone still — the chrome fades, but only during playback. */
    const [idle, setIdle] = useState(false);
    /**
     * A control is focused *and* the focus is keyboard-driven. Clicking play
     * also focuses it, so plain `:focus-within` would pin the chrome open for
     * the rest of the film; only a real tab stop should hold it there.
     */
    const [keyboardFocus, setKeyboardFocus] = useState(false);

    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // `volume` is a property, not an attribute, so it cannot be set in JSX.
        video.volume = INITIAL_VOLUME / 100;

        // Loading outruns hydration: with `preload="metadata"` the element can
        // already be past `loadedmetadata` by the time React attaches its
        // listeners, and media events never fire a second time. Replaying the
        // ones already missed keeps the handlers below the only place that
        // knows what to do with them.
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
            video.dispatchEvent(new Event('loadedmetadata'));
        }
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            video.dispatchEvent(new Event('loadeddata'));
        }
    }, []);

    // Timers do not survive the component; a fade scheduled against an
    // unmounted player would warn and leak.
    useEffect(() => {
        return () => {
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, []);

    /**
     * Brings the chrome back and restarts the countdown. Called on any sign of
     * life — pointer movement, a tap, playback starting.
     *
     * Pointer events bubble up from the control bar, so the event's target is
     * all it takes to tell "moving across the video" from "resting on the
     * controls": the latter means aiming at a button, and nothing should fade
     * out from under the pointer while it does.
     */
    const wake = (event?: ReactPointerEvent<HTMLDivElement>) => {
        setIdle(false);

        if (idleTimer.current) clearTimeout(idleTimer.current);
        if (
            (event?.target as HTMLElement | undefined)?.closest?.(
                '[data-player-controls]'
            )
        ) {
            return;
        }

        idleTimer.current = setTimeout(() => setIdle(true), IDLE_DELAY);
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        // A finished video restarts itself on play(), so "ended" needs no
        // special case here.
        if (video.paused) void video.play().catch(() => undefined);
        else video.pause();
    };

    const seekBy = (delta: number) => {
        const video = videoRef.current;
        if (!video) return;

        const limit = Number.isFinite(video.duration) ? video.duration : 0;
        video.currentTime = Math.min(
            limit,
            Math.max(0, video.currentTime + delta)
        );
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (video) video.muted = !video.muted;
    };

    const changeVolume = (next: number) => {
        const video = videoRef.current;
        if (!video) return;

        video.volume = next / 100;
        // Dragging the slider off zero is the clearest possible unmute.
        video.muted = next === 0;
    };

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            void document.exitFullscreen();
        } else {
            void stageRef.current?.requestFullscreen();
        }
    };

    /**
     * Player-wide shortcuts. In fullscreen the keys land on the stage, outside
     * it on the centre play button — both bubble to here. The control bar is
     * excluded so its sliders keep their own arrow-key handling.
     */
    const onStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest('[data-player-controls]')) {
            return;
        }

        switch (event.key) {
            case ' ':
            case 'k':
                // Also stops Space activating the focused centre button, which
                // would otherwise toggle playback a second time on keyup.
                event.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                seekBy(-10);
                break;
            case 'ArrowRight':
                event.preventDefault();
                seekBy(10);
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'm':
                toggleMute();
                break;
            default:
        }
    };

    // Zero-length sliders confuse the thumb maths before metadata arrives.
    const seekMax = Math.max(duration, 1);
    const percent = (time / seekMax) * 100;
    const bufferedPercent = Math.min(100, (buffered / seekMax) * 100);

    /**
     * Title, centre control and control bar move as one. A paused player always
     * shows them — there is nothing to watch underneath.
     */
    const chromeHidden = playing && idle && !keyboardFocus;

    return (
        <div
            ref={stageRef}
            tabIndex={-1}
            onKeyDown={onStageKeyDown}
            onPointerMove={wake}
            onPointerDown={wake}
            onPointerLeave={() => {
                // Mid-drag the pointer routinely leaves the stage; pulling the
                // seek bar out from under it would be hostile.
                if (!scrubbing) setIdle(true);
            }}
            onFocus={(event) => {
                if (event.target.matches(':focus-visible')) {
                    setKeyboardFocus(true);
                }
            }}
            onBlur={(event) => {
                // Fires for moves *within* the player too, which should not
                // count as leaving it.
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setKeyboardFocus(false);
                }
            }}
            className={cn(
                'group/player bg-background relative isolate aspect-video w-full overflow-hidden rounded-3xl ring-1 ring-white/10 outline-none',
                chromeHidden && 'cursor-none'
            )}
        >
            <video
                ref={videoRef}
                preload="metadata"
                playsInline
                className="absolute inset-0 size-full bg-black object-contain"
                onLoadedMetadata={(event) => {
                    const video = event.currentTarget;
                    if (!Number.isFinite(video.duration)) return;

                    setDuration(video.duration);
                    // Only from a standing start, so replaying this event
                    // never yanks playback back to the resume point.
                    if (startAt > 0 && video.currentTime === 0) {
                        video.currentTime = video.duration * startAt;
                    }
                    setTime(video.currentTime);
                }}
                onLoadedData={() => setReady(true)}
                onTimeUpdate={(event) => {
                    const video = event.currentTarget;
                    if (!scrubbing) setTime(video.currentTime);
                    setBuffered(bufferedUpTo(video));
                }}
                onProgress={(event) =>
                    setBuffered(bufferedUpTo(event.currentTarget))
                }
                onSeeked={(event) => setTime(event.currentTarget.currentTime)}
                onPlay={() => {
                    setPlaying(true);
                    // Starts the countdown even if the pointer never moves
                    // again, e.g. playback begun from the keyboard.
                    wake();
                }}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onWaiting={() => setWaiting(true)}
                onCanPlay={() => setWaiting(false)}
                onPlaying={() => {
                    setWaiting(false);
                    setReady(true);
                }}
                onVolumeChange={(event) => {
                    const video = event.currentTarget;
                    setVolume(Math.round(video.volume * 100));
                    setMuted(video.muted);
                }}
                onError={() => setFailed(true)}
            >
                <source
                    src={source.src}
                    type={source.type}
                    // The media element does not re-fire `error` once every
                    // candidate source has failed, so catch it here too.
                    onError={() => setFailed(true)}
                />
            </video>

            {/* Key art stands in until the first frame is decoded. */}
            <Artwork
                hue={hue}
                kind="backdrop"
                className={cn(
                    'pointer-events-none absolute inset-0 transition-opacity duration-500',
                    ready ? 'opacity-0' : 'opacity-100'
                )}
            />
            {/* Dims the frame behind the idle controls, lifts during playback. */}
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute inset-0 bg-black/35 transition-opacity duration-300',
                    playing && 'opacity-0'
                )}
            />

            {/* Title, top-left */}
            <div
                className={cn(
                    'pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-5 transition-opacity duration-300 lg:p-7',
                    chromeHidden && 'opacity-0'
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
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
                className="focus-visible:ring-ring/40 absolute inset-0 grid place-items-center outline-none focus-visible:ring-3 focus-visible:ring-inset"
            >
                <span
                    className={cn(
                        'bg-primary/20 ring-primary/30 text-primary grid size-16 place-items-center rounded-full ring-1 backdrop-blur-[2px] transition-all duration-300 lg:size-24',
                        playing && !waiting && chromeHidden
                            ? 'scale-90 opacity-0'
                            : 'scale-100 opacity-100'
                    )}
                >
                    {waiting ? (
                        <Spinner className="size-7 lg:size-10" />
                    ) : playing ? (
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

            {failed ? (
                <div className="absolute inset-0 grid place-items-center bg-black/75 px-6 text-center">
                    <div>
                        <p className="text-sm text-white">
                            This title can’t be played right now.
                        </p>
                        <p className="text-muted-foreground mt-1.5 text-xs break-all">
                            {decodeURIComponent(source.src)} failed to load.
                        </p>
                    </div>
                </div>
            ) : null}

            {/* Control bar */}
            <div
                data-player-controls
                className={cn(
                    'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pt-16 pb-4 transition-opacity duration-300 lg:px-7 lg:pb-6',
                    // Faded controls must not stay clickable, or the bottom of
                    // the frame becomes a strip of invisible buttons.
                    chromeHidden && 'pointer-events-none opacity-0'
                )}
            >
                <div className="relative">
                    {/* Rail and buffered-ahead marker, behind the slider's own
                        indicator — which is why the track itself is transparent. */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/25"
                    >
                        <div
                            className="h-full bg-white/40 transition-[width] duration-500 ease-out"
                            style={{ width: `${bufferedPercent}%` }}
                        />
                    </div>

                    <Slider
                        value={[Math.min(time, seekMax)]}
                        min={0}
                        max={seekMax}
                        step={1}
                        onValueChange={(value) => {
                            // Track the drag locally; committing every pixel
                            // would send the browser on a seek per frame.
                            setScrubbing(true);
                            setTime(first(value));
                        }}
                        onValueCommitted={(value) => {
                            const video = videoRef.current;
                            if (video) video.currentTime = first(value);
                            setScrubbing(false);
                        }}
                        aria-label="Seek"
                        className={cn(
                            '[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-transparent',
                            '[&_[data-slot=slider-thumb]]:size-3.5 [&_[data-slot=slider-thumb]]:w-3.5'
                        )}
                    />
                </div>

                <div className="mt-3 flex items-center gap-1 text-white lg:gap-2">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={togglePlay}
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
                        onClick={() => seekBy(-10)}
                        className="rounded-full text-white hover:bg-white/15"
                    >
                        <RotateCcwIcon />
                        <span className="sr-only">Back 10 seconds</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => seekBy(10)}
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
                                onClick={toggleMute}
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
                                    onValueChange={(value) =>
                                        changeVolume(first(value))
                                    }
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
                    className="bg-primary h-full transition-[width] duration-200 ease-linear"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
