import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(5)
  @MaxLength(16)
  readonly userName: string;

  @IsString()
  @MinLength(5)
  @MaxLength(32)
  readonly password: string;
}
