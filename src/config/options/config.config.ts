import { ModuleConfigFactory } from '@golevelup/nestjs-modules';

import { ConfigModuleOptions } from '../interfaces/configOptions.interface';

export class ConfigModuleConfig
  implements ModuleConfigFactory<ConfigModuleOptions>
{
  createModuleConfig(): ConfigModuleOptions {
    const env = process.env.NODE_ENV;

    return {
      dir: 'config',
      fileName: !env ? '.env.development' : `.env.${env}`,
      useProcess: false,
    };
  }
}