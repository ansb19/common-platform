/**
 * 문자열 길이 제한
 * DB length / Swagger / Validation 공통 사용
 */
export const CommonLength = {
    // 식별자
    UUID: 36,
    CODE: 100,

    // 일반 문자열
    NAME: 255,
    TITLE: 255,
    DESCRIPTION: 1000,
    MEMO: 500,

    // 인증
    LOGIN_ID: 50,
    PASSWORD_HASH: 255,
    PASSWORD_PLAIN: 40,
    CERT_CODE: 6,

    // 연락처
    EMAIL: 100,
    PHONE: 20,

    // 주소
    ADDRESS: 255,
    ZIP_CODE: 10,

    // 네트워크
    IP: 45, // IPv6

    // UI
    COLOR_CODE: 10,

    // 검색
    KEYWORD: 255,
    TAG: 50,
    TAG_COUNT: 20,

    // URL
    URL: 2048,

    // 파일
    FILE_NAME: 255,
    FILE_PATH: 1000,
    MIME_TYPE: 255,
    EXTENSION: 20,

    // 기타
    JSON_KEY: 100,
} as const;