import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModuleConfig } from './config/options/database.config';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModuleConfig } from './config/options/config.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompetencyModule } from './competency/competency.module';
import { CategoryModule } from './category/category.module';
import { SkillsModule } from './skills/skills.module';
import { CourseModule } from './course/course.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { JobProfileModule } from './job-profile/job-profile.module';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { MailModule } from 'mail/mail.module';
import { MailModuleConfig } from './config/options/mail.config';
import { QuestionModule } from './question/question.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRootAsync(ConfigModule, { useClass: ConfigModuleConfig }),
    MongooseModule.forRootAsync({
      useClass: MongooseModuleConfig,
      imports: [ConfigModule.Deferred],
    }),
    MailModule.forRootAsync(MailModule, {
      useClass: MailModuleConfig,
      imports: [ConfigModule.Deferred],
    }),
    AuthModule,
    UsersModule,
    CompetencyModule,
    CategoryModule,
    SkillsModule,
    CourseModule,
    RoadmapModule,
    JobProfileModule,
    QuestionModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
