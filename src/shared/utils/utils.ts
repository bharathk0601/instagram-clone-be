import * as crypto from 'crypto';
import { ObjectLiteral } from '../interfaces/interface';

export class Utils {
  /**
   *
   * @param {any} value
   * @returns {boolean}
   */
  public static isNil(value: any): boolean {
    return value === null || value === undefined;
  }

  /**
   *
   * @returns {string}
   */
  public static genUUID(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   *
   * @param {unknown} data
   * @returns {boolean}
   */
  public static isObj(data: unknown) {
    return typeof data === 'object' && data !== null;
  }

  /**
   *
   * @param {string} obj
   */
  public static stringify(obj: any): string {
    if (obj instanceof Error) {
      return this.formatErr(obj);
    }

    if (this.isObj(obj)) {
      return JSON.stringify(obj);
    }

    if (this.isNil(obj)) {
      return obj;
    }

    return obj?.toString();
  }

  /**
   *
   * @param {any} value
   * @returns {unknown}
   */
  public static defaultMask(value: any): null | undefined | object | string {
    if (Utils.isNil(value)) {
      return value;
    }
    if (Array.isArray(value)) {
      return [];
    }
    if (typeof value === 'object') {
      return {};
    }
    return '*'.repeat(value?.toString().length);
  }

  /**
   *
   * @param {ObjectLiteral} obj
   * @param {string[]} fields
   * @param {Function} maskFn
   * @return {string}
   */
  public static maskObj(obj: ObjectLiteral, fields: string[], maskFn = this.defaultMask) {
    const replacerFn = fields?.length ? (key, value) => (fields.includes(key) ? maskFn(value) : value) : null;
    return JSON.stringify(obj, replacerFn);
  }

  /**
   *
   * @param {Error} error
   * @returns {string}
   */
  public static formatErr(error: Error): string {
    if (error instanceof Error) {
      return `error | ${error.toString()} | stack | ${error.stack}`;
    }
  }
}
