import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from './auth.controller';
import { envs } from 'src/config';
import { JwtOauthStrategy } from './strategies/jwt.strategy';
import { JwtOauthGuard } from './guards/jwt.oauth.guard';

@Module({
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    JwtOauthStrategy,
    JwtOauthGuard,
  ],
  imports: [
    UsersModule,
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: envs.jwtConstantSecret,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  exports: [
    AuthService,
    JwtOauthGuard
  ]
})
export class AuthModule {}
