import { IsString, IsEmail, IsEnum, IsNotEmpty, Length } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 60)
    identificationNumber: string;
  
    @IsNotEmpty()
    @IsEmail()
    @Length(1, 60)
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(1, 60)
    names: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(1, 60)
    lastNames: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(1, 60)
    password: string;
  
    @IsEnum(UserRole)
    role: UserRole;
}
