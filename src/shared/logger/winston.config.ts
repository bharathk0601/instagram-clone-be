import * as winston from 'winston';
const { splat, combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} | ${level} | ${message}`;
});

const timezoned = () =>
  new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta',
  });

export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: timezoned }),
    splat(),
    colorize({
      level: true,
    }),
    myFormat,
  ),
  transports: [new winston.transports.Console({ level: 'debug' })],
});
