import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Role } from '../roles/role.enum';

export class BaseUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(16)
  userName?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(32)
  password?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(48)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  address?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  time?: Date;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
