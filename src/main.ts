import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configure } from './config.main';
import { ConfigService } from './config/config.services';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });

  const config = app.get(ConfigService);
  const port = process.env.PORT || config.port || 3000;
  configure(app, config);

  await app.listen(port, () => {
    Logger.verbose(
      `🚀 Server listening on PORT:${port} | ${config.nodeEnv} | ${config.apiUrl}`,
    );
  });
}
bootstrap();
