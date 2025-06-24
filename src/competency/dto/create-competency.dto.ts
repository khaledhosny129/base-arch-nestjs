import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompetencyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: 'JavaScript Programming' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'Ability to write and maintain JavaScript code' 
  })
  description: string;
} 