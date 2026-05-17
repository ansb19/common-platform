import {
    Injectable,
} from '@nestjs/common';
import {
    EntityManager,
    FindOptionsWhere,
    ObjectLiteral,
    Repository,
} from 'typeorm';

export interface SortableEntity extends ObjectLiteral {
    idx: number;
    sortOrder: number;
}

export interface UpdateSortOrderItem {
    idx: number;
    sortOrder: number;
}

@Injectable()
export class SortOrderService {
    async getNextSortOrder<T extends SortableEntity>(
        repo: Repository<T>,
        condition: FindOptionsWhere<T> = {},
    ): Promise<number> {
        const last = await repo.findOne({
            where: condition,
            order: {
                sortOrder: 'DESC',
            } as any,
        });

        return last
            ? last.sortOrder + 1
            : 1;
    }

    async updateSortOrders<T extends SortableEntity>(
        repo: Repository<T>,
        newOrders: UpdateSortOrderItem[],
        condition: FindOptionsWhere<T>,
        manager: EntityManager,
    ): Promise<T[]> {
        const txRepo = manager.getRepository<T>(repo.target);

        const items = await txRepo.find({
            where: condition,
            order: {
                sortOrder: 'ASC',
            } as any,
        });

        if (!items.length) {
            return [];
        }

        const orderMap = new Map(
            newOrders.map((item) => [
                item.idx,
                item.sortOrder,
            ]),
        );

        for (const item of items) {
            const sortOrder = orderMap.get(item.idx);

            if (sortOrder !== undefined) {
                item.sortOrder = sortOrder;
            }
        }

        items.sort((a, b) => a.sortOrder - b.sortOrder);

        items.forEach((item, index) => {
            item.sortOrder = index + 1;
        });

        return txRepo.save(items);
    }
}


// 사용 예시
// await this.dataSource.transaction(async (manager) => {
//     await this.sortOrderService.updateSortOrders(
//         this.productOptionGroupRepo,
//         dto.orders,
//         {
//             productIdx,
//         },
//         manager,
//     );
// });