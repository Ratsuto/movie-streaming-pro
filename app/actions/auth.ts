'use server';

import { redirect } from 'next/navigation';

import { createSession, deleteSession } from '@/lib/auth/session';
import {
    createUser,
    findUserByEmail,
    verifyCredentials,
} from '@/lib/auth/users';
import {
    safeRedirectPath,
    validateLogin,
    validateRegister,
    type AuthFormState,
} from '@/lib/auth/validation';

const DEFAULT_DESTINATION = '/home';

export async function login(
    _prevState: AuthFormState | undefined,
    formData: FormData
): Promise<AuthFormState> {
    const result = validateLogin(formData);

    if (!result.ok) {
        return result.state;
    }

    const { email, password } = result.data;
    const user = await verifyCredentials(email, password);

    if (!user) {
        // One message for both a missing account and a wrong password, so the
        // form can't be used to find out which emails are registered.
        return {
            message: 'That email and password combination is incorrect.',
            values: { email },
        };
    }

    await createSession(user.id);

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

    if (await findUserByEmail(email)) {
        return {
            errors: { email: ['An account already uses that email address.'] },
            values: { name, email },
        };
    }

    const user = await createUser({ name, email, password });

    // Straight into the app rather than back to the login form — they just
    // proved who they are.
    await createSession(user.id);

    redirect(safeRedirectPath(formData.get('from'), DEFAULT_DESTINATION));
}

export async function logout(): Promise<void> {
    await deleteSession();

    redirect('/login');
}
