import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  password: string
}
