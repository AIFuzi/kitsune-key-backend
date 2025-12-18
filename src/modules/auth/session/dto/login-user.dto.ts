import {
  IsEmail,
  IsNotEmpty,
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

  @IsString()
  @Length(6)
  @IsOptional()
  pin: string
}
