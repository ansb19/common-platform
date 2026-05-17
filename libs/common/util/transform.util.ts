import { plainToInstance, ClassConstructor, instanceToPlain } from 'class-transformer';

//dto로 변경
export function toDto<T, V>(dto: ClassConstructor<T>, entity: V): T {
    return plainToInstance(dto, entity, { excludeExtraneousValues: true });
}

//객체가 복수일 때 dto로 변경
export function toDtos<T, V>(dto: ClassConstructor<T>, entities: V[]): T[] {
    const plainEntities = entities.map((e) => instanceToPlain(e));
    return plainToInstance(dto, plainEntities, { excludeExtraneousValues: true });
}
