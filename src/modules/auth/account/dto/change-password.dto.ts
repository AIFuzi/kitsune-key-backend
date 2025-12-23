import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  newPassword: string

  @IsOptional()
  @IsString()
  pin?: string
}
