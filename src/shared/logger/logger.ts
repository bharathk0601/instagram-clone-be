import { LoggerService as ILogger } from '@nestjs/common';
import { logger } from './winston.config';
import { Utils } from '@/shared/utils';

export class Logger implements ILogger {
  private context: string = '';

  constructor(context?: string) {
    this.context = context || '';
  }

  /**
   *
   * @param {string} context
   */
  public updateContext(context: string) {
    this.context = [this.context, context].filter((item) => item).join(' | ');
  }

  /**
   *
   * @param {any} message
   * @param {string} _context
   * @param {string} stack
   * @returns {string}
   */
  private formatLog(message?: any, _context?: string, stack?: string): string {
    const log: string = [this.context, _context, Utils.stringify(message), stack].filter((item) => item).join(' | ');
    return log;
  }

  /**
   *
   * @param {string} message
   * @param {string} context
   */
  public log(message: any, context?: string): void {
    logger.info(this.formatLog(message, context));
  }

  /**
   *
   * @param {string} message
   * @param {string} stack
   * @param {string} context
   */
  public error(message: any, stack?: string, context?: string): void {
    logger.error(this.formatLog(message, context, stack));
  }

  /**
   *
   * @param {string} message
   * @param {string} context
   */
  public warn(message: any, context?: string): void {
    logger.warn(this.formatLog(message, context));
  }

  /**
   *
   * @param {string} message
   * @param {string} context
   */
  public debug(message: any, context?: string): void {
    logger.debug(this.formatLog(message, context));
  }
}

export default new Logger('defaultLogger');
