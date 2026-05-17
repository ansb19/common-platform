import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

/**
 * 문자열 boolean 값을 실제 boolean 타입으로 변환하고 검증하는 데코레이터입니다.
 *
 * QueryString/FormData 환경에서는 boolean 값이 문자열로 들어오는 경우가 많기 때문에
 * 'true'는 true, 'false'는 false로 변환합니다.
 *
 * options.each가 true이면 배열 내부 값도 각각 변환합니다.
 *
 * 허용 값:
 * - true
 * - false
 * - 'true'
 * - 'false'
 */
interface TransBooleanOptions {
    each?: boolean;
}

export function TransBoolean(options?: TransBooleanOptions) {
    const each = options?.each ?? false;

    return applyDecorators(
        Transform(({ value }) => {
            if (value === undefined) return value;

            // 배열 처리
            if (each && Array.isArray(value)) {
                return value.map((v) => {
                    if (v === 'true') return true;
                    if (v === 'false') return false;
                    return v; // validator에서 에러
                });
            }

            // 단일 값 처리
            if (value === 'true') return true;
            if (value === 'false') return false;
            return value;
        }),
        IsBoolean({ each, message: 'true 또는 false 값만 허용됩니다.' }),
    );
}
