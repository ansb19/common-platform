
// - 템플릿 생성
// - 템플릿 수정
// - 템플릿 조회
// - 템플릿 검색
// - 템플릿 활성 여부 변경
// - projectName + code + channel 기준 템플릿 조회
// - 템플릿 변수 목록 검증
// apps/notification-service/src/notification-template/notification-template.service.ts

import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from 'libs/common/dto/paginated-result';
import { NotificationTemplate } from './entity/notification-template.entity';
import { CreateNotificationTemplateDto } from './dto/request/create-notification-template.dto';
import { UpdateNotificationTemplateDto } from './dto/request/update-notification-template.dto';
import { SearchNotificationTemplateDto } from './dto/request/search-notification-template.dto';
import { NOTIFICATION_TEMPLATE_SEARCHABLE_COLUMNS, NotificationTemplateOrderByColumn } from './notification-template-search.enum';
import { SortOrder } from 'libs/common/enum/search.enum';
import { SearchConfig } from 'libs/common/config/search.config';
import { NotificationChannel } from '../notification/enum/notification-channel.enum';


@Injectable()
export class NotificationTemplateService {
    constructor(
        @InjectRepository(NotificationTemplate)
        private readonly notificationTemplateRepo: Repository<NotificationTemplate>,
    ) { }

    /**
     * 템플릿 생성
     */
    async createTemplate(
        dto: CreateNotificationTemplateDto,
    ): Promise<NotificationTemplate> {
        await this.validateDuplicateTemplate({
            projectName: dto.projectName,
            code: dto.code,
            channel: dto.channel,
        });

        this.validateTemplateVariableList({
            title: dto.title ?? null,
            content: dto.content,
            variables: dto.variables ?? null,
        });

        const template = this.notificationTemplateRepo.create({
            projectName: dto.projectName,
            code: dto.code,
            channel: dto.channel,
            title: dto.title ?? null,
            content: dto.content,
            variables: dto.variables ?? null,
            isActive: dto.isActive ?? true,
        });

        return this.notificationTemplateRepo.save(template);
    }

    /**
     * 템플릿 수정
     */
    async updateTemplate(
        idx: number,
        dto: UpdateNotificationTemplateDto,
    ): Promise<NotificationTemplate> {
        const template = await this.getTemplateByIdx(idx);

        if (
            dto.projectName !== undefined
            || dto.code !== undefined
            || dto.channel !== undefined
        ) {
            await this.validateDuplicateTemplate({
                projectName: dto.projectName ?? template.projectName,
                code: dto.code ?? template.code,
                channel: dto.channel ?? template.channel,
                excludeIdx: template.idx,
            });
        }

        const nextTitle = dto.title !== undefined
            ? dto.title
            : template.title;

        const nextContent = dto.content !== undefined
            ? dto.content
            : template.content;

        const nextVariables = dto.variables !== undefined
            ? dto.variables
            : template.variables;

        this.validateTemplateVariableList({
            title: nextTitle ?? null,
            content: nextContent,
            variables: nextVariables ?? null,
        });

        template.projectName = dto.projectName ?? template.projectName;
        template.code = dto.code ?? template.code;
        template.channel = dto.channel ?? template.channel;
        template.title = dto.title !== undefined ? dto.title : template.title;
        template.content = dto.content ?? template.content;
        template.variables = dto.variables !== undefined
            ? dto.variables
            : template.variables;
        template.isActive = dto.isActive ?? template.isActive;

        return this.notificationTemplateRepo.save(template);
    }

    /**
     * 템플릿 조회
     */
    async getTemplateByIdx(
        idx: number,
    ): Promise<NotificationTemplate> {
        const template = await this.notificationTemplateRepo.findOne({
            where: { idx },
        });

        if (!template) {
            throw new NotFoundException('알림 템플릿을 찾을 수 없습니다.');
        }

        return template;
    }

    /**
     * 템플릿 검색
     */
    async searchTemplates(
        dto: SearchNotificationTemplateDto,
    ): Promise<PaginatedResult<NotificationTemplate>> {
        const {
            keyword,
            type,
            projectName,
            channel,
            isActive,
            page,
            limit,
            orderBy = NotificationTemplateOrderByColumn.CREATED_AT,
            order = SortOrder.DESC,
        } = dto;

        const qb = this.notificationTemplateRepo
            .createQueryBuilder('template');

        if (projectName) {
            qb.andWhere('template.projectName = :projectName', {
                projectName,
            });
        }

        if (channel) {
            qb.andWhere('template.channel = :channel', {
                channel,
            });
        }

        if (isActive !== undefined) {
            qb.andWhere('template.isActive = :isActive', {
                isActive,
            });
        }

        if (keyword) {
            if (
                type
                && NOTIFICATION_TEMPLATE_SEARCHABLE_COLUMNS.includes(type)
            ) {
                qb.andWhere(`${type} ILIKE :keyword`, {
                    keyword: `%${keyword}%`,
                });
            } else {
                qb.andWhere(
                    `(${NOTIFICATION_TEMPLATE_SEARCHABLE_COLUMNS
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
                orderBy.includes('.') ? orderBy : `template.${orderBy}`,
                order,
            )
            .addOrderBy('template.createdAt', 'DESC')
            .getManyAndCount();

        return {
            totalCount,
            items,
        };
    }

    /**
     * 템플릿 활성 여부 변경
     */
    async updateTemplateActiveStatus(
        idx: number,
        isActive: boolean,
    ): Promise<NotificationTemplate> {
        const template = await this.getTemplateByIdx(idx);

        template.isActive = isActive;

        return this.notificationTemplateRepo.save(template);
    }

    /**
     * projectName + code + channel 기준 템플릿 조회
     */
    async getTemplateByCode(
        params: {
            projectName: string;
            code: string;
            channel: NotificationChannel;
        },
    ): Promise<NotificationTemplate> {
        const template = await this.notificationTemplateRepo.findOne({
            where: {
                projectName: params.projectName,
                code: params.code,
                channel: params.channel,
                isActive: true,
            },
        });

        if (!template) {
            throw new NotFoundException('알림 템플릿을 찾을 수 없습니다.');
        }

        return template;
    }

    /**
     * 템플릿 변수 목록 검증
     */
    validateTemplateVariables(
        params: {
            template: NotificationTemplate;
            variables: Record<string, unknown>;
        },
    ): void {
        const requiredVariables = params.template.variables ?? [];

        const missingVariables = requiredVariables.filter((key) => {
            const value = params.variables[key];

            return (
                value === null
                || value === undefined
                || value === ''
            );
        });

        if (missingVariables.length) {
            throw new BadRequestException(
                `템플릿 변수 값이 필요합니다: ${missingVariables.join(', ')}`,
            );
        }
    }

    /**
     * 템플릿 변수 치환
     */
    replaceVariables(
        content: string | null,
        variables: Record<string, unknown>,
    ): string {
        if (!content) {
            return '';
        }

        return content.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => {
            const value = variables[key];

            if (
                value === null
                || value === undefined
            ) {
                return '';
            }

            return String(value);
        });
    }

    private async validateDuplicateTemplate(
        params: {
            projectName: string;
            code: string;
            channel: NotificationChannel;
            excludeIdx?: number;
        },
    ): Promise<void> {
        const qb = this.notificationTemplateRepo
            .createQueryBuilder('template')
            .where('template.projectName = :projectName', {
                projectName: params.projectName,
            })
            .andWhere('template.code = :code', {
                code: params.code,
            })
            .andWhere('template.channel = :channel', {
                channel: params.channel,
            });

        if (params.excludeIdx) {
            qb.andWhere('template.idx != :excludeIdx', {
                excludeIdx: params.excludeIdx,
            });
        }

        const exists = await qb.getExists();

        if (exists) {
            throw new ConflictException(
                '이미 같은 프로젝트, 코드, 채널의 알림 템플릿이 존재합니다.',
            );
        }
    }

    private validateTemplateVariableList(
        params: {
            title: string | null;
            content: string;
            variables: string[] | null;
        },
    ): void {
        this.validateTemplateVariableNames(params.variables);

        const declaredVariables = params.variables ?? [];
        const usedVariables = this.extractVariableNames(
            `${params.title ?? ''} ${params.content}`,
        );

        const undeclaredVariables = usedVariables.filter(
            (variable) => !declaredVariables.includes(variable),
        );

        if (undeclaredVariables.length) {
            throw new BadRequestException(
                `템플릿에 사용된 변수가 variables에 선언되지 않았습니다: ${undeclaredVariables.join(', ')}`,
            );
        }
    }

    private validateTemplateVariableNames(
        variables: string[] | null,
    ): void {
        if (!variables) {
            return;
        }

        const duplicatedVariables = variables.filter(
            (variable, index) => variables.indexOf(variable) !== index,
        );

        if (duplicatedVariables.length) {
            throw new BadRequestException(
                `템플릿 변수가 중복되었습니다: ${[...new Set(duplicatedVariables)].join(', ')}`,
            );
        }

        const invalidVariables = variables.filter(
            (variable) => !/^[a-zA-Z0-9_]+$/.test(variable),
        );

        if (invalidVariables.length) {
            throw new BadRequestException(
                `템플릿 변수명 형식이 올바르지 않습니다: ${invalidVariables.join(', ')}`,
            );
        }
    }

    private extractVariableNames(
        content: string,
    ): string[] {
        const matches = content.matchAll(/\{([a-zA-Z0-9_]+)\}/g);

        return [
            ...new Set(
                [...matches].map((match) => match[1]),
            ),
        ];
    }
}