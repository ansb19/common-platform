import {
    registerDecorator,
    ValidationOptions,
} from "class-validator";
import { ALLOWED_TEMPLATE_KEYS } from "../util/template-replacer.util";

export function IsTemplateVariables(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "isTemplateVariables",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (
                        typeof value !== "object" ||
                        value === null ||
                        Array.isArray(value)
                    ) {
                        return false;
                    }

                    const keys = Object.keys(value);
                    if (keys.length === 0) return false;

                    return keys.every(
                        (key) =>
                            ALLOWED_TEMPLATE_KEYS.includes(key) &&
                            typeof value[key] === 'string'
                    );
                },
                defaultMessage() {
                    return `variables는 다음 키만 사용할 수 있으며 값은 문자열이어야 합니다: ${ALLOWED_TEMPLATE_KEYS.join(", ")}`;
                },
            },
        });
    };
}
