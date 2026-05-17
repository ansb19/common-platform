import dayjs from 'dayjs';
import { DataSource } from 'typeorm';

import { logger } from 'libs/common/logger/winston-logger';

export interface PartitionTableConfig {
    schema: string;
    baseTable: string;
}

export abstract class MonthlyPartitionService {
    protected constructor(
        protected readonly dataSource: DataSource,
    ) { }

    protected async createCurrentMonthPartition(
        config: PartitionTableConfig,
    ): Promise<void> {
        const start = dayjs().startOf('month');

        await this.createMonthPartition(config, start);
    }

    protected async createNextMonthPartition(
        config: PartitionTableConfig,
    ): Promise<void> {
        const start = dayjs().startOf('month').add(1, 'month');

        await this.createMonthPartition(config, start);
    }

    protected async dropOldPartitions(
        config: PartitionTableConfig,
        keepMonths: number,
    ): Promise<void> {
        if (keepMonths < 1) {
            throw new Error('keepMonths는 1 이상이어야 합니다.');
        }

        const now = dayjs();

        for (let i = keepMonths + 1; i <= keepMonths + 12; i++) {
            const suffix = now.subtract(i, 'month').format('YYYY_MM');
            const partitionTableName = `${config.baseTable}_${suffix}`;

            const sql = `
                DROP TABLE IF EXISTS "${config.schema}"."${partitionTableName}" CASCADE;
            `;

            await this.dataSource.query(sql);

            logger.info(
                `[Partition] Dropped old partition table: ${config.schema}.${partitionTableName}`,
            );
        }
    }

    private async createMonthPartition(
        config: PartitionTableConfig,
        start: dayjs.Dayjs,
    ): Promise<void> {
        const end = start.add(1, 'month');
        const suffix = start.format('YYYY_MM');
        const partitionTableName = `${config.baseTable}_${suffix}`;

        const sql = `
            CREATE TABLE IF NOT EXISTS "${config.schema}"."${partitionTableName}"
            PARTITION OF "${config.schema}"."${config.baseTable}"
            FOR VALUES FROM ('${start.format('YYYY-MM-DD')}')
                         TO ('${end.format('YYYY-MM-DD')}');
        `;

        await this.dataSource.query(sql);

        logger.info(
            `[Partition] Created monthly partition: ${config.schema}.${partitionTableName}`,
        );
    }
}


// 사용 예시
// @Injectable()
// export class FileLogPartitionService extends MonthlyPartitionService {
//     constructor(
//         dataSource: DataSource,
//     ) {
//         super(dataSource);
//     }

//     async createPartitions(): Promise<void> {
//         await this.createCurrentMonthPartition({
//             schema: 'file_schema',
//             baseTable: 'file_logs',
//         });

//         await this.createNextMonthPartition({
//             schema: 'file_schema',
//             baseTable: 'file_logs',
//         });
//     }
// }