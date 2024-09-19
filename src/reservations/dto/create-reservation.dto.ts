import { IsDateString, IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { IsBefore } from '../validators';

export class CreateReservationDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  @IsNotEmpty()
  reservationDate: Date;

  @IsDateString()
  @IsNotEmpty()
  @IsBefore('endTime', { message: 'startTime must be before endTime' })
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;
}
