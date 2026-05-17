const SENSITIVE_KEYS = [
    'password',
    'accessToken',
    'refreshToken',
    'token',
    'authorization',
    'cookie',
];

export function sanitizeBody<T>(body: T): T {
    if (
        body === null ||
        body === undefined ||
        typeof body !== 'object' ||
        Array.isArray(body)
    ) {
        return body;
    }

    const sanitized = { ...body } as Record<string, unknown>;

    for (const key of SENSITIVE_KEYS) {
        if (key in sanitized) {
            sanitized[key] = '****';
        }
    }

    return sanitized as T;
}