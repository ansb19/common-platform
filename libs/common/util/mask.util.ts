/**
 * 사용자 로그인 ID 마스킹
 *
 * @example
 * maskString('testuser')
 * // test****
 *
 * @example
 * maskString('abcdefg', {
 *   visibleStart: 2,
 *   visibleEnd: 2,
 * })
 * // ab***fg
 */
export function maskString(
    str: string | null | undefined,
    options?: {
        visibleStart?: number;
        visibleEnd?: number;
        maskChar?: string;
    },
): string {
    if (!str) {
        return '';
    }

    const {
        visibleStart = 4,
        visibleEnd = 0,
        maskChar = '*',
    } = options ?? {};

    const normalizedVisibleStart = Math.max(0, visibleStart);
    const normalizedVisibleEnd = Math.max(0, visibleEnd);

    const length = str.length;

    // 노출 범위가 전체 길이 이상이면 원본 반환
    if (normalizedVisibleStart + normalizedVisibleEnd >= length) {
        return str;
    }

    const start = str.slice(0, normalizedVisibleStart);

    const end =
        normalizedVisibleEnd > 0
            ? str.slice(length - normalizedVisibleEnd)
            : '';

    const maskedLength =
        length - normalizedVisibleStart - normalizedVisibleEnd;

    const masked = maskChar.repeat(maskedLength);

    return `${start}${masked}${end}`;
}