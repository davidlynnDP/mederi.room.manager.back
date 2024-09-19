import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { JwtOAuthUser } from '../interfaces';

export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user as JwtOAuthUser;
    
        if ( !user ) {
          throw new InternalServerErrorException('User not found in (request)');
        }
    
        return user;
    }
);
