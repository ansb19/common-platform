

// - 템플릿 생성
// - 템플릿 수정
// - 템플릿 단건 조회
// - 템플릿 목록 검색
// - 템플릿 활성/비활성

// apps/notification-service/src/notification-template/notification-template.controller.ts

import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { ApiMessage } from 'libs/common/decorators/api-message.decorator';
import { ApiOkResponseData } from 'libs/common/decorators/api-response.decorator';
import { toDto } from 'libs/common/util/transform.util';

import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { NotificationTemplateIdxDto } from './dto/notification-template-idx.dto';
import {
    PaginatedNotificationTemplateResponse,
    ResponseNotificationTemplateDto,
} from './dto/response-notification-template.dto';
import { SearchNotificationTemplateDto } from './dto/search-notification-template.dto';
import { UpdateNotificationTemplateActiveDto } from './dto/update-notification-template-active.dto';
import { UpdateNotificationTemplateDto } from './dto/update-notification-template.dto';
import { NotificationTemplateService } from './notification-template.service';

@ApiTags('알림 템플릿 API(Notification Template)')
@Controller('notification-template')
export class NotificationTemplateController {
    constructor(
        private readonly notificationTemplateService: NotificationTemplateService,
    ) { }

    /**
     * 템플릿 생성
     */
    @ApiOperation({
        summary: '알림 템플릿 생성',
        description: `
        알림 템플릿을 생성합니다.
        - projectName + code + channel 조합은 중복될 수 없습니다.
        - content/title에서 사용하는 변수는 variables에 선언되어야 합니다.
        - 변수 형식은 {name}, {quote}처럼 사용합니다.
        `,
    })
    @ApiOkResponseData(ResponseNotificationTemplateDto, '템플릿이 생성되었습니다.')
    @ApiMessage('템플릿이 생성되었습니다.')
    @Post()
    async createTemplate(
        @Body() dto: CreateNotificationTemplateDto,
    ): Promise<ResponseNotificationTemplateDto> {
        const template = await this.notificationTemplateService.createTemplate(dto);

        return toDto(ResponseNotificationTemplateDto, template);
    }

    /**
     * 템플릿 검색
     */
    @ApiOperation({
        summary: '알림 템플릿 검색',
        description: '프로젝트, 채널, 활성 여부, 키워드 기준으로 알림 템플릿을 검색합니다.',
    })
    @ApiOkResponseData(PaginatedNotificationTemplateResponse, '검색이 완료되었습니다.')
    @ApiMessage('검색이 완료되었습니다.')
    @Get('search')
    async searchTemplates(
        @Query() dto: SearchNotificationTemplateDto,
    ): Promise<PaginatedNotificationTemplateResponse> {
        const { totalCount, items } =
            await this.notificationTemplateService.searchTemplates(dto);

        return toDto(PaginatedNotificationTemplateResponse, {
            totalCount,
            items,
        });
    }

    /**
     * 템플릿 조회
     */
    @ApiOperation({
        summary: '알림 템플릿 상세 조회',
        description: '알림 템플릿 idx로 상세 정보를 조회합니다.',
    })
    @ApiOkResponseData(ResponseNotificationTemplateDto, '템플릿 조회가 완료되었습니다.')
    @ApiMessage('템플릿 조회가 완료되었습니다.')
    @Get(':idx')
    async getTemplate(
        @Param() dto: NotificationTemplateIdxDto,
    ): Promise<ResponseNotificationTemplateDto> {
        const template = await this.notificationTemplateService.getTemplateByIdx(
            dto.idx,
        );

        return toDto(ResponseNotificationTemplateDto, template);
    }

    /**
     * 템플릿 수정
     */
    @ApiOperation({
        summary: '알림 템플릿 수정',
        description: `
        알림 템플릿을 수정합니다.
        - projectName, code, channel 변경 시 중복 여부를 다시 검증합니다.
        - content/title에서 사용하는 변수는 variables에 선언되어야 합니다.
        `,
    })
    @ApiOkResponseData(ResponseNotificationTemplateDto, '템플릿이 수정되었습니다.')
    @ApiMessage('템플릿이 수정되었습니다.')
    @Patch(':idx')
    async updateTemplate(
        @Param() paramDto: NotificationTemplateIdxDto,
        @Body() dto: UpdateNotificationTemplateDto,
    ): Promise<ResponseNotificationTemplateDto> {
        const template = await this.notificationTemplateService.updateTemplate(
            paramDto.idx,
            dto,
        );

        return toDto(ResponseNotificationTemplateDto, template);
    }

    /**
     * 템플릿 활성 여부 변경
     */
    @ApiOperation({
        summary: '알림 템플릿 활성 여부 변경',
        description: '알림 템플릿의 활성 여부만 변경합니다.',
    })
    @ApiOkResponseData(ResponseNotificationTemplateDto, '템플릿 활성 여부가 변경되었습니다.')
    @ApiMessage('템플릿 활성 여부가 변경되었습니다.')
    @Patch(':idx/active')
    async updateTemplateActiveStatus(
        @Param() paramDto: NotificationTemplateIdxDto,
        @Body() dto: UpdateNotificationTemplateActiveDto,
    ): Promise<ResponseNotificationTemplateDto> {
        const template =
            await this.notificationTemplateService.updateTemplateActiveStatus(
                paramDto.idx,
                dto.isActive,
            );

        return toDto(ResponseNotificationTemplateDto, template);
    }
}