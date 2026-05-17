import { logger } from '@/logger/logger.service';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

@Catch()
export class FileCleanupFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        // ✅ 업로드된 임시 파일 정리
        this.cleanupUploadedFiles(req);

        // ✅ 상태 코드 및 응답 메시지 추출
        const { status, message, stack } = this.parseException(exception);

        // ✅ 서버 로그 (개발자용)
        logger.error(
            `[UPLOAD_ERROR] ${req.method} ${req.url} - ${message}`,
            stack ?? '',
        );

        // ✅ 사용자 응답 (개발 환경에서는 디버깅 정보 포함)
        const isDev = process.env.NODE_ENV !== 'production';
        res.status(status).json({
            status: false,
            message: message,
            ...(isDev && { debug: { stack, url: req.url } }), // 개발환경만 stack 포함
        });
    }

    private deleteFile(filePath: string) {
        if (!filePath) return;
        fs.unlink(path.resolve(filePath), (err) => {
            if (err && err.code !== 'ENOENT') {
                logger.warn(`임시 파일 삭제 실패: ${filePath} (${err.message})`);
            } else {
                logger.info(`임시 파일 삭제 성공: ${filePath}`);
            }
        });
    }

    private cleanupUploadedFiles(req: Request) {
        if (req.file) this.deleteFile(req.file.path);

        if (req.files) {
            // Array 형태 (FilesInterceptor) 또는 Object 형태 (upload.fields)
            const fileGroups = Array.isArray(req.files)
                ? req.files
                : Object.values(req.files).flat();

            (fileGroups as Express.Multer.File[]).forEach((file) =>
                this.deleteFile(file.path),
            );
        }
    }

    private parseException(exception: unknown): {
        status: number;
        message: string | object;
        stack?: string;
    } {
        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            const msg =
                typeof res === 'string'
                    ? res
                    : (res as any).message || 'Unexpected error';
            return {
                status: exception.getStatus(),
                message: msg,
                stack: (exception as any).stack,
            };
        }

        if (exception instanceof Error) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: exception.message || 'Internal server error',
                stack: exception.stack,
            };
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Unknown error occurred',
        };
    }
}
