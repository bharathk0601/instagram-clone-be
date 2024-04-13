import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { config } from './config';

export const ThrottleConfig: ThrottlerModuleOptions = {
  throttlers: [{ ttl: config.get('THROTTLE_TTL'), limit: config.get('THROTTLE_LIMIT') }],
};
