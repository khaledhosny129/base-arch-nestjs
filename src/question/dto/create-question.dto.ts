import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Transform, Type, TypeOptions } from 'class-transformer';
import { QuestionTypeEnum } from '../entities/question.entity';
import { toObjectId } from 'src/core/utils/mongo.util';

class OptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'True', description: 'Option text' })
  text: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: 100, description: 'Option weight' })
  weight: number;
}

export class CreateQuestionDto {
  @IsArray()
  @Transform(({ value }) => value.map(toObjectId))
  @ApiProperty({ 
    type: [String], 
    required: false, 
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    description: 'Array of Skill IDs'
  })
  skillName: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'What is the capital of France?' })
  questionName: string;

  @IsEnum(QuestionTypeEnum)
  @ApiProperty({ enum: QuestionTypeEnum, example: QuestionTypeEnum.SINGLE_CHOICE })
  questionType: QuestionTypeEnum;

  @IsNumber()
  @ApiProperty({ type: Number, example: 30, description: 'Duration in seconds' })
  questionDuration: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @ApiProperty({ type: [OptionDto], description: 'Array of options' })
  options: OptionDto[];
} 