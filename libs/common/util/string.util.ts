/**
 * 문자열이 비어있는지 확인하는 유틸리티 함수
 * @param value 확인할 값
 * @returns 값이 비어있는 문자열인지 여부
 */
export function isEmptyString(value: unknown): value is '' {
    return typeof value === 'string' && value.trim() === '';
}

/**
 *  문자열을 정규화하는 유틸리티 함수
 * @param value 정규화할 값
 * @returns 정규화된 문자열
 */
export function normalizeString(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value).trim();
}

/**
 *  빈 문자열을 null로 변환하는 유틸리티 함수
 * @param value 변환할 값
 * @returns 변환된 값 또는 null
 */
export function emptyToNull(value: unknown): string | null {
    const normalizedValue = normalizeString(value);

    return normalizedValue === '' ? null : normalizedValue;
}

/**
 *  문자열을 지정된 길이로 자르고 접미사를 추가하는 유틸리티 함수
 * ex): truncateString("Hello, World!", 5) => "Hello..."
 * @param value 자를 문자열
 * @param maxLength 최대 길이
 * @param suffix 길이를 초과할 경우 추가할 접미사
 * @returns 잘린 문자열
 */
export function truncateString(
    value: string,
    maxLength: number,
    suffix = '...',
): string {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength)}${suffix}`;
}