import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../core/entities/base.entity';
import { Competency } from 'src/competency/entities/competency.entity';
import { Category } from 'src/category/entities/category.entity';
export type SkillDoc = Skill & Document;

@Schema({ timestamps: true, id: true, versionKey: false })
export class Skill extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Competency.name, required: true })
  competencyId: Types.ObjectId;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true, min: 1 })
  maxAssesmentQuestions: number;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  passingScore: number;

  @Prop({ type: [Types.ObjectId], ref: Category.name, default: [] })
  categoriesIDs: Types.ObjectId[];
}

export const skillSchema = SchemaFactory.createForClass(Skill); 