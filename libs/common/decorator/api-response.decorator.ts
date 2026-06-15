import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * Swagger 문서에서 공통 API 응답 구조를 표시하기 위한 데코레이터입니다.
 *
 * ApiResponseDto 형태의 공통 응답 래퍼 안에 실제 data 모델을 연결합니다.
 * 단건 응답과 배열 응답을 모두 지원합니다.
 *
 * 사용 예:
 * @ApiOkResponseData(ResponseEmailDto)
 * @ApiOkResponseData(ResponseEmailDto, '조회 성공', { isArray: true })
 */

// api 성공 응답 데코레이터
export const ApiOkResponseData = <TModel extends Type<any>>(
    model: TModel,
    message?: string,
    options?: { isArray?: boolean },   // ✅ 옵션 추가
) => {
    const { isArray = false } = options || {};

    return applyDecorators(
        ApiExtraModels(ApiResponseDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
                    {
                        properties: {
                            data: isArray
                                ? { type: 'array', items: { $ref: getSchemaPath(model) } } // ✅ 배열 지원
                                : { $ref: getSchemaPath(model) },
                            ...(message && {
                                message: { type: 'string', example: message },
                            }),
                        },
                    },
                ],
            },
        }),
    );
};
