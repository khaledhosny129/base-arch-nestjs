import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../core/entities/base.entity';
import { Skill } from 'src/skills/entities/skill.entity';

export enum QuestionTypeEnum {
  MULTIPLE_CHOICE = 'MultipleChoice',
  SINGLE_CHOICE = 'SingleChoice',
  TRUE_FALSE = 'TrueFalse',
}

export type QuestionDoc = Question & Document;

@Schema({ id: true, versionKey: false })
export class Option {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Number, required: true })
  weight: number;
}

@Schema({ timestamps: true, id: true, versionKey: false })
export class Question extends BaseEntity {
  @Prop({ type: [{ type: Types.ObjectId, ref: Skill.name }], required: true })
  skillName: Types.ObjectId[];

  @Prop({ type: String, required: true })
  questionName: string;

  @Prop({ type: Number, required: true })
  totalWeight: number; 

  @Prop({ type: String, enum: Object.values(QuestionTypeEnum), required: true })
  questionType: QuestionTypeEnum;

  @Prop({ type: Number, required: true })
  questionDuration: number;

  @Prop({ type: [Option], required: true })
  options: Option[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question); 