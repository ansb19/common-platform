/**
 *  금액을 통화 형식으로 변환하는 유틸리티 함수
 * example: formatCurrency(1234567) => "₩1,234,567"
 * @param value 변환할 금액 값
 * @param options 변환 옵션 (locale, currency)
 * @returns 통화 형식으로 변환된 문자열
 */
export function formatCurrency(
    value: number | string | null | undefined,
    options?: {
        locale?: string;
        currency?: string;
    },
): string {
    const numberValue = Number(value ?? 0);
    const safeNumberValue = Number.isNaN(numberValue) ? 0 : numberValue;

    const {
        locale = 'ko-KR',
        currency = 'KRW',
    } = options ?? {};

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'KRW' ? 0 : 2,
    }).format(safeNumberValue);
}

/**
 *  원 단위로 금액을 포맷하는 유틸리티 함수
 * example: formatWon(1234567) => "1,234,567원"
 * @param value 변환할 금액 값
 * @returns 원 단위로 포맷된 문자열
 */
export function formatWon(value: number | string | null | undefined): string {
    const numberValue = Number(value ?? 0);
    const safeNumberValue = Number.isNaN(numberValue) ? 0 : numberValue;

    return `${safeNumberValue.toLocaleString('ko-KR')}원`;
}