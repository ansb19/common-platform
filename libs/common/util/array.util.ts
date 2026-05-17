
// 배열에서 중복된 값을 제거하는 유틸리티 함수
export function uniqueArray<T>(values: T[]): T[] {
    return Array.from(new Set(values));
}

// 배열을 지정된 크기로 나누는 유틸리티 함수
export function chunkArray<T>(values: T[], size: number): T[][] {
    if (size <= 0) {
        return [values];
    }

    const chunks: T[][] = [];

    for (let i = 0; i < values.length; i += size) {
        chunks.push(values.slice(i, i + size));
    }

    return chunks;
}

// 배열이 null 또는 undefined가 아니고, 요소가 하나 이상인지 확인하는 유틸리티 함수
export function isNonEmptyArray<T>(values: T[] | null | undefined): values is T[] {
    return Array.isArray(values) && values.length > 0;
}