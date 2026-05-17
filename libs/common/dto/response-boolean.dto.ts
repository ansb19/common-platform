// src/common/dto/response-boolean.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseBooleanDto {
    @ApiProperty({ example: true, description: '결과 값(boolean)', type: Boolean })
    @Expose()
    result!: boolean;

    @ApiPropertyOptional({ example: '추가 정보', description: '상세 정보(있을 경우)' })
    @Expose()
    addInfo?: any;
}
