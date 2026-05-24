
// - 알림 요청 로그 검색
// - 알림 요청 로그 상세 조회
// - 특정 요청 로그의 수신자별 delivery log 조회
// - 실패 발송 로그 검색
// - 사용자별 수신 이력 조회

// apps/notification-service/src/log/notification-log.controller.ts

import {
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { ApiMessage } from 'libs/common/decorator/api-message.decorator';
import { ApiOkResponseData } from 'libs/common/decorator/api-response.decorator';
import { toDto, toDtos } from 'libs/common/util/transform.util';

import { NotificationLogIdxDto } from './dto/request/notification-log-idx.dto';
import { SearchNotificationDeliveryLogDto } from './dto/request/search-notification-delivery-log.dto';
import { SearchNotificationLogDto } from './dto/request/search-notification-log.dto';
import {
    PaginatedNotificationDeliveryLogResponse,
    ResponseNotificationDeliveryLogDto,
} from './dto/response/response-notification-delivery-log.dto';
import {
    PaginatedNotificationLogResponse,
    ResponseNotificationLogDto,
} from './dto/response/response-notification-log.dto';
import { NotificationLogService } from './notification-log.service';
import { ReceiverRefIdxDto } from './dto/request/receiver-ref-idx.dto';

@ApiTags('알림 로그 API(Notification Log)')
@Controller('notification-log')
export class NotificationLogController {
    constructor(
        private readonly notificationLogService: NotificationLogService,
    ) { }

    /**
     * 알림 요청 로그 검색
     */
    @ApiOperation({
        summary: '알림 요청 로그 검색',
        description: '프로젝트, 채널, 상태, 발신자, 수신자, 기간, 키워드 조건으로 알림 요청 로그를 검색합니다.',
    })
    @ApiOkResponseData(PaginatedNotificationLogResponse, '알림 요청 로그 검색이 완료되었습니다.')
    @ApiMessage('알림 요청 로그 검색이 완료되었습니다.')
    @Get('search')
    async searchNotificationLogs(
        @Query() dto: SearchNotificationLogDto,
    ): Promise<PaginatedNotificationLogResponse> {
        const { totalCount, items } =
            await this.notificationLogService.searchNotificationLogs(dto);

        return toDto(PaginatedNotificationLogResponse, {
            totalCount,
            items,
        });
    }

    /**
     * 알림 요청 로그 상세 조회
     */
    @ApiOperation({
        summary: '알림 요청 로그 상세 조회',
        description: '알림 요청 로그 IDX로 상세 정보를 조회합니다.',
    })
    @ApiOkResponseData(ResponseNotificationLogDto, '알림 요청 로그 조회가 완료되었습니다.')
    @ApiMessage('알림 요청 로그 조회가 완료되었습니다.')
    @Get(':idx')
    async getNotificationLog(
        @Param() dto: NotificationLogIdxDto,
    ): Promise<ResponseNotificationLogDto> {
        const notificationLog =
            await this.notificationLogService.getNotificationLogByIdx(dto.idx);

        return toDto(ResponseNotificationLogDto, notificationLog);
    }

    /**
     * 특정 요청 로그의 수신자별 delivery log 조회
     */
    @ApiOperation({
        summary: '특정 요청 로그의 수신자별 delivery log 조회',
        description: 'notification_log_idx 기준으로 수신자별 발송 결과 로그를 조회합니다.',
    })
    @ApiOkResponseData(ResponseNotificationDeliveryLogDto, '수신자별 발송 결과 로그 조회가 완료되었습니다.', {
        isArray: true,
    })
    @ApiMessage('수신자별 발송 결과 로그 조회가 완료되었습니다.')
    @Get(':idx/delivery-logs')
    async findDeliveryLogsByNotificationLogIdx(
        @Param() dto: NotificationLogIdxDto,
    ): Promise<ResponseNotificationDeliveryLogDto[]> {
        const deliveryLogs =
            await this.notificationLogService.findDeliveryLogsByNotificationLogIdx(
                dto.idx,
            );

        return toDtos(ResponseNotificationDeliveryLogDto, deliveryLogs);
    }

    /**
     * notification_delivery_logs 조건 검색
     */
    @ApiOperation({
        summary: '알림 수신 결과 로그 검색',
        description: '수신자, 채널, 상태, 기간, 키워드 조건으로 수신 결과 로그를 검색합니다.',
    })
    @ApiOkResponseData(PaginatedNotificationDeliveryLogResponse, '알림 수신 결과 로그 검색이 완료되었습니다.')
    @ApiMessage('알림 수신 결과 로그 검색이 완료되었습니다.')
    @Get('delivery/search')
    async searchDeliveryLogs(
        @Query() dto: SearchNotificationDeliveryLogDto,
    ): Promise<PaginatedNotificationDeliveryLogResponse> {
        const { totalCount, items } =
            await this.notificationLogService.searchDeliveryLogs(dto);

        return toDto(PaginatedNotificationDeliveryLogResponse, {
            totalCount,
            items,
        });
    }

    /**
     * 실패 발송 로그 검색
     */
    @ApiOperation({
        summary: '실패 발송 로그 검색',
        description: 'FAILED 상태의 수신 결과 로그만 검색합니다.',
    })
    @ApiOkResponseData(PaginatedNotificationDeliveryLogResponse, '실패 발송 로그 검색이 완료되었습니다.')
    @ApiMessage('실패 발송 로그 검색이 완료되었습니다.')
    @Get('delivery/failed')
    async searchFailedDeliveryLogs(
        @Query() dto: SearchNotificationDeliveryLogDto,
    ): Promise<PaginatedNotificationDeliveryLogResponse> {
        const { totalCount, items } =
            await this.notificationLogService.searchFailedDeliveryLogs(dto);

        return toDto(PaginatedNotificationDeliveryLogResponse, {
            totalCount,
            items,
        });
    }

    /**
     * 사용자별 수신 이력 조회
     */
    @ApiOperation({
        summary: '사용자별 수신 이력 조회',
        description: 'receiverRefIdx 기준으로 사용자의 알림 수신 이력을 조회합니다.',
    })
    @ApiOkResponseData(PaginatedNotificationDeliveryLogResponse, '사용자별 수신 이력 조회가 완료되었습니다.')
    @ApiMessage('사용자별 수신 이력 조회가 완료되었습니다.')
    @Get('receiver/:receiverRefIdx/histories')
    async searchReceivedHistoriesByReceiverRefIdx(
        @Param() paramDto: ReceiverRefIdxDto,
        @Query() queryDto: SearchNotificationDeliveryLogDto,
    ): Promise<PaginatedNotificationDeliveryLogResponse> {
        const { totalCount, items } =
            await this.notificationLogService.searchReceivedHistoriesByReceiverRefIdx(
                paramDto.receiverRefIdx,
                queryDto,
            );

        return toDto(PaginatedNotificationDeliveryLogResponse, {
            totalCount,
            items,
        });
    }
}