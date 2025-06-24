import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../core/entities/base.entity';
import { Category } from '../../category/entities/category.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { CourseDomain } from '../enums/course-domain.enum';
import { Currency } from '../enums/currency.enum';

export type CourseDoc = Course & Document;

@Schema({ _id: false })
export class Price {
  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: String, enum: Object.values(Currency), required: true })
  currency: Currency;
}

@Schema({ _id: false })
export class Discount {
  @Prop({ type: String, required: true })
  discountName: string;

  @Prop({ type: Date, required: true })
  from: Date;

  @Prop({ type: Date, required: true })
  to: Date;
}

@Schema({ timestamps: true, id: true, versionKey: false })
export class Course extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: Skill.name, default: [] })
  skills: Types.ObjectId[];

  @Prop({ type: String, enum: Object.values(CourseDomain), required: true })
  courseDomain: CourseDomain;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;

  @Prop({ type: String, required: true })
  moodleCourse: string;

  @Prop({ type: Price, required: true })
  localPrice: Price;

  @Prop({ type: Price, required: true })
  foreignPrice: Price;

  @Prop({ type: Discount })
  discount?: Discount;
}

export const courseSchema = SchemaFactory.createForClass(Course); 