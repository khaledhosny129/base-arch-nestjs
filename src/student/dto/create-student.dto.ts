import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { EducationalLevelEnum } from '../enums/education-level.enum';
import { toObjectId } from 'src/core/utils/mongo.util';

class EducationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'MIT', description: 'Institute name' })
  institute: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: 2020, description: 'Graduation year' })
  year: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Computer Science', description: 'Degree name' })
  degree: string;
}

class JobHistoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Google', description: 'Company name' })
  company: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Software Engineer', description: 'Job position' })
  position: string;

  @IsString()
  @ApiProperty({ type: String, example: '2020-01-01', description: 'Start date (YYYY-MM-DD)' })
  from: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: '2023-01-01', description: 'End date (YYYY-MM-DD)', required: false })
  to?: string;
}

class PerformanceDto {
  @IsNumber()
  @ApiProperty({ type: Number, example: 85, description: 'Commitment level (0-100)' })
  commitment: number;
}

export class CreateStudentDto {
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  @ApiProperty({ type: String, example: '507f1f77bcf86cd799439011', description: 'User ID reference' })
  userId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  @ApiProperty({ type: [EducationDto], description: 'Education history', required: false })
  education?: EducationDto[];

  @IsOptional()
  @IsEnum(EducationalLevelEnum)
  @ApiProperty({ enum: EducationalLevelEnum, example: EducationalLevelEnum.BACHELOR, required: false })
  educationalLevel?: EducationalLevelEnum;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobHistoryDto)
  @ApiProperty({ type: [JobHistoryDto], description: 'Job history', required: false })
  jobHistory?: JobHistoryDto[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value?.map((id: string) => Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id))
  @ApiProperty({ type: [String], example: ['507f1f77bcf86cd799439011'], description: 'Assigned learning path IDs', required: false })
  assignedLearningPath?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value?.map((id: string) => Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id))
  @ApiProperty({ type: [String], example: ['507f1f77bcf86cd799439011'], description: 'Assessment history IDs', required: false })
  assessmentsHistory?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PerformanceDto)
  @ApiProperty({ type: PerformanceDto, description: 'Performance metrics', required: false })
  performance?: PerformanceDto;
} 