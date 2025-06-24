import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsArray, Min, Max } from 'class-validator';
import { toObjectId } from 'src/core/utils/mongo.util';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  @ApiProperty({ type: String, required: true, example: 'JavaScript Fundamentals' })
  name: string;

  
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: '507f1f77bcf86cd799439011',
    description: 'Competency ID reference'
  })
  competencyId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Basic JavaScript programming concepts and syntax' 
  })
  description: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 20,
    minimum: 1,
    description: 'Maximum number of assessment questions'
  })
  maxAssesmentQuestions: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 70,
    minimum: 0,
    maximum: 100,
    description: 'Passing score percentage'
  })
  passingScore: number;

  @IsArray()
  @Transform(({ value }) => value.map(toObjectId))
  @IsNotEmpty()
  @ApiProperty({ 
    type: [String], 
    required: false, 
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
    description: 'Array of Category IDs'
  })
  categoriesIDs?: string[];
} 