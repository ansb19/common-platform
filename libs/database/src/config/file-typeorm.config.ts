// libs/database/src/config/file-typeorm.config.ts

import dotenvFlow from 'dotenv-flow';
import { DataSource } from 'typeorm';

dotenvFlow.config({
  path: process.cwd(),
  node_env: process.env.NODE_ENV || 'development',
});

export default new DataSource({
  type: 'postgres',
  host: process.env.FILE_POSTGRES_HOST,
  port: Number(process.env.FILE_POSTGRES_PORT),
  username: process.env.FILE_POSTGRES_USER,
  password: process.env.FILE_POSTGRES_PASSWORD,
  database: process.env.FILE_POSTGRES_DB,
  schema: process.env.FILE_POSTGRES_SCHEMA,

  entities: [
    process.env.NODE_ENV === 'production'
      ? 'dist/apps/file-service/**/*.entity.js'
      : 'apps/file-service/src/**/*.entity.ts',
  ],

  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/libs/database/src/migrations/file/*.js'
      : 'libs/database/src/migrations/file/*.ts',
  ],

  synchronize: false,
});