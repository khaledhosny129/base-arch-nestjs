import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { RoleEnum } from 'src/users/enums/role.enum';


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

  @IsEnum(RoleEnum)
  @ApiProperty({ type: String, required: true, example: RoleEnum.STUDENT })
  role: RoleEnum;

  // @IsEnum(RoleEnum)
  // @ApiProperty({
  //   type: String,
  //   required: true,
  //   enum: RoleEnum,
  //   example: RoleEnum.ORG_ADMIN,
  // })
  // role: string;
}
