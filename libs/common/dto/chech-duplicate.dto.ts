import {
    ApiProperty,
} from '@nestjs/swagger';

export abstract class CheckDuplicateDto<T> {
    @ApiProperty({
        description: '중복 체크 타입',
    })
    abstract type: T;

    @ApiProperty({
        description: '검사할 값',
        example: 'example_value',
    })
    abstract identifier: string;
}