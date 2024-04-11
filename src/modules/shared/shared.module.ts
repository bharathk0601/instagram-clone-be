import { Module } from '@nestjs/common';
import { FileService } from './file.service';

const providers = [FileService];
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
