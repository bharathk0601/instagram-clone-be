import { JwtModuleOptions } from '@nestjs/jwt';
import { config } from './config';

export const JwtConfig: JwtModuleOptions = {
  global: true,
  privateKey: config.get('JWT_PRIVATE_KEY'),
  publicKey: config.get('JWT_PUBLIC_KEY'),
  signOptions: {
    algorithm: 'RS256',
    expiresIn: '30d',
  },
};
