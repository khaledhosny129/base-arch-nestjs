import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';


export class SignupDto {
  @IsEmail()
  @ApiProperty({ type: String, required: true, example: 'email@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: 'John' })
  name: string;

  @IsStrongPassword()
  @ApiProperty({ type: String, required: true, example: 'P@ssw0rd' })
  password: string;

  // @IsEnum(RoleEnum)
  // @ApiProperty({
  //   type: String,
  //   required: true,
  //   enum: RoleEnum,
  //   example: RoleEnum.ORG_ADMIN,
  // })
  // role: string;
}
