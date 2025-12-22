import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateProfileInfoDto {
  @IsString()
  @IsOptional()
  @Length(2, 26)
  name: string

  @IsString()
  @IsOptional()
  @Length(0, 500)
  aboutMe: string

  @IsString()
  @IsOptional()
  birthday: string

  @IsString()
  @IsOptional()
  @Length(0, 64)
  liveIn: string

  @IsString()
  @IsOptional()
  @Length(0, 64)
  workingIn: string
}
