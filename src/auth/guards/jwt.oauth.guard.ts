import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtOauthGuard extends AuthGuard('jwt') implements CanActivate {

  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const authenticationToken = this.extractTokenFromHeader(request);

    try {
      const { user } = await this.authService.verifyToken(authenticationToken);

      if (!user)
        throw new UnauthorizedException(`Token not valid`)

      if (!user.isActive)
        throw new UnauthorizedException(`User is inactive, talk with an admin`);

      const reqUser = {
        id: user.id,
        email: user.email,
        names: user.names,
        lastNames: user.lastNames,
        role: user.role,
      }
      
      request['user'] = reqUser;

    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}