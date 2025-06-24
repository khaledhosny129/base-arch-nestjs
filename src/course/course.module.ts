import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Course, courseSchema } from './entities/course.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: courseSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {} 