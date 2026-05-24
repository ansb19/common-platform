
// apps/notification-service/src/log/notification-log.service.ts

// - notification_logs 생성
// - notification_delivery_logs 생성
// - notification_logs 상태 변경
// - notification_logs 조건 검색
// - notification_logs 상세 조회
// - notification_delivery_logs 조건 검색
// - notification_log_idx 기준 delivery log 조회
// - 실패 로그 조회
// - receiverRefIdx 기준 수신 이력 조회

import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    In,
    Repository,   
} from 'typeorm';

import { PaginatedResult } from 'libs/common/dto/paginated-result';

import { NotificationDeliveryStatus } from '../notification/enum/notification-delivery-status.enum';
import { NotificationLogStatus } from '../notification/enum/notification-log-status.enum';

import { SearchNotificationDeliveryLogDto } from './dto/request/search-notification-delivery-log.dto';
import { SearchNotificationLogDto } from './dto/request/search-notification-log.dto';
import {
    NOTIFICATION_DELIVERY_LOG_SEARCHABLE_COLUMNS,
    NOTIFICATION_LOG_SEARCHABLE_COLUMNS,
    NotificationDeliveryLogOrderByColumn,
    NotificationLogOrderByColumn,
} from './notification-log-search.enum';
import { NotificationLog } from './entity/notification-log.entity';
import { NotificationDeliveryLog } from './entity/notification-delivery-log.entity';
import { SortOrder } from 'libs/common/enum/search.enum';
import { SearchConfig } from 'libs/common/config/search.config';
import { applyDateRange } from 'libs/common/util/query-builder.util';
import { CreateNotificationDeliveryLogParams, CreateNotificationLogParams, UpdateDeliveryLogStatusParams } from './notification-log.interface';


@Injectable()
export class NotificationLogService {
    constructor(
        @InjectRepository(NotificationLog)
        private readonly notificationLogRepo: Repository<NotificationLog>,

        @InjectRepository(NotificationDeliveryLog)
        private readonly notificationDeliveryLogRepo: Repository<NotificationDeliveryLog>,
    ) { }

    /**
     * notification_logs 생성
     */
    async createNotificationLog(
        params: CreateNotificationLogParams,
    ): Promise<NotificationLog> {
        const notificationLog = this.notificationLogRepo.create({
            projectName: params.projectName,
            requestId: params.requestId ?? null,
            templateIdx: params.templateIdx ?? null,
            senderRefType: params.senderRefType ?? null,
            senderRefIdx: params.senderRefIdx ?? null,
            channel: params.channel,
            title: params.title ?? null,
            content: params.content,
            templateVariables: params.templateVariables ?? null,
            receiverRefIdxs: params.receiverRefIdxs ?? null,
            fileUuids: params.fileUuids ?? null,
            linkUrl: params.linkUrl ?? null,
            priority: params.priority ?? 100,
            isSystem: params.isSystem ?? false,
            status: params.status ?? NotificationLogStatus.PENDING,
            targetCount: params.targetCount ?? 0,
            successCount: 0,
            failureCount: 0,
            failureReason: null,
            metadata: params.metadata ?? null,
        });

        return this.notificationLogRepo.save(notificationLog);
    }

    /**
     * notification_delivery_logs 생성
     */
    async createDeliveryLogs(
        params: CreateNotificationDeliveryLogParams[],
    ): Promise<NotificationDeliveryLog[]> {
        if (!params.length) {
            return [];
        }

        const deliveryLogs = this.notificationDeliveryLogRepo.create(
            params.map((param) => ({
                notificationLogIdx: param.notificationLogIdx,
                notificationLogCreatedAt: param.notificationLogCreatedAt,
                projectName: param.projectName,
                receiverRefType: param.receiverRefType,
                receiverRefIdx: param.receiverRefIdx ?? null,
                receiverContact: param.receiverContact ?? null,
                channel: param.channel,
                status: param.status ?? NotificationDeliveryStatus.PENDING,
                providerMessageId: null,
                failureCode: null,
                failureReason: null,
                retryCount: 0,
                sentAt: null,
                metadata: param.metadata ?? null,
                lastAttemptedAt: null,
            })),
        );

        return this.notificationDeliveryLogRepo.save(deliveryLogs);
    }

    /**
     * notification_logs 상태 변경
     */
    async updateNotificationLogStatus(
        idx: number,
        status: NotificationLogStatus,
        failureReason?: string | null,
    ): Promise<NotificationLog> {
        const notificationLog = await this.getNotificationLogByIdx(idx);

        notificationLog.status = status;

        if (failureReason !== undefined) {
            notificationLog.failureReason = failureReason;
        }

        return this.notificationLogRepo.save(notificationLog);
    }

    /**
     * delivery log 상태 변경
     */
    async updateDeliveryLogStatus(
        params: UpdateDeliveryLogStatusParams,
    ): Promise<NotificationDeliveryLog> {
        const deliveryLog = await this.getDeliveryLogByIdx(params.idx);

        deliveryLog.status = params.status;

        if (params.providerMessageId !== undefined) {
            deliveryLog.providerMessageId = params.providerMessageId;
        }

        if (params.failureCode !== undefined) {
            deliveryLog.failureCode = params.failureCode;
        }

        if (params.failureReason !== undefined) {
            deliveryLog.failureReason = params.failureReason;
        }

        if (params.sentAt !== undefined) {
            deliveryLog.sentAt = params.sentAt;
        }

        if (params.metadata !== undefined) {
            deliveryLog.metadata = params.metadata;
        }

        return this.notificationDeliveryLogRepo.save(deliveryLog);
    }

    async markDeliveryAsSent(
        idx: number,
        providerMessageId?: string | null,
    ): Promise<NotificationDeliveryLog> {
        return this.updateDeliveryLogStatus({
            idx,
            status: NotificationDeliveryStatus.SENT,
            providerMessageId: providerMessageId ?? null,
            failureCode: null,
            failureReason: null,
            sentAt: new Date(),
        });
    }

    async markDeliveryAsFailed(
        params: {
            idx: number;
            failureCode?: string | null;
            failureReason?: string | null;
        },
    ): Promise<NotificationDeliveryLog> {
        return this.updateDeliveryLogStatus({
            idx: params.idx,
            status: NotificationDeliveryStatus.FAILED,
            failureCode: params.failureCode ?? null,
            failureReason: params.failureReason ?? null,
            sentAt: null,
        });
    }

    async incrementRetryCount(
        idx: number,
    ): Promise<NotificationDeliveryLog> {
        const deliveryLog = await this.getDeliveryLogByIdx(idx);

        deliveryLog.retryCount += 1;
        deliveryLog.status = NotificationDeliveryStatus.RETRYING;

        return this.notificationDeliveryLogRepo.save(deliveryLog);
    }

    /**
     * notification_logs 조건 검색
     */
    async searchNotificationLogs(
        dto: SearchNotificationLogDto,
    ): Promise<PaginatedResult<NotificationLog>> {
        const {
            keyword,
            type,
            projectName,
            templateIdx,
            senderRefType,
            senderRefIdx,
            receiverRefIdx,
            channel,
            status,
            isSystem,
            startDate,
            endDate,
            page,
            limit,
            orderBy = NotificationLogOrderByColumn.CREATED_AT,
            order = SortOrder.DESC,
        } = dto;

        const qb = this.notificationLogRepo
            .createQueryBuilder('notificationLog');

        if (projectName) {
            qb.andWhere('notificationLog.projectName = :projectName', {
                projectName,
            });
        }

        if (templateIdx !== undefined) {
            qb.andWhere('notificationLog.templateIdx = :templateIdx', {
                templateIdx,
            });
        }

        if (senderRefType) {
            qb.andWhere('notificationLog.senderRefType = :senderRefType', {
                senderRefType,
            });
        }

        if (senderRefIdx !== undefined) {
            qb.andWhere('notificationLog.senderRefIdx = :senderRefIdx', {
                senderRefIdx,
            });
        }

        if (receiverRefIdx !== undefined) {
            qb.andWhere(':receiverRefIdx = ANY(notificationLog.receiverRefIdxs)', {
                receiverRefIdx,
            });
        }

        if (channel) {
            qb.andWhere('notificationLog.channel = :channel', {
                channel,
            });
        }

        if (status) {
            qb.andWhere('notificationLog.status = :status', {
                status,
            });
        }

        if (isSystem !== undefined) {
            qb.andWhere('notificationLog.isSystem = :isSystem', {
                isSystem,
            });
        }

        applyDateRange(qb, 'notificationLog.createdAt', startDate, endDate);

        if (keyword) {
            if (
                type
                && NOTIFICATION_LOG_SEARCHABLE_COLUMNS.includes(type)
            ) {
                qb.andWhere(`${type} ILIKE :keyword`, {
                    keyword: `%${keyword}%`,
                });
            } else {
                qb.andWhere(
                    `(${NOTIFICATION_LOG_SEARCHABLE_COLUMNS
                        .map((column) => `${column} ILIKE :keyword`)
                        .join(' OR ')})`,
                    {
                        keyword: `%${keyword}%`,
                    },
                );
            }
        }

        const { skip, take } = SearchConfig.getPagination(page, limit);

        const [items, totalCount] = await qb
            .skip(skip)
            .take(take)
            .orderBy(
                orderBy.includes('.') ? orderBy : `notificationLog.${orderBy}`,
                order,
            )
            .addOrderBy('notificationLog.createdAt', 'DESC')
            .getManyAndCount();

        return {
            totalCount,
            items,
        };
    }

    /**
     * notification_logs 상세 조회
     */
    async getNotificationLogByIdx(
        idx: number,
    ): Promise<NotificationLog> {
        const notificationLog = await this.notificationLogRepo.findOne({
            where: { idx },
        });

        if (!notificationLog) {
            throw new NotFoundException('알림 요청 로그를 찾을 수 없습니다.');
        }

        return notificationLog;
    }

    /**
     * notification_delivery_logs 조건 검색
     */
    async searchDeliveryLogs(
        dto: SearchNotificationDeliveryLogDto,
    ): Promise<PaginatedResult<NotificationDeliveryLog>> {
        const {
            keyword,
            type,
            projectName,
            notificationLogIdx,
            receiverRefType,
            receiverRefIdx,
            channel,
            status,
            startDate,
            endDate,
            page,
            limit,
            orderBy = NotificationDeliveryLogOrderByColumn.CREATED_AT,
            order = SortOrder.DESC,
        } = dto;

        const qb = this.notificationDeliveryLogRepo
            .createQueryBuilder('deliveryLog');

        if (projectName) {
            qb.andWhere('deliveryLog.projectName = :projectName', {
                projectName,
            });
        }

        if (notificationLogIdx !== undefined) {
            qb.andWhere('deliveryLog.notificationLogIdx = :notificationLogIdx', {
                notificationLogIdx,
            });
        }

        if (receiverRefType) {
            qb.andWhere('deliveryLog.receiverRefType = :receiverRefType', {
                receiverRefType,
            });
        }

        if (receiverRefIdx !== undefined) {
            qb.andWhere('deliveryLog.receiverRefIdx = :receiverRefIdx', {
                receiverRefIdx,
            });
        }

        if (channel) {
            qb.andWhere('deliveryLog.channel = :channel', {
                channel,
            });
        }

        if (status) {
            qb.andWhere('deliveryLog.status = :status', {
                status,
            });
        }

        applyDateRange(qb, 'deliveryLog.createdAt', startDate, endDate);

        if (keyword) {
            if (
                type
                && NOTIFICATION_DELIVERY_LOG_SEARCHABLE_COLUMNS.includes(type)
            ) {
                qb.andWhere(`${type} ILIKE :keyword`, {
                    keyword: `%${keyword}%`,
                });
            } else {
                qb.andWhere(
                    `(${NOTIFICATION_DELIVERY_LOG_SEARCHABLE_COLUMNS
                        .map((column) => `${column} ILIKE :keyword`)
                        .join(' OR ')})`,
                    {
                        keyword: `%${keyword}%`,
                    },
                );
            }
        }

        const { skip, take } = SearchConfig.getPagination(page, limit);

        const [items, totalCount] = await qb
            .skip(skip)
            .take(take)
            .orderBy(
                orderBy.includes('.') ? orderBy : `deliveryLog.${orderBy}`,
                order,
            )
            .addOrderBy('deliveryLog.createdAt', 'DESC')
            .getManyAndCount();

        return {
            totalCount,
            items,
        };
    }

    /**
     * delivery log 상세 조회
     */
    async getDeliveryLogByIdx(
        idx: number,
    ): Promise<NotificationDeliveryLog> {
        const deliveryLog = await this.notificationDeliveryLogRepo.findOne({
            where: { idx },
        });

        if (!deliveryLog) {
            throw new NotFoundException('알림 수신 결과 로그를 찾을 수 없습니다.');
        }

        return deliveryLog;
    }

    /**
     * notification_log_idx 기준 delivery log 조회
     */
    async findDeliveryLogsByNotificationLogIdx(
        notificationLogIdx: number,
    ): Promise<NotificationDeliveryLog[]> {
        return this.notificationDeliveryLogRepo.find({
            where: {
                notificationLogIdx,
            },
            order: {
                createdAt: 'ASC',
            },
        });
    }

    /**
     * 실패 로그 조회
     */
    async searchFailedDeliveryLogs(
        dto: SearchNotificationDeliveryLogDto,
    ): Promise<PaginatedResult<NotificationDeliveryLog>> {
        return this.searchDeliveryLogs({
            ...dto,
            status: NotificationDeliveryStatus.FAILED,
        });
    }

    /**
     * receiverRefIdx 기준 수신 이력 조회
     */
    async searchReceivedHistoriesByReceiverRefIdx(
        receiverRefIdx: number,
        dto: SearchNotificationDeliveryLogDto,
    ): Promise<PaginatedResult<NotificationDeliveryLog>> {
        return this.searchDeliveryLogs({
            ...dto,
            receiverRefIdx,
        });
    }

    /**
     * delivery log 처리 후 요청 로그 집계값 갱신
     */
    async refreshNotificationLogSummary(
        notificationLogIdx: number,
    ): Promise<NotificationLog> {
        const notificationLog = await this.getNotificationLogByIdx(notificationLogIdx);

        const [successCount, failureCount, targetCount] = await Promise.all([
            this.notificationDeliveryLogRepo.count({
                where: {
                    notificationLogIdx,
                    status: NotificationDeliveryStatus.SENT,
                },
            }),
            this.notificationDeliveryLogRepo.count({
                where: {
                    notificationLogIdx,
                    status: NotificationDeliveryStatus.FAILED,
                },
            }),
            this.notificationDeliveryLogRepo.count({
                where: {
                    notificationLogIdx,
                },
            }),
        ]);

        notificationLog.successCount = successCount;
        notificationLog.failureCount = failureCount;
        notificationLog.targetCount = targetCount;

        if (targetCount > 0 && successCount === targetCount) {
            notificationLog.status = NotificationLogStatus.COMPLETED;
        } else if (failureCount > 0 && successCount > 0) {
            notificationLog.status = NotificationLogStatus.PARTIAL_FAILED;
        } else if (failureCount > 0 && failureCount === targetCount) {
            notificationLog.status = NotificationLogStatus.FAILED;
        }

        return this.notificationLogRepo.save(notificationLog);
    }

    async findDeliveryLogsByIdxs(
        idxs: number[],
    ): Promise<NotificationDeliveryLog[]> {
        if (!idxs.length) {
            return [];
        }

        return this.notificationDeliveryLogRepo.find({
            where: {
                idx: In(idxs),
            },
        });
    }

    async markDeliveryAsRetrying(params: {
    idx: number;
    failureCode: string;
    failureReason: string;
    retryCount: number;
}): Promise<void> {
    await this.notificationDeliveryLogRepo.update(
        { idx: params.idx },
        {
            status: NotificationDeliveryStatus.RETRYING,
            failureCode: params.failureCode,
            failureReason: params.failureReason,
            retryCount: params.retryCount,
            lastAttemptedAt: new Date(),
        },
    );
}

}