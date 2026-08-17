import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthShell } from '@/components/auth-shell';
import { LoginForm } from '@/components/login-form';
import { getCurrentUser } from '@/lib/auth/session';
import { safeRedirectPath } from '@/lib/auth/validation';

export const metadata: Metadata = {
    title: 'Sign in — Movie Gather',
    description: 'Sign in to Movie Gather to pick up where you left off.',
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string | string[] }>;
}) {
    const { from } = await searchParams;
    const destination = safeRedirectPath(
        Array.isArray(from) ? from[0] : from,
        ''
    );

    // `proxy.ts` bounces signed-in visitors already; this covers the cases it
    // deliberately skips, such as prefetches and direct data requests.
    if (await getCurrentUser()) {
        redirect(destination || '/home');
    }

    return (
        <AuthShell
            hue={255}
            title="Welcome back"
            description="Sign in to keep watching across all your devices."
            footer={
                <p className="text-muted-foreground">
                    New to Movie Gather?{' '}
                    <Link
                        href={
                            destination
                                ? `/register?from=${encodeURIComponent(destination)}`
                                : '/register'
                        }
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            }
        >
            <LoginForm from={destination} />
        </AuthShell>
    );
}
