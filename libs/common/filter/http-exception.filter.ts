import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { logger } from '../logger/winston-logger';
import { sanitizeBody } from '../logger/util/sanitize-body.util';

interface HttpExceptionResponseBody {
    statusCode?: number;
    message?: string | string[];
    error?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter
    implements ExceptionFilter<HttpException> {
    catch(
        exception: HttpException,
        host: ArgumentsHost,
    ): void {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        const statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message = '요청 처리 중 오류가 발생했습니다.';
        let error: string | undefined;

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (
            typeof exceptionResponse === 'object'
            && exceptionResponse !== null
        ) {
            const responseBody = exceptionResponse as HttpExceptionResponseBody;
            const responseMessage = responseBody.message;

            if (Array.isArray(responseMessage)) {
                message = responseMessage.join(', ');
            } else if (typeof responseMessage === 'string') {
                message = responseMessage;
            }

            error = responseBody.error;
        }

        const safeBody = sanitizeBody(request.body);
        const safeQuery = sanitizeBody(request.query);
        const safeParams = sanitizeBody(request.params);

        logger.error(
            `[${request.method}] ${request.url} - ${statusCode}\n`
            + `IP: ${request.ip}\n`
            + `Params: ${JSON.stringify(safeParams)}\n`
            + `Query: ${JSON.stringify(safeQuery)}\n`
            + `Request: ${JSON.stringify(safeBody)}\n`
            + `Error: ${message}`,
        );

        response.status(statusCode).json({
            status: false,
            message,
            error,
            statusCode,
        });
    }
}