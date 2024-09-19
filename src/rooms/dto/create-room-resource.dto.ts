import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoomResourceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del recurso es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La categoría del recurso es obligatoria' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción del recurso es obligatoria' })
  description: string;
}
