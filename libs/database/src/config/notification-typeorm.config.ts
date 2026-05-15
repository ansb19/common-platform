// libs/database/src/config/notification-typeorm.config.ts

import dotenvFlow from 'dotenv-flow';
import { DataSource } from 'typeorm';

dotenvFlow.config({
  path: process.cwd(),
  node_env: process.env.NODE_ENV || 'development',
});

export default new DataSource({
    type: 'postgres',
    host: process.env.NOTIFICATION_POSTGRES_HOST,
    port: Number(process.env.NOTIFICATION_POSTGRES_PORT),
    username: process.env.NOTIFICATION_POSTGRES_USER,
    password: process.env.NOTIFICATION_POSTGRES_PASSWORD,
    database: process.env.NOTIFICATION_POSTGRES_DB,
    schema: process.env.NOTIFICATION_POSTGRES_SCHEMA,

    entities: [
        process.env.NODE_ENV === 'production'
            ? 'dist/apps/notification-service/**/*.entity.js'
            : 'apps/notification-service/src/**/*.entity.ts',
    ],

    migrations: [
        process.env.NODE_ENV === 'production'
            ? 'dist/libs/database/src/migrations/notification/*.js'
            : 'libs/database/src/migrations/notification/*.ts',
    ],

    synchronize: false,
});