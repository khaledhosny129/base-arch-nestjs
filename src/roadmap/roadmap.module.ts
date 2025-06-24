import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Roadmap, roadmapSchema } from './entities/roadmap.entity';
import { RoadmapController } from './roadmap.controller';
import { RoadmapService } from './roadmap.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Roadmap.name, schema: roadmapSchema }]),
  ],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {} 