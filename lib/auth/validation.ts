/**
 * Form validation for the auth pages.
 *
 * Hand-rolled rather than pulling in a schema library: it's two forms, and the
 * shape below is what `useActionState` hands back to them.
 */

export type AuthFormState = {
    /** Per-field messages, keyed by the input's `name`. */
    errors?: Record<string, string[]>;
    /** Whole-form failure, e.g. credentials that didn't match. */
    message?: string;
    /** Echoed back so a failed submit doesn't wipe what was typed. */
    values?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

function passwordProblems(password: string): string[] {
    const problems: string[] = [];

    if (password.length < MIN_PASSWORD_LENGTH) {
        problems.push(`Be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    }

    if (!/[a-zA-Z]/.test(password)) {
        problems.push('Contain at least one letter.');
    }

    if (!/[0-9]/.test(password)) {
        problems.push('Contain at least one number.');
    }

    return problems;
}

export type LoginFields = { email: string; password: string };

export function validateLogin(
    formData: FormData
): { ok: true; data: LoginFields } | { ok: false; state: AuthFormState } {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const errors: Record<string, string[]> = {};

    if (!email) {
        errors.email = ['Enter your email address.'];
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.email = ['Enter a valid email address.'];
    }

    if (!password) {
        errors.password = ['Enter your password.'];
    }

    // The email is safe to echo back; the password never is.
    return Object.keys(errors).length > 0
        ? { ok: false, state: { errors, values: { email } } }
        : { ok: true, data: { email, password } };
}

export type RegisterFields = LoginFields & { name: string };

export function validateRegister(
    formData: FormData
): { ok: true; data: RegisterFields } | { ok: false; state: AuthFormState } {
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirm = String(formData.get('confirmPassword') ?? '');
    const errors: Record<string, string[]> = {};

    if (name.length < 2) {
        errors.name = ['Name must be at least 2 characters long.'];
    }

    if (!EMAIL_PATTERN.test(email)) {
        errors.email = ['Enter a valid email address.'];
    }

    const problems = passwordProblems(password);

    if (problems.length > 0) {
        errors.password = problems;
    }

    if (confirm !== password) {
        errors.confirmPassword = ['Both passwords must match.'];
    }

    return Object.keys(errors).length > 0
        ? { ok: false, state: { errors, values: { name, email } } }
        : { ok: true, data: { name, email, password } };
}

/**
 * Keeps `?from=` from turning into an open redirect: only same-site paths get
 * through, and `//evil.com` is a protocol-relative URL, not a path.
 */
export function safeRedirectPath(
    value: FormDataEntryValue | string | null | undefined,
    fallback: string
): string {
    const path = typeof value === 'string' ? value : '';

    return path.startsWith('/') && !path.startsWith('//') ? path : fallback;
}
