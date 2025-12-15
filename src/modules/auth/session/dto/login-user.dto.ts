import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  password: string

  @IsNumber()
  @Length(6)
  @IsOptional()
  totp: number
}
