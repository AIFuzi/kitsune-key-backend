import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

import { UserRoleType } from '@prisma/generated/enums'

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  password: string

  @IsString()
  @IsNotEmpty()
  @Length(2, 26)
  name: string

  @IsString()
  @IsNotEmpty()
  @Length(2, 3600)
  @IsOptional()
  aboutMe: string

  @IsString()
  @IsNotEmpty()
  birthday: string

  @IsOptional()
  @IsString()
  userRole: UserRoleType
}
