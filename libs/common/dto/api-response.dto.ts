import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    @ApiProperty({ example: true, description: '성공 여부', type: Boolean })
    status!: boolean;

    @ApiProperty({ description: 'API별 실제 응답 데이터 (단일 객체 또는 배열)', })
    data!: T;

    @ApiProperty({ example: '요청이 성공적으로 처리되었습니다.', description: '메시지' })
    message!: string;
}
