import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string

  @IsOptional()
  @IsString()
  pin?: string
}
