import {
    Injectable,
    PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
    transform(value: unknown): unknown {
        return this.trimValue(value);
    }

    private trimValue(value: unknown): unknown {
        if (typeof value === 'string') {
            return value.trim();
        }

        if (Array.isArray(value)) {
            return value.map((item) => this.trimValue(item));
        }

        if (
            typeof value === 'object'
            && value !== null
        ) {
            return this.trimObject(value as Record<string, unknown>);
        }

        return value;
    }

    private trimObject(
        obj: Record<string, unknown>,
    ): Record<string, unknown> {
        const result: Record<string, unknown> = {};

        for (const key of Object.keys(obj)) {
            result[key] = this.trimValue(obj[key]);
        }

        return result;
    }
}