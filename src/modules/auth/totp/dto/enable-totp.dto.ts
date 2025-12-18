import { IsNotEmpty, IsString, Length } from 'class-validator'

export class EnableTotpDto {
  @IsString()
  @IsNotEmpty()
  secret: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  pin: string
}
