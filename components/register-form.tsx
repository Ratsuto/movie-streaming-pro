'use client';

import { useActionState } from 'react';

import { register } from '@/app/actions/auth';
import {
    FormMessage,
    PasswordField,
    TextField,
} from '@/components/auth-fields';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/validation';

export function RegisterForm({ from }: { from?: string }) {
    const [state, action, pending] = useActionState(register, undefined);

    return (
        <form action={action} noValidate>
            <input type="hidden" name="from" value={from ?? ''} />

            <FieldGroup className="gap-5">
                <FormMessage>{state?.message}</FormMessage>

                <TextField
                    name="name"
                    label="Name"
                    autoComplete="name"
                    placeholder="Your name"
                    defaultValue={state?.values?.name}
                    errors={state?.errors?.name}
                />

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
                    autoComplete="new-password"
                    placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    errors={state?.errors?.password}
                />

                <PasswordField
                    name="confirmPassword"
                    label="Confirm password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    errors={state?.errors?.confirmPassword}
                />

                <Button
                    type="submit"
                    size="lg"
                    disabled={pending}
                    className="h-11 w-full"
                >
                    {pending ? <Spinner /> : null}
                    {pending ? 'Creating account…' : 'Create account'}
                </Button>
            </FieldGroup>
        </form>
    );
}
