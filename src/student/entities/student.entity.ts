import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../core/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { EducationalLevelEnum } from '../enums/education-level.enum';

export class Education {
  @Prop({ type: String, required: true })
  institute: string;

  @Prop({ type: Number, required: true })
  year: number;

  @Prop({ type: String, required: true })
  degree: string;
}

export class JobHistory {
  @Prop({ type: String, required: true })
  company: string;

  @Prop({ type: String, required: true })
  position: string;

  @Prop({ type: Date, required: true })
  from: Date;

  @Prop({ type: Date, required: false })
  to?: Date;
}

export class Performance {
  @Prop({ type: Number, required: true, min: 0, max: 100 })
  commitment: number;
}

export type StudentDoc = Student & Document;

@Schema({ timestamps: true, id: true, versionKey: false })
export class Student extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [Education], default: [] })
  education: Education[];

  @Prop({ type: String, enum: Object.values(EducationalLevelEnum) })
  educationalLevel: EducationalLevelEnum;

  @Prop({ type: [JobHistory], default: [] })
  jobHistory: JobHistory[];

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  assignedLearningPath: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  assessmentsHistory: Types.ObjectId[];

  @Prop({ type: Performance })
  performance: Performance;
}

export const StudentSchema = SchemaFactory.createForClass(Student); 