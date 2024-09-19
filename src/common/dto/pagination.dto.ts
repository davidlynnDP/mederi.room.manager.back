import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';

enum ReservationStatus {
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
  PENDIENTE = 'PENDIENTE',
}

export class PaginationDto {

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Boolean)
  isAvailable?: boolean = true;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus = ReservationStatus.PENDIENTE;

}