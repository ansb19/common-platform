export type TemplateVariables = Record<string, string | number | null | undefined>;

//알림 서비스의 템플릿 토큰과 변수명 매핑

export const TEMPLATE_TOKEN_MAP: Record<string, string> = {
    "{이름}": "name",
    "{아이디}": "loginId",
    "{등급}": "grade",
    "{이메일}": "email",
    "{휴대폰}": "phone",

    "{주문번호}": "orderId",
    // "{주문상태}": "orderStatus",
    // "{주문금액}": "orderAmount",
    "{가승인금액}": "provisionalOrderAmount", // 가승인금액 + 배송비 - 사용 포인트
    "{최종금액}": "finalOrderAmount", // 관리자 입력금액 + 배송비 - 사용포인트
    "{부분취소금액}": "partialCancelAmount", // 가승인 금액 - 관리자 입력 금액
    "{판매자}": "sellerName",
    "{상품명}": "productName",
    "{배송업체}": "deliveryCompany",
    "{운송장번호}": "trackingNumber",
    "{기본중량}": "defaultWeight",
    "{최종중량}": "finalWeight",
};

export enum TemplateToken {
    NAME = '{이름}',
    LOGIN_ID = '{아이디}',
    GRADE = '{등급}',
    EMAIL = '{이메일}',
    PHONE = '{휴대폰}',

    ORDER_ID = '{주문번호}',
    // ORDER_AMOUNT = '{주문금액}',
    // ORDER_STATUS = '{주문상태}',
    PROVISIONAL_ORDER_AMOUNT = '{가승인금액}',
    FINAL_ORDER_AMOUNT = '{최종금액}',
    PARTIAL_REFUND_AMOUNT = '{부분환불금액}',
    SELLER_NAME = '{판매자}',
    PRODUCT_NAME = '{상품명}',
    DELIVERY_COMPANY = '{배송업체}',
    TRACKING_NUMBER = '{운송장번호}',
    DEFAULT_WEIGHT = '{기본중량}',
    FINAL_WEIGHT = '{최종중량}'
}


export const AVAILABLE_TEMPLATE_TOKENS = Object.keys(TEMPLATE_TOKEN_MAP).join(', ');
export const TEMPLATE_TOKEN_MAP_DESCRIPTION =
    Object.entries(TEMPLATE_TOKEN_MAP)
        .map(([token, key]) => `${token} : ${key}`)
        .join('\n');

/**
 * 템플릿 문자열 안에 {키} 형태의 값을 data 기반으로 치환하는 함수
 */
export function replaceTokens(template: string, data: TemplateVariables): string {
    let result = template;

    for (const [token, key] of Object.entries(TEMPLATE_TOKEN_MAP)) {
        const value = data[key];
        result = result.replace(new RegExp(token, "g"), value ? String(value) : "");
    }

    return result;
}

export const ALLOWED_TEMPLATE_KEYS = Object.values(TEMPLATE_TOKEN_MAP);


export function extractTokens(text: string): string[] {
    const tokenRegex = /\{[^}]+\}/g;
    return text.match(tokenRegex) ?? [];
}

export function getRequiredVariableKeys(template: string): string[] {
    const tokens = extractTokens(template);

    return tokens
        .map(token => TEMPLATE_TOKEN_MAP[token])
        .filter(key => key !== undefined); // 매핑되는 key만 남김
}
