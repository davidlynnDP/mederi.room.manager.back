import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [
    UsersController
  ],
  providers: [
    UsersService
  ],
  exports: [
    UsersService
  ],
  imports: [
    CommonModule
  ]
})
export class UsersModule {}
