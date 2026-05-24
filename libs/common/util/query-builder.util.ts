import {
    ObjectLiteral,
    SelectQueryBuilder,
} from 'typeorm';

/**
 * QueryBuilder에 날짜 범위 조건을 적용합니다.
 * startDate는 해당 날짜의 00:00:00.000부터,
 * endDate는 해당 날짜의 23:59:59.999까지 포함합니다.
 */
export function applyDateRange<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    column: string,
    startDate?: string,
    endDate?: string,
): void {
    const start = startDate
        ? new Date(`${startDate}T00:00:00.000`)
        : undefined;

    const end = endDate
        ? new Date(`${endDate}T23:59:59.999`)
        : undefined;

    if (start) {
        qb.andWhere(`${column} >= :start`, { start });
    }

    if (end) {
        qb.andWhere(`${column} <= :end`, { end });
    }
}