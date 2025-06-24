import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, IsEnum, IsNumber, IsOptional, IsDate, Min, ValidateNested } from 'class-validator';
import { toObjectId } from 'src/core/utils/mongo.util';
import { CourseDomain } from '../enums/course-domain.enum';
import { Currency } from '../enums/currency.enum';

export class PriceDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Number, 
    required: true, 
    example: 99.99,
    minimum: 0,
    description: 'Price amount'
  })
  price: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    enum: Currency,
    example: Currency.USD,
    description: 'Currency type'
  })
  currency: Currency;
}

export class DiscountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Summer Sale 2024',
    description: 'Discount name'
  })
  discountName: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Date, 
    required: true, 
    example: '2024-06-01T00:00:00.000Z',
    description: 'Discount start date'
  })
  from: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ 
    type: Date, 
    required: true, 
    example: '2024-08-31T23:59:59.000Z',
    description: 'Discount end date'
  })
  to: Date;
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: 'Advanced JavaScript Programming' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Master advanced JavaScript concepts including ES6+, async programming, and modern frameworks' 
  })
  description: string;

  @IsArray()
  @Transform(({ value }) => value.map(toObjectId))
  @IsOptional()
  @ApiProperty({ 
    type: [String], 
    required: false, 
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    description: 'Array of Skill IDs'
  })
  skills?: string[];

  @IsEnum(CourseDomain)
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    enum: CourseDomain,
    example: CourseDomain.PROGRAMMING,
    description: 'Course domain/category'
  })
  courseDomain: CourseDomain;

  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: '507f1f77bcf86cd799439013',
    description: 'Category ID reference'
  })
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ 
    type: String, 
    required: false, 
    example: 'https://moodle.example.com/course/view.php?id=123',
    description: 'Moodle course URL'
  })
  moodleCourse?: string;

  @ValidateNested()
  @Type(() => PriceDto)
  @IsNotEmpty()
  @ApiProperty({ 
    type: PriceDto, 
    required: true,
    description: 'Local price information'
  })
  localPrice: PriceDto;

  @ValidateNested()
  @Type(() => PriceDto)
  @IsNotEmpty()
  @ApiProperty({ 
    type: PriceDto, 
    required: true,
    description: 'Foreign price information'
  })
  foreignPrice: PriceDto;

  @ValidateNested()
  @Type(() => DiscountDto)
  @IsOptional()
  @ApiProperty({ 
    type: DiscountDto, 
    required: false,
    description: 'Discount information'
  })
  discount?: DiscountDto;
} 