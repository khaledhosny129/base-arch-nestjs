import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class Verify2faDto {
  @IsEmail()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'email@example.com',
    description: 'Email address of the user'
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: '123456',
    description: '6-digit verification code sent to email'
  })
  code: string;
} 