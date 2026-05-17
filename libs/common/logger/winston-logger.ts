import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import 'dotenv/config';
import { toKstString } from '../util';

const logFormat = format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
});

export const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: () => toKstString(new Date()) ?? new Date().toISOString() }),
        logFormat,
    ),
    transports: [
        new transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d', // 14일 보관
        }),
        new transports.Console({}) // 콘솔에도 출력
    ],
});

