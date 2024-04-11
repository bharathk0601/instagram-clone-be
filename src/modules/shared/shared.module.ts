import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MailerService } from './mailer.service';

const providers = [FileService, MailerService];
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
