import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter
    implements ExceptionFilter<ThrottlerException> {
    catch(
        exception: ThrottlerException,
        host: ArgumentsHost,
    ): void {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        response.status(HttpStatus.TOO_MANY_REQUESTS).json({
            status: false,
            message: '요청이 너무 많습니다. 잠시 후 다시 이용해 주세요.',
        });
    }
}