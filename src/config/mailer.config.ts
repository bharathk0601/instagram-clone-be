import { config } from '@/config';

export const NodeMailerConfig = {
  service: 'gmail',
  auth: {
    user: config.get('NODE_MAILER_USER'),
    pass: config.get('NODE_MAILER_PASS'),
  },
};
