import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional, Min, Max, ValidateNested, IsEnum } from 'class-validator';
import { toObjectId } from 'src/core/utils/mongo.util';
import { Currency } from '../../course/enums/currency.enum';

export class CompetencyItemDto {
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: '507f1f77bcf86cd799439011',
    description: 'Competency ID reference'
  })
  competencyID: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 75,
    minimum: 0,
    maximum: 100,
    description: 'Competency percentage'
  })
  percentage: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'weighted_average',
    description: 'Formula for calculating competency'
  })
  formula: string;
}

export class SalaryRangeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Junior',
    description: 'Salary grade level'
  })
  grade: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 50000,
    minimum: 0,
    description: 'Minimum salary'
  })
  from: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 80000,
    minimum: 0,
    description: 'Maximum salary'
  })
  to: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  @ApiProperty({ 
    enum: Currency, 
    required: true, 
    example: Currency.USD,
    description: 'Salary currency'
  })
  currency: Currency;
}

export class CreateJobProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Full Stack Developer',
    description: 'Job profile name'
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'A comprehensive role for full stack web development',
    description: 'Job profile description'
  })
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: '507f1f77bcf86cd799439011',
    description: 'Roadmap ID reference'
  })
  roadmapId: string;

  @IsArray()
  @Transform(({ value }) => value.map((id: string) => toObjectId(id)))
  @IsOptional()
  @ApiProperty({ 
    type: [String], 
    required: false, 
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    description: 'Array of category ID references'
  })
  jobProfileCategory?: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Bachelor\'s degree in Computer Science or related field',
    description: 'Required education'
  })
  education: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'JavaScript, React, Node.js, MongoDB, AWS',
    description: 'Required skills and requirements'
  })
  skillsNRequirements: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetencyItemDto)
  @IsOptional()
  @ApiProperty({ 
    type: [CompetencyItemDto], 
    required: false,
    description: 'Array of competencies with percentages and formulas'
  })
  competencies?: CompetencyItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryRangeDto)
  @IsOptional()
  @ApiProperty({ 
    type: [SalaryRangeDto], 
    required: false,
    description: 'Array of salary ranges by grade'
  })
  salaryRange?: SalaryRangeDto[];

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 85,
    minimum: 0,
    maximum: 100,
    description: 'Market demand percentage'
  })
  marketDemand: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ 
    type: [String], 
    required: false, 
    example: [
      'https://example.com/video1.mp4',
      'https://example.com/video2.mp4'
    ],
    description: 'Array of job profile video URLs'
  })
  jobProfileVideos?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ 
    type: [String], 
    required: false, 
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ],
    description: 'Array of job profile image URLs'
  })
  jobProfileImages?: string[];
} 