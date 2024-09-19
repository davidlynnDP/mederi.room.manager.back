import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { RoomType } from '@prisma/client';
import { Type } from 'class-transformer';
import { UpdateRoomResourceDto } from './update-room-resource.dto';

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1, { message: 'La capacidad de la sala debe ser al menos 1' })
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(RoomType, { message: 'Tipo de sala no válido' })
  @IsOptional()
  roomType?: RoomType;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;


  @ValidateNested({ each: true })
  @Type(() => UpdateRoomResourceDto)
  @IsOptional()
  resources?: UpdateRoomResourceDto[];
}
