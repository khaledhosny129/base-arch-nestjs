import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Student, StudentSchema } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
    ]),
    UsersModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {} 