import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  controllers: [
    ReservationsController
  ],
  providers: [
    ReservationsService
  ],
  imports: [
    CommonModule,
    UsersModule,
    RoomsModule
  ]
})
export class ReservationsModule {}
