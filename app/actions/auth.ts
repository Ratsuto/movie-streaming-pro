'use server';

import { redirect } from 'next/navigation';

import { apiLogin, apiRegister, type ApiAuthResult } from '@/lib/auth/api';
import { createSession, deleteSession } from '@/lib/auth/session';
import {
    safeRedirectPath,
    validateLogin,
    validateRegister,
    type AuthFormState,
} from '@/lib/auth/validation';

const DEFAULT_DESTINATION = '/home';

/** Turns an API failure into the shape the forms render. */
function toFormState(
    result: Extract<ApiAuthResult, { ok: false }>,
    values: Record<string, string>
): AuthFormState {
    return {
        message: result.message,
        errors: result.fieldErrors,
        values,
    };
}

export async function login(
    _prevState: AuthFormState | undefined,
    formData: FormData
): Promise<AuthFormState> {
    // Checked here first so an obviously empty form never leaves the machine.
    const result = validateLogin(formData);

    if (!result.ok) {
        return result.state;
    }

    const { email, password } = result.data;
    const outcome = await apiLogin(email, password);

    if (!outcome.ok) {
        // The email is safe to echo back; the password never is.
        return toFormState(outcome, { email });
    }

    await createSession(outcome.session);

    redirect(safeRedirectPath(formData.get('from'), DEFAULT_DESTINATION));
}

export async function register(
    _prevState: AuthFormState | undefined,
    formData: FormData
): Promise<AuthFormState> {
    const result = validateRegister(formData);

    if (!result.ok) {
        return result.state;
    }

    const { name, email, password } = result.data;
    // The form calls it `name`; the API calls it `fullName`.
    const outcome = await apiRegister(name, email, password);

    if (!outcome.ok) {
        return toFormState(outcome, { name, email });
    }

    // Straight into the app rather than back to the login form — they just
    // proved who they are.
    await createSession(outcome.session);

    redirect(safeRedirectPath(formData.get('from'), DEFAULT_DESTINATION));
}

export async function logout(): Promise<void> {
    // Only the local cookie is cleared. The API has a /api/auth/logout
    // endpoint, but its contract has not been confirmed, so calling it is left
    // until the token it expects is known.
    await deleteSession();

    redirect('/login');
}
