import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Competency, competencySchema } from './entities/competency.entity';
import { CompetencyController } from './competency.controller';
import { CompetencyService } from './competency.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Competency.name, schema: competencySchema }]),
  ],
  controllers: [CompetencyController],
  providers: [CompetencyService],
  exports: [CompetencyService],
})
export class CompetencyModule {} 