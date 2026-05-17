import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 프로젝트 표시 기준 타임존
 * - DB 저장은 UTC 기준을 권장한다.
 * - 이 유틸은 표시/검색 범위 계산용 KST 변환에 사용한다.
 */
const KST = 'Asia/Seoul';

/**
 * 기본 문자열 포맷
 * - DB 검색 / 로그 / 응답 공용
 */
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 내부 공통 파서
 * - string | Date → dayjs(KST)
 *
 * string:
 *   - 'YYYY-MM-DD'
 *   - 'YYYY-MM-DD HH:mm:ss'
 * Date:
 *   - JS Date 객체
 */
function parseToKst(date: string | Date): dayjs.Dayjs {
    return typeof date === 'string'
        ? dayjs.tz(date, KST)
        : dayjs(date).tz(KST);
}

/**
 * UTC(Date) 또는 KST string → KST 문자열 (표시/응답용)
 *
 * @example
 * toKstString(new Date())               // 2026-02-06 18:30:00
 * toKstString('2026-02-06')             // 2026-02-06 00:00:00
 */
export function toKstString(
    date?: string | Date | null,
    format: string = DEFAULT_FORMAT,
): string | null {
    if (!date) return null;

    return parseToKst(date).format(format);
}

/**
 * 입력 날짜의 시작 시간 (00:00:00) - KST 기준
 * 반환값은 문자열
 *
 * @example
 * toKstStartOfDay('2026-02-06')
 * → 2026-02-06 00:00:00
 */
export function toKstStartOfDay(
    date?: string | Date | null,
    format: string = DEFAULT_FORMAT,
): string | null {
    if (!date) return null;

    return parseToKst(date)
        .startOf('day')
        .format(format);
}

/**
 * 입력 날짜의 끝 시간 (23:59:59) - KST 기준
 * 반환값은 문자열
 *
 * ⚠ 밀리초가 필요한 경우 format을 변경해서 사용
 *
 * @example
 * toKstEndOfDay('2026-02-06')
 * → 2026-02-06 23:59:59
 */
export function toKstEndOfDay(
    date?: string | Date | null,
    format: string = DEFAULT_FORMAT,
): string | null {
    if (!date) return null;

    return parseToKst(date)
        .endOf('day')
        .format(format);
}
