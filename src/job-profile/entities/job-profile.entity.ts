import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../core/entities/base.entity';
import { Roadmap } from '../../roadmap/entities/roadmap.entity';
import { Category } from '../../category/entities/category.entity';
import { Competency } from '../../competency/entities/competency.entity';
import { Currency } from '../../course/enums/currency.enum';

export type JobProfileDoc = JobProfile & Document;

@Schema({ _id: false })
export class CompetencyItem {
  @Prop({ type: Types.ObjectId, ref: Competency.name, required: true })
  competencyID: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  percentage: number;

  @Prop({ type: String, required: true })
  formula: string;
}

@Schema({ _id: false })
export class SalaryRange {
  @Prop({ type: String, required: true })
  grade: string;

  @Prop({ type: Number, required: true, min: 0 })
  from: number;

  @Prop({ type: Number, required: true, min: 0 })
  to: number;

  @Prop({ type: String, enum: Object.values(Currency), required: true })
  currency: Currency;
}

@Schema({ timestamps: true, id: true, versionKey: false })
export class JobProfile extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: Roadmap.name, required: true })
  roadmapId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: Category.name, default: [] })
  jobProfileCategory: Types.ObjectId[];

  @Prop({ type: String, required: true })
  education: string;

  @Prop({ type: String, required: true })
  skillsNRequirements: string;

  @Prop({ type: [CompetencyItem], default: [] })
  competencies: CompetencyItem[];

  @Prop({ type: [SalaryRange], default: [] })
  salaryRange: SalaryRange[];

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  marketDemand: number;

  @Prop({ type: [String], default: [] })
  jobProfileVideos: string[];

  @Prop({ type: [String], default: [] })
  jobProfileImages: string[];
}

export const jobProfileSchema = SchemaFactory.createForClass(JobProfile); 