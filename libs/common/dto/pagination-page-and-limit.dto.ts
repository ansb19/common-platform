import { PickType } from "@nestjs/swagger";
import { PaginationSearchDto } from "./pagination-search.dto";


export class PaginationPageAndLimitDto extends PickType(
    PaginationSearchDto,
    ['page', 'limit'] as const
) {
}