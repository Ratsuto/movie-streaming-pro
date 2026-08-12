import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthShell } from '@/components/auth-shell';
import { RegisterForm } from '@/components/register-form';
import { getCurrentUser } from '@/lib/auth/session';
import { safeRedirectPath } from '@/lib/auth/validation';

export const metadata: Metadata = {
    title: 'Create account — Movie Gather',
    description:
        'Create a Movie Gather account to build your list and sync your progress.',
};

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string | string[] }>;
}) {
    const { from } = await searchParams;
    const destination = safeRedirectPath(
        Array.isArray(from) ? from[0] : from,
        ''
    );

    if (await getCurrentUser()) {
        redirect(destination || '/home');
    }

    return (
        <AuthShell
            hue={175}
            title="Create your account"
            description="Build your list, sync your progress, and start watching in a minute."
            footer={
                <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        href={
                            destination
                                ? `/login?from=${encodeURIComponent(destination)}`
                                : '/login'
                        }
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            }
        >
            <RegisterForm from={destination} />
        </AuthShell>
    );
}
