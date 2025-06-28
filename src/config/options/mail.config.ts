import { Injectable } from '@nestjs/common';
import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { MailModuleOptions } from 'mail/interfaces/mail-options.interface';
import { ConfigService } from '../config.services';



@Injectable()
export class MailModuleConfig
  implements ModuleConfigFactory<MailModuleOptions>
{
  constructor(private readonly configService: ConfigService) {}

  createModuleConfig(): MailModuleOptions {
    return {
      mail: this.configService.mailFrom,
      password: this.configService.mailPassword,
    };
  }
}
