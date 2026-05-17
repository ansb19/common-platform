import * as ExcelJS from 'exceljs';

export interface ExcelColumn<T extends Record<string, unknown> = Record<string, unknown>> {
    /**
     * 엑셀 헤더명
     */
    header: string;

    /**
     * 객체 키
     */
    key: keyof T | string;

    /**
     * 열 너비
     */
    width?: number;

    /**
     * 값 변환기
     */
    formatter?: (
        value: unknown,
        row: T,
    ) => unknown;
}

/**
 *  엑셀 버퍼를 생성하는 유틸리티 함수
 * @param sheetName 시트 이름
 * @param columns 엑셀 열 정보
 * @param data 엑셀에 작성할 데이터
 * @returns 엑셀 버퍼
 */
export async function createExcelBuffer<T extends Record<string, unknown>>(
    sheetName: string,
    columns: ExcelColumn<T>[],
    data: T[],
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns.map((column) => ({
        header: column.header,
        key: String(column.key),
        width: column.width ?? 20,
    }));

    for (const row of data) {
        const rowData: Record<string, unknown> = {};

        for (const column of columns) {
            const key = String(column.key);
            const value = row[column.key as keyof T];

            rowData[key] = column.formatter
                ? column.formatter(value, row)
                : value;
        }

        worksheet.addRow(rowData);
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
}

export function createExcelFilename(filename: string): string {
    return `${encodeURIComponent(filename)}.xlsx`;
}

// controller 예시
// import {
//   Controller,
//   Get,
//   Res,
// } from '@nestjs/common';
// import { Response } from 'express';

// import {
//   createExcelBuffer,
//   createExcelFilename,
//   ExcelColumn,
// } from 'libs/common/src/util/excel.util';

// @Controller('products')
// export class ProductController {
//   @Get('excel')
//   async exportExcel(
//     @Res() res: Response,
//   ): Promise<void> {
//     const columns: ExcelColumn<Record<string, unknown>>[] = [
//       {
//         header: '상품명',
//         key: 'name',
//         width: 30,
//       },
//       {
//         header: '가격',
//         key: 'price',
//         width: 15,
//         formatter: (value) => Number(value).toLocaleString(),
//       },
//     ];

//     const data = [
//       {
//         name: '테스트 상품',
//         price: 10000,
//       },
//     ];

//     const buffer = await createExcelBuffer(
//       '상품목록',
//       columns,
//       data,
//     );

//     const filename = createExcelFilename('상품목록');

//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     );

//     res.setHeader(
//       'Content-Disposition',
//       `attachment; filename="${filename}"; filename*=UTF-8''${filename}`,
//     );

//     res.end(buffer);
//   }
// }