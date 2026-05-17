
/**
 *  값을 숫자로 변환하거나 null을 반환하는 유틸리티 함수
 * @param value 변환할 값
 * @returns 숫자 값 또는 null
 */
export function parseNumberOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? null : numberValue;
}

/**
 * 값을 정수로 변환하거나 null을 반환하는 유틸리티 함수
 */
export function parseIntegerOrNull(value: unknown): number | null {
    const numberValue = parseNumberOrNull(value);

    if (numberValue === null || !Number.isInteger(numberValue)) {
        return null;
    }

    return numberValue;
}

/**
 *  값을 지정된 소수점 자리로 포맷하는 유틸리티 함수
 * @param value 포맷할 값
 * @param scale 소수점 자리
 * @param trimZero 불필요한 0 제거 여부
 * @returns 포맷된 문자열 또는 null
 */
export function formatNumber(
    value: unknown,
    scale = 3,
    trimZero = false,
): string | null {
    const numberValue = parseNumberOrNull(value);

    if (numberValue === null) {
        return null;
    }

    const fixed = numberValue.toFixed(scale);

    return trimZero ? Number(fixed).toString() : fixed;
}