import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../core/entities/base.entity';

export type CompetencyDoc = Competency & Document;

@Schema({ timestamps: true, id: true, versionKey: false })
export class Competency extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const competencySchema = SchemaFactory.createForClass(Competency); 