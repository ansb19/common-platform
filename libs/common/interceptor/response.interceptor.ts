import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { API_MESSAGE_KEY } from 'libs/common/decorator/api-message.decorator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface ResponseApi<T> {
    status: true;
    data: T | null;
    message: string;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ResponseApi<T>> {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ResponseApi<T>> {
        const message =
            this.reflector.get<string>(
                API_MESSAGE_KEY,
                context.getHandler(),
            ) ?? '응답 성공';

        return next.handle().pipe(
            map((data) => ({
                status: true,
                data: data ?? null,
                message,
            })),
        );
    }
}