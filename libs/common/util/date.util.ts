
/**
 *  유효한 날짜인지 확인하는 유틸리티 함수
 * @param value 확인할 값
 * @returns 유효한 날짜인지 여부
 */
export function isValidDate(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 *  값을 Date 객체로 변환하거나 null을 반환하는 유틸리티 함수
 * @param value 변환할 값
 * @returns Date 객체 또는 null
 */
export function toDateOrNull(value: unknown): Date | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const date = new Date(value as string | number | Date);

    return isValidDate(date) ? date : null;
}

/**
 *  날짜를 ISO 8601 형식으로 포맷하는 유틸리티 함수
 * @param value 변환할 값
 * @returns ISO 8601 형식의 문자열 또는 null
 */
export function formatDateTime(
    value: Date | string | number | null | undefined,
): string | null {
    const date = toDateOrNull(value);

    if (!date) {
        return null;
    }

    return date.toISOString();
}