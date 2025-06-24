import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional, IsDate, IsBoolean, Min, Max, ValidateNested } from 'class-validator';
import { toObjectId } from 'src/core/utils/mongo.util';

export class CourseItemDto {
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: '507f1f77bcf86cd799439011',
    description: 'Course ID reference'
  })
  courseID: string;

  @IsOptional()
  @Transform(({ value }) => value ? toObjectId(value) : undefined)
  @ApiProperty({ 
    type: String, 
    required: false, 
    example: '507f1f77bcf86cd799439012',
    description: 'Prerequisite course ID reference'
  })
  coursePreReq?: string;
}

export class RoadmapDiscountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Summer Roadmap Sale 2024',
    description: 'Discount name'
  })
  discountName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'SUMMER2024',
    description: 'Discount code'
  })
  code: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 25,
    minimum: 0,
    maximum: 100,
    description: 'Discount percentage'
  })
  percentage: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Date, 
    required: true, 
    example: '2024-08-31T23:59:59.000Z',
    description: 'Discount expiration date'
  })
  expiresOn: Date;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ 
    type: Boolean, 
    required: false, 
    example: true,
    description: 'Discount status'
  })
  status?: boolean;
}

export class CreateRoadmapDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: 'Full Stack Web Development Roadmap' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Complete roadmap to become a full stack web developer from beginner to advanced' 
  })
  description: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 299.99,
    minimum: 0,
    description: 'Total price for the roadmap'
  })
  totalPrice: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 120,
    minimum: 0,
    description: 'Total hours for the roadmap'
  })
  totalHours: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ 
    type: Boolean, 
    required: false, 
    example: true,
    description: 'Roadmap status'
  })
  status?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseItemDto)
  @IsOptional()
  @ApiProperty({ 
    type: [CourseItemDto], 
    required: false,
    description: 'Array of courses with prerequisites'
  })
  courses?: CourseItemDto[];

  @ValidateNested()
  @Type(() => RoadmapDiscountDto)
  @IsOptional()
  @ApiProperty({ 
    type: RoadmapDiscountDto, 
    required: false,
    description: 'Roadmap discount information'
  })
  discount?: RoadmapDiscountDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ 
    type: [String], 
    required: false, 
    example: [
      'Learn HTML, CSS, and JavaScript fundamentals',
      'Master React.js and Node.js',
      'Build real-world projects',
      'Get job-ready skills'
    ],
    description: 'Array of learning path highlights'
  })
  learningPathHighlights?: string[];
} 