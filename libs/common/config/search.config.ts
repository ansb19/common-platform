import { SortOrder } from '../enum/search.enum';

export class SearchConfig {
    /**
     * 기본 페이지 번호
     */
    static readonly PAGE = 1;

    /**
     * 기본 페이지 크기
     */
    static readonly LIMIT = 20;

    /**
     * 기본 정렬 컬럼
     */
    static readonly ORDER_BY = 'createdAt';

    /**
     * 기본 정렬 방향
     */
    static readonly ORDER = SortOrder.DESC;


    /**
     * pagination 계산
     */
    static getPagination(
        page: number = SearchConfig.PAGE,
        limit: number = SearchConfig.LIMIT,
    ): {
        skip: number;
        take: number;
    } {
        return {
            skip: (page - 1) * limit,
            take: limit,
        };
    }
}