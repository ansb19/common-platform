import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { logger } from 'libs/common/logger/winston-logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;
        const startedAt = Date.now();

        return next.handle().pipe(
            tap((response: unknown) => {
                const elapsedTime = Date.now() - startedAt;

                if (process.env.NODE_ENV === 'development') {
                    logger.info(
                        `${method} ${url} - ${elapsedTime}ms\nRequest: ${JSON.stringify(body)}\nResponse: ${JSON.stringify(response)}`,
                    );

                    return;
                }

                logger.info(
                    `${method} ${url} - ${elapsedTime}ms`,
                );
            }),
        );
    }
}