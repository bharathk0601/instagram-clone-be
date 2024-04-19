import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { Utils } from '@/shared/utils';
import { IJwtPayload } from '@/shared/interfaces';
import { redis } from '@/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   *
   * @param {string} _token
   * @param {ReqCtx} ctx
   * @returns {Promise<IJwtPayload | null>}
   */
  private async validateJwtToken(_token: string, ctx: ReqCtx): Promise<IJwtPayload | null> {
    const [prefix, token] = _token.split(' ');
    if (prefix !== 'Bearer' || !token) {
      return null;
    }

    const payload = await this.jwtService
      .verifyAsync(token)
      .then((payload) => {
        ctx.logger.log(`Jwt payload | ${JSON.stringify(payload)}`, 'JwtAuthGuard | validateJwtToken');
        return payload;
      })
      .catch((error) => {
        ctx.logger.error(`eror occued during token vaerfication token | ${token} | ${Utils.formatErr(error)}`, 'JwtAuthGuard | validateJwtToken');
      });

    return payload || null;
  }

  /**
   *
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.validateJwtToken(token, req.ctx);
    if (!payload?.userId || !payload?.tokenId) {
      throw new UnauthorizedException();
    }

    req.ctx.userId = payload.userId;
    req.ctx.logger.updateContext(`userId | ${payload.userId}`);

    const tokenId = await redis.hget(`user_${payload.userId}`, 'tokenId');
    if (tokenId !== payload.tokenId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
