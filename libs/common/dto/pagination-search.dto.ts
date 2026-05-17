import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { TransNumber } from '../decorator/trans-number.decorator';
import { DeleteMode, SortOrder } from '../enum/search.enum';
import { SearchConfig } from '../config/search.config';


export class PaginationSearchDto<TColumn = string, TOrderBy = string> {
    @ApiPropertyOptional({
        description: '검색 키워드',
        example: "",
    })
    @IsOptional()
    @IsString({ message: '키워드는 문자열이어야 합니다.' })
    keyword?: string;

    @ApiPropertyOptional({
        description: '검색 대상 컬럼 (예: name, email 등)',
        example: "name",
    })
    @IsOptional()    
    type?: TColumn;

    @ApiPropertyOptional({
        description: '페이지 번호',
        default: SearchConfig.PAGE,
        minimum: 1,
        type: Number,
    })
    @TransNumber()
    @IsInt({ message: 'page는 정수여야 합니다.' })
    @Min(1, { message: 'page는 1 이상이어야 합니다.' })
    @IsDefined({ message: 'page는 필수입니다.' })
    page: number = SearchConfig.PAGE;

    @ApiPropertyOptional({
        description: '검색 결과 제한 수, 값을 추가하지 않으면 서버의 기본값 사용',
        default: SearchConfig.LIMIT,
        minimum: 1,
        type: Number,
    })
    @TransNumber()
    @IsInt({ message: 'limit는 정수여야 합니다.' })
    @Min(1, { message: 'limit는 1 이상이어야 합니다.' })
    @IsDefined({ message: 'limit는 필수입니다.' })
    limit: number = SearchConfig.LIMIT;

    @IsOptional()
    orderBy?: TOrderBy;

    @ApiPropertyOptional({ description: '정렬 방향', enum: SortOrder, default: SearchConfig.ORDER })
    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SearchConfig.ORDER;

    @ApiPropertyOptional({ enum: DeleteMode, default: DeleteMode.ACTIVE })
    @IsOptional()
    @IsEnum(DeleteMode)
    mode: DeleteMode = DeleteMode.ACTIVE;
}
