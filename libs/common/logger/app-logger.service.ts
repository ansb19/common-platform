import { Injectable, LoggerService } from '@nestjs/common';

import { logger } from './winston-logger';

@Injectable()
export class AppLoggerService implements LoggerService {
    log(message: string): void {
        logger.info(message);
    }

    error(message: string, trace?: string): void {
        logger.error(trace ? `${message}\n${trace}` : message);
    }

    warn(message: string): void {
        logger.warn(message);
    }

    debug(message: string): void {
        logger.debug(message);
    }
}