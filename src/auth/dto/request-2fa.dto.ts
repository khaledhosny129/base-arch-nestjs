import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Request2faDto {
  @IsEmail()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'email@example.com',
    description: 'Email address to send 2FA code to'
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ 
    type: String, 
    required: true, 
    example: 'P@ssw0rd',
    description: 'User password for verification'
  })
  password: string;
} 