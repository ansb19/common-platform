import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PaginatedResponse<T> {
    @ApiProperty({ example: 42, description: '전체 검색 결과 개수', type: Number, minimum: 0 })
    @Expose()
    totalCount!: number;

    @ApiProperty({ description: '데이터 목록', isArray: true })
    @Expose()
    items!: T[];
}