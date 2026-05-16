import { Controller, Get } from '@nestjs/common';
import { FileServiceService } from './service/file.service';

@Controller()
export class FileServiceController {
  constructor(private readonly fileServiceService: FileServiceService) {}

}
