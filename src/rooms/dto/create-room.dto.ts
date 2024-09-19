import { IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { RoomType } from '@prisma/client'; 
import { Type } from 'class-transformer';

import { CreateRoomResourceDto } from './create-room-resource.dto';


export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la sala es obligatorio' })
  name: string;

  @IsInt()
  @Min(1, { message: 'La capacidad de la sala debe ser al menos 1' })
  capacity: number;

  @IsString()
  @IsNotEmpty({ message: 'La ubicación de la sala es obligatoria' })
  location: string;

  @IsEnum(RoomType, { message: 'Tipo de sala no válido' })
  @IsNotEmpty({ message: 'El tipo de sala es obligatorio' })
  roomType: RoomType;

  
  @ValidateNested({ each: true })
  @Type(() => CreateRoomResourceDto)
  @IsNotEmpty({ message: 'Los recursos de la sala son obligatorios' })
  resources: CreateRoomResourceDto[];
}
