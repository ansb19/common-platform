import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResult<T> {
    @ApiProperty({ description: '전체 데이터 개수', example: 120 })
    totalCount!: number;

    @ApiProperty({ description: '현재 페이지 데이터', isArray: true })
    items!: T[];
}
