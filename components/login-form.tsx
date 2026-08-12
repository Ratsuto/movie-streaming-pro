'use client';

import { useActionState } from 'react';

import { login } from '@/app/actions/auth';
import {
    FormMessage,
    PasswordField,
    TextField,
} from '@/components/auth-fields';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';

export function LoginForm({ from }: { from?: string }) {
    const [state, action, pending] = useActionState(login, undefined);

    return (
        <form action={action} noValidate>
            {/* Where to land after signing in — the action rejects anything
                that isn't a same-site path. */}
            <input type="hidden" name="from" value={from ?? ''} />

            <FieldGroup className="gap-5">
                <FormMessage>{state?.message}</FormMessage>

                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    defaultValue={state?.values?.email}
                    errors={state?.errors?.email}
                />

                <PasswordField
                    name="password"
                    label="Password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    errors={state?.errors?.password}
                />

                <Button
                    type="submit"
                    size="lg"
                    disabled={pending}
                    className="h-11 w-full"
                >
                    {pending ? <Spinner /> : null}
                    {pending ? 'Signing in…' : 'Sign in'}
                </Button>
            </FieldGroup>
        </form>
    );
}
