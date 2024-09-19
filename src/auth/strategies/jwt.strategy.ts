import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

import { envs } from "src/config";
import { JwtPayload } from "../interfaces";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtOauthStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envs.jwtConstantSecret,
        });
    }

    async validate(payload: JwtPayload) {
        const { id } = payload;

        const user = await this.usersService.findOneUser({ id });

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

        return reqUser;
    }
}