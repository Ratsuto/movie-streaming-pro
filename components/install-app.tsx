'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { MonitorDownIcon, ShareIcon, SquarePlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone(): boolean {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        // iOS Safari predates the display-mode media query.
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
}

function isAppleTouchDevice(): boolean {
    const ua = navigator.userAgent;
    return (
        /iphone|ipad|ipod/i.test(ua) ||
        // iPadOS 13+ reports a desktop Safari UA.
        (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
    );
}

function subscribeDisplayMode(onChange: () => void) {
    const query = window.matchMedia('(display-mode: standalone)');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
}

/** The device never stops being an iPhone mid-session. */
function subscribeNothing() {
    return () => {};
}

/** Both checks touch `navigator`, so the server always answers "no". */
const notOnTheServer = () => false;

/**
 * Install control for the header.
 *
 * Chrome, Edge and Android fire `beforeinstallprompt`, so those get a real
 * one-click install. Safari never fires it and has no API to trigger the
 * sheet, so iPhones and iPads get the Share → Add to Home Screen walkthrough
 * instead. Any other browser (Firefox, desktop Safari) installs from its own
 * menu, so the button stays hidden rather than lying about what it does.
 */
export function InstallApp({ className }: { className?: string }) {
    const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showAppleGuide, setShowAppleGuide] = useState(false);
    // Installing from a tab leaves that tab in the browser, so display-mode
    // alone never flips — the `appinstalled` event is what hides the button.
    const [justInstalled, setJustInstalled] = useState(false);

    const standalone = useSyncExternalStore(
        subscribeDisplayMode,
        isStandalone,
        notOnTheServer
    );
    const apple = useSyncExternalStore(
        subscribeNothing,
        isAppleTouchDevice,
        notOnTheServer
    );

    useEffect(() => {
        const onBeforeInstallPrompt = (event: Event) => {
            // Keep the browser's own mini-infobar from firing so the header
            // button is the single entry point.
            event.preventDefault();
            setPrompt(event as BeforeInstallPromptEvent);
        };

        const onInstalled = () => {
            setJustInstalled(true);
            setPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.addEventListener('appinstalled', onInstalled);

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                onBeforeInstallPrompt
            );
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const install = async () => {
        if (!prompt) return;
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        // The event is single-use either way.
        setPrompt(null);
        if (outcome === 'accepted') setJustInstalled(true);
    };

    if (standalone || justInstalled) return null;
    if (!prompt && !apple) return null;

    return (
        <>
            <Button
                variant="outline"
                onClick={() =>
                    prompt ? void install() : setShowAppleGuide(true)
                }
                className={cn(
                    'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-full',
                    className
                )}
            >
                <MonitorDownIcon />
                <span className="hidden sm:inline">Install app</span>
                <span className="sr-only sm:hidden">Install app</span>
            </Button>

            <Dialog open={showAppleGuide} onOpenChange={setShowAppleGuide}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Add Movie Gather to your Home Screen
                        </DialogTitle>
                        <DialogDescription>
                            Safari installs web apps from the Share menu. It
                            takes two taps.
                        </DialogDescription>
                    </DialogHeader>

                    <ol className="text-muted-foreground space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <span className="bg-muted text-foreground grid size-7 shrink-0 place-items-center rounded-full text-xs font-medium">
                                1
                            </span>
                            <span className="pt-1">
                                Tap{' '}
                                <ShareIcon
                                    className="text-primary inline size-4 -translate-y-px"
                                    aria-hidden
                                />{' '}
                                <span className="text-foreground font-medium">
                                    Share
                                </span>{' '}
                                in the Safari toolbar.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-muted text-foreground grid size-7 shrink-0 place-items-center rounded-full text-xs font-medium">
                                2
                            </span>
                            <span className="pt-1">
                                Scroll down and choose{' '}
                                <SquarePlusIcon
                                    className="text-primary inline size-4 -translate-y-px"
                                    aria-hidden
                                />{' '}
                                <span className="text-foreground font-medium">
                                    Add to Home Screen
                                </span>
                                , then tap Add.
                            </span>
                        </li>
                    </ol>
                </DialogContent>
            </Dialog>
        </>
    );
}
