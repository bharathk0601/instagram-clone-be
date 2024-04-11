import * as winston from 'winston';
import { Environment } from '../enums';
const { splat, combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} | ${level} | ${message}`;
});

const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta',
  });
};

const format = [timestamp({ format: timezoned }), splat()];
if (process.env.ENVIRONMENT === Environment.DEVELOPMENT) {
  format.push(colorize({ level: true }));
}
format.push(myFormat);

export const logger = winston.createLogger({
  format: combine(...format),
  transports: [new winston.transports.Console({ level: 'debug' })],
});
