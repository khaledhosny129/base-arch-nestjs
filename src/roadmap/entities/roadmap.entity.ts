import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../core/entities/base.entity';

export type RoadmapDoc = Roadmap & Document;

@Schema({ _id: false })
export class CourseItem {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course' })
  coursePreReq?: Types.ObjectId;
}

@Schema({ _id: false })
export class RoadmapDiscount {
  @Prop({ type: String, required: true })
  discountName: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  percentage: number;

  @Prop({ type: Date, required: true })
  expiresOn: Date;

  @Prop({ type: Boolean, default: true })
  status: boolean;
}

@Schema({ timestamps: true, id: true, versionKey: false })
export class Roadmap extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true, min: 0 })
  totalPrice: number;

  @Prop({ type: Number, required: true, min: 0 })
  totalHours: number;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: [CourseItem], default: [] })
  courses: CourseItem[];

  @Prop({ type: RoadmapDiscount })
  discount?: RoadmapDiscount;

  @Prop({ type: [String], default: [] })
  learningPathHighlights: string[];
}

export const roadmapSchema = SchemaFactory.createForClass(Roadmap); 