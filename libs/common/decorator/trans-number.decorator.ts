import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

// 숫자 변환 데코레이터
// 문자열로 들어오는 경우를 대비한 변환기
// 값이 undefined 또는 빈 문자열인 경우에는 undefined로 반환
// 그 외에는 숫자로 변환하여 반환

/**
 * 문자열 숫자 값을 number 타입으로 변환하고 검증하는 데코레이터입니다.
 *
 * QueryString/FormData 환경에서는 숫자 값이 문자열로 들어오는 경우가 많기 때문에
 * '1', '10', '3000' 같은 값을 number로 변환합니다.
 *
 * undefined는 그대로 유지하고, null은 null로 유지합니다.
 * 빈 문자열('')은 숫자로 변환하지 않고 그대로 두어 IsNumber 검증에서 실패하게 합니다.
 *
 * options.each가 true이면 배열 내부 값도 각각 변환합니다.
 */

interface TransNumberOptions {
    each?: boolean;
}

export function TransNumber(options?: TransNumberOptions) {
    const each = options?.each ?? false;

    return applyDecorators(
        Transform(({ value }) => {
            if (value === undefined) return value;
            if (value === null) return null; // ⭐ 핵심

            if (each && Array.isArray(value)) {
                return value.map((v) => {
                    if (v === '' || v === null) return v;
                    return Number(v);
                });
            }

            if (value === '') return value;
            return Number(value);
        }, { toClassOnly: true }),
        IsNumber({}, { each, message: '숫자 형식이어야 합니다.' }),
    );
}
