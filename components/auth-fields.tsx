'use client';

import { useId, useState, type ComponentProps } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

/**
 * The inputs shared by the login and register forms. Both take the string
 * arrays the auth Server Actions put in `AuthFormState.errors`.
 */

type SharedProps = {
    label: string;
    /** Messages for this field, straight from the action's returned state. */
    errors?: string[];
};

const controlClassName =
    'h-11 border-white/10 bg-white/5 text-white placeholder:text-white/35';

function asFieldErrors(errors: string[] | undefined) {
    return errors?.map((message) => ({ message }));
}

export function TextField({
    label,
    errors,
    className,
    id,
    ...props
}: ComponentProps<'input'> & SharedProps) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const invalid = Boolean(errors?.length);

    return (
        <Field data-invalid={invalid}>
            <FieldLabel htmlFor={fieldId} className="text-white/80">
                {label}
            </FieldLabel>
            <Input
                id={fieldId}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${fieldId}-error` : undefined}
                className={cn(controlClassName, className)}
                {...props}
            />
            <FieldError
                id={`${fieldId}-error`}
                errors={asFieldErrors(errors)}
            />
        </Field>
    );
}

export function PasswordField({
    label,
    errors,
    className,
    id,
    ...props
}: ComponentProps<'input'> & SharedProps) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const invalid = Boolean(errors?.length);
    const [revealed, setRevealed] = useState(false);

    return (
        <Field data-invalid={invalid}>
            <FieldLabel htmlFor={fieldId} className="text-white/80">
                {label}
            </FieldLabel>
            <InputGroup className={cn(controlClassName, className)}>
                <InputGroupInput
                    id={fieldId}
                    type={revealed ? 'text' : 'password'}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? `${fieldId}-error` : undefined}
                    className="h-11"
                    {...props}
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        size="icon-sm"
                        aria-pressed={revealed}
                        // Toggling type keeps the value, so nothing is retyped.
                        onClick={() => setRevealed((value) => !value)}
                        className="rounded-full text-white/60 hover:text-white"
                    >
                        {revealed ? <EyeOffIcon /> : <EyeIcon />}
                        <span className="sr-only">
                            {revealed ? 'Hide password' : 'Show password'}
                        </span>
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
            <FieldError
                id={`${fieldId}-error`}
                errors={asFieldErrors(errors)}
            />
        </Field>
    );
}

/** Whole-form failure, e.g. credentials that didn't match any account. */
export function FormMessage({ children }: { children?: string }) {
    if (!children) {
        return null;
    }

    return (
        <p
            role="alert"
            className="border-destructive/25 bg-destructive/10 text-destructive rounded-2xl border px-4 py-3 text-sm"
        >
            {children}
        </p>
    );
}
