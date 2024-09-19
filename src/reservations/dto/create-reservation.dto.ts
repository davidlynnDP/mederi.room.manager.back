import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
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
  reservationDate: string;

  @IsDateString()
  @IsNotEmpty()
  @IsBefore('endTime', { message: 'startTime must be before endTime' })
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}
