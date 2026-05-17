
/**
 *  값을 지정된 소수점 자리로 반올림하는 유틸리티 함수
 * @param value 반올림할 값
 * @param scale 소수점 자리
 * @returns 반올림된 값
 */
export function roundToScale(value: number, scale = 0): number {
    const factor = 10 ** scale;

    return Math.round(value * factor) / factor;
}

/**
 *  값을 지정된 소수점 자리로 내림하는 유틸리티 함수
 * @param value 내림할 값
 * @param scale 소수점 자리
 * @returns 내림된 값
 */
export function floorToScale(value: number, scale = 0): number {
    const factor = 10 ** scale;

    return Math.floor(value * factor) / factor;
}

/**
 *  값을 지정된 소수점 자리로 올림하는 유틸리티 함수
 * @param value 올림할 값
 * @param scale 소수점 자리
 * @returns 올림된 값
 */
export function ceilToScale(value: number, scale = 0): number {
    const factor = 10 ** scale;

    return Math.ceil(value * factor) / factor;
}