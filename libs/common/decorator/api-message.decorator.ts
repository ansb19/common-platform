// src/common/decorators/api-message.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * API 성공 응답 메시지를 메타데이터로 저장하는 데코레이터입니다.
 *
 * 주로 공통 응답 인터셉터에서 API_MESSAGE_KEY를 읽어
 * 응답 message 값을 커스터마이징할 때 사용합니다.
 *
 * 사용 예:
 * @ApiMessage('이메일 발송에 성공했습니다.')
 */

export const API_MESSAGE_KEY = 'apiMessage';
export const ApiMessage = (message: string) =>
    SetMetadata(API_MESSAGE_KEY, message);
// Usage: @ApiMessage('Custom success message')