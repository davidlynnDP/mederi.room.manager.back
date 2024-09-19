import { IsString, IsEmail, IsEnum, IsOptional, Length, IsBoolean } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 60) 
  identificationNumber?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 60) 
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 60) 
  names?: string;

  @IsOptional()
  @IsString()
  @Length(1, 60) 
  lastNames?: string;

  @IsOptional()
  @IsString()
  @Length(1, 60) 
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
