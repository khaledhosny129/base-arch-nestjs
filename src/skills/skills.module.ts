import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Skill, skillSchema } from './entities/skill.entity';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: skillSchema }]),
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {} 