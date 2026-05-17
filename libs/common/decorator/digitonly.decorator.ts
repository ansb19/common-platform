import { Transform, TransformFnParams } from "class-transformer";

// 숫자 이외의 문자를 제거하는 Transform 데코레이터
export const DigitsOnly = () => {
    return function (target: any, key: string) {
        Transform(({ value }: TransformFnParams) => {
            if (value === null || value === undefined) return value;
            return String(value).replace(/[^0-9]/g, '');
        })(target, key);
    };
};