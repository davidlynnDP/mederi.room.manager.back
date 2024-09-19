import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RoomsModule } from './rooms/rooms.module';


@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    ReservationsModule,
    RoomsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
