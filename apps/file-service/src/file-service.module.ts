import { Module } from '@nestjs/common';
import { FileServiceController } from './file-service.controller';
import { FileServiceService } from './services/file.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@common-platform/database';
import { DATABASE_SERVICE } from 'libs/common/const/database.const';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { FileContext } from './entities/file-context.entity';
import { FileLog } from './entities/file-log.entity';
import { FileReference } from './entities/file-reference.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      File,
      FileContext,
      FileLog,
      FileReference,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRoot(DATABASE_SERVICE.FILE),
  ],

  controllers: [FileServiceController],
  providers: [FileServiceService],
})
export class FileServiceModule { }
