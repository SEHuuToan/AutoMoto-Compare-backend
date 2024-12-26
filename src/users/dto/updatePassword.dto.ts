import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(5)
  @MaxLength(32)
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(5)
  @MaxLength(32)
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @MinLength(5)
  @MaxLength(32)
  @IsNotEmpty()
  confirmPassword: string;
}
