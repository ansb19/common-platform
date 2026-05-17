/**
 * undefined일 경우만 값을 바꾸고 null은 유지하는 유틸리티 함수
 * @param dtoValue 변경할 값
 * @param originValue 원래 값
 * @returns 변경된 값 또는 원래 값
 */
export function keepOriginIfUndefined<T>(
    dtoValue: T | undefined,
    originValue: T,
): T {
    return dtoValue !== undefined ? dtoValue : originValue;
}