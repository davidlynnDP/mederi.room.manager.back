import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from './auth.controller';
import { envs } from 'src/config';
import { JwtOauthStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    JwtOauthStrategy
  ],
  imports: [
    UsersModule,
    CommonModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtConstantSecret,
      signOptions: { expiresIn: '30d' },
    }),
  ]
})
export class AuthModule {}
