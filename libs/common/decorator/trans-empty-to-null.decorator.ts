import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * 빈 문자열('')을 null로 변환하는 데코레이터입니다.
 *
 * HTML FormData, QueryString 등에서 값이 비어 있을 때
 * 빈 문자열로 전달되는 경우 DB nullable 컬럼 또는 선택 필드와 맞추기 위해 사용합니다.
 *
 * 사용 예:
 * @TransEmptyToNull()
 * description?: string | null;
 */

// 빈 문자열을 null로 변환
export function TransEmptyToNull() {
    return applyDecorators(
        Transform(({ value }) => {
            if (value === '') return null;
            return value;
        }),
    );
}
