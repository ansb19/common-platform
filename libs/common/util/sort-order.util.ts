/**
 * 정렬 순서를 생성하는 유틸리티 함수
 * @param maxSortOrder 현재 최대 정렬 순서
 * @param gap 증가할 간격
 * @returns 새로운 정렬 순서
 */
export function generateSortOrder(
  maxSortOrder?: number,
  gap = 1000,
): number {
  return (maxSortOrder ?? 0) + gap;
}

/**
 *  두 정렬 순서 사이에 새로운 정렬 순서를 계산하는 유틸리티 함수
 * @param prev 이전 정렬 순서
 * @param next 다음 정렬 순서
 * @param gap 증가할 간격
 * @returns 새로운 정렬 순서
 */
export function calculateSortOrder(
  prev?: number | null,
  next?: number | null,
  gap = 1000,
): number {
  if (prev == null && next == null) {
    return gap;
  }

  if (prev == null) {
    return next! - gap;
  }

  if (next == null) {
    return prev + gap;
  }

  return (prev + next) / 2;
}

/**
 * 정렬 순서 재조정이 필요한지 확인하는 유틸리티 함수
 * @param prev 이전 정렬 순서
 * @param next 다음 정렬 순서
 * @param minGap 최소 간격
 * @returns 재조정 필요 여부
 */
export function needRebalance(
  prev: number,
  next: number,
  minGap = 1e-6,
): boolean {
  return next - prev < minGap;
}