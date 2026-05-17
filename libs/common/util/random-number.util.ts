// src/common/utils/generate-code.util.ts
import { randomInt } from 'node:crypto';

/**
 * 지정된 길이의 숫자 인증 코드를 생성하는 유틸리티 함수
 * @param length 생성할 인증 코드의 길이 (기본값: 6)
 * @returns 생성된 인증 코드 문자열
 */
export function generateVerificationCode(length = 6): string {
    const max = 10 ** length;
    const code = randomInt(0, max);

    return code.toString().padStart(length, '0');
}