// libs/database/src/database.module.ts

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseServiceName } from 'libs/common/const/database.const';



@Module({})
export class DatabaseModule {
  static forRoot(serviceName: DatabaseServiceName): DynamicModule {
    return {
      module: DatabaseModule,

      imports: [
        ConfigModule,

        TypeOrmModule.forRootAsync({
          inject: [ConfigService],

          useFactory: (configService: ConfigService) => {
            const prefix = serviceName;

            return {
              type: 'postgres',
              host: configService.get<string>(`${prefix}_POSTGRES_HOST`),
              port: Number(configService.get<string>(`${prefix}_POSTGRES_PORT`)),
              username: configService.get<string>(`${prefix}_POSTGRES_USER`),
              password: configService.get<string>(`${prefix}_POSTGRES_PASSWORD`),
              database: configService.get<string>(`${prefix}_POSTGRES_DB`),
              schema: configService.get<string>(`${prefix}_POSTGRES_SCHEMA`),

              autoLoadEntities: false,
              synchronize: false,
              logging: configService.get<string>('NODE_ENV') !== 'production',
            };
          },
        }),
      ],

      exports: [TypeOrmModule],
    };
  }
}