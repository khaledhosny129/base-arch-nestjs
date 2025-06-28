import { Module } from '@nestjs/common';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';

import { MailService } from './mail.service';
import { ConfigModule } from 'src/config/config.module';
import { MAIL_MODULE_OPTIONS } from './mail.constants';
import { MailModuleOptions } from './interfaces';

@Module({
  imports: [ConfigModule.Deferred],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule extends createConfigurableDynamicRootModule<
  MailModule,
  MailModuleOptions
>(MAIL_MODULE_OPTIONS) {
  static Deferred = MailModule.externallyConfigured(MailModule, 0);
}
