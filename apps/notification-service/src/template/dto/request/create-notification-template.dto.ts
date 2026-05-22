// apps/notification-service/src/notification-template/dto/create-notification-template.dto.ts

import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';
import { NotificationChannel } from 'apps/notification-service/src/notification/enum/notification-channel.enum';
import {
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
} from 'class-validator';

import { CommonLength } from 'libs/common/const/common-length.const';
import { TransBoolean } from 'libs/common/decorator/trans-boolean.decorator';
import { TransEmptyToNull } from 'libs/common/decorator/trans-empty-to-null.decorator';


export class CreateNotificationTemplateDto {
    @ApiProperty({
        description: '프로젝트 이름',
        example: 'MIND_PUSH',
        maxLength: CommonLength.CODE,
    })
    @IsString({ message: 'projectName은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: 'projectName은 필수입니다.' })
    @MaxLength(CommonLength.CODE, {
        message: `projectName은 최대 ${CommonLength.CODE}자 이하이어야 합니다.`,
    })
    projectName!: string;

    @ApiProperty({
        description: '템플릿 코드',
        example: 'DAILY_QUOTE',
        maxLength: CommonLength.CODE,
    })
    @IsString({ message: 'code는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: 'code는 필수입니다.' })
    @MaxLength(CommonLength.CODE, {
        message: `code는 최대 ${CommonLength.CODE}자 이하이어야 합니다.`,
    })
    @Matches(/^[A-Z0-9_]+$/, {
        message: 'code는 대문자, 숫자, 언더스코어만 사용할 수 있습니다.',
    })
    code!: string;

    @ApiProperty({
        description: '알림 채널',
        enum: NotificationChannel,
        example: NotificationChannel.PUSH,
    })
    @IsEnum(NotificationChannel, {
        message: '유효하지 않은 알림 채널입니다.',
    })
    channel!: NotificationChannel;

    @ApiPropertyOptional({
        description: '템플릿 제목. SMS는 null 가능',
        example: '오늘의 격언',
        maxLength: CommonLength.TITLE,
        nullable: true,
    })
    @IsOptional()
    @TransEmptyToNull()
    @IsString({ message: 'title은 문자열이어야 합니다.' })
    @MaxLength(CommonLength.TITLE, {
        message: `title은 최대 ${CommonLength.TITLE}자 이하이어야 합니다.`,
    })
    title?: string | null;

    @ApiProperty({
        description: '템플릿 내용. 변수는 {name}, {quote} 형식으로 작성',
        example: '안녕하세요 {name}님. 오늘의 격언은 {quote}입니다.',
    })
    @IsString({ message: 'content는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: 'content는 필수입니다.' })
    content!: string;

    @ApiPropertyOptional({
        description: '템플릿 변수 목록. title/content에서 사용하는 변수명과 일치해야 합니다.',
        example: ['name', 'quote'],
        type: () => [String],
        nullable: true,
    })
    @IsOptional()
    @IsArray({ message: 'variables는 배열이어야 합니다.' })
    @IsString({
        each: true,
        message: 'variables의 각 값은 문자열이어야 합니다.',
    })
    @MaxLength(CommonLength.JSON_KEY, {
        each: true,
        message: `variables의 각 값은 최대 ${CommonLength.JSON_KEY}자 이하이어야 합니다.`,
    })
    @ArrayMaxSize(CommonLength.TAG_COUNT, {
        message: `variables는 최대 ${CommonLength.TAG_COUNT}개까지 허용합니다.`,
    })
    variables?: string[] | null;

    @ApiPropertyOptional({
        description: '활성 여부',
        default: true,
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @TransBoolean()
    @IsBoolean({ message: 'isActive는 boolean이어야 합니다.' })
    isActive?: boolean;
}