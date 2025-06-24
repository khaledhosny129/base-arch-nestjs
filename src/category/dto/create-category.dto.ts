import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: 'Programming Languages' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Various programming languages and frameworks' 
  })
  description: string;
} 