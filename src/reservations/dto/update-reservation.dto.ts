import { IsDateString, IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { IsBefore } from '../validators';

export class UpdateReservationDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsDateString()
  @IsOptional()
  reservationDate?: Date;

  @IsDateString()
  @IsOptional()
  @IsBefore('endTime', { message: 'startTime must be before endTime' })
  startTime?: Date;

  @IsDateString()
  @IsOptional()
  endTime?: Date;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;
}
