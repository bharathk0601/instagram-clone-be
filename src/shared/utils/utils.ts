import * as bcrypt from 'bcrypt';
import ShortUniqueId from 'short-unique-id';

import { ObjectLiteral } from '@/shared/interfaces';
import { config } from '@/config';

export class Utils {
  private static uid = new ShortUniqueId();
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
  public static genUUID(len = 16): string {
    return this.uid.stamp(len);
  }

  /**
   *
   * @param {unknown} data
   * @returns {boolean}
   */
  public static isObj(data: unknown): boolean {
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

    const len = value?.toString().length;
    return '*'.repeat(len > 100 ? 100 : len);
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

  /**
   *
   * @param {string} base64Str
   * @returns {number} - In bytes
   */
  public static getFileSize(base64Str: string): number {
    const str = base64Str.substring(base64Str.indexOf(',') + 1);
    const decoded = atob(str);

    return decoded.length;
  }

  /**
   *
   * @param {string} base64Str
   * @returns {string}
   */
  public static getMediaType(base64Str: string): string {
    return base64Str.slice(base64Str.indexOf(':') + 1, base64Str.indexOf('/'));
  }

  /**
   *
   * @param {string} html
   * @param {object} replacer
   * @returns {string}
   */
  public static htmlValSubstituter(html: string, replacer: object) {
    for (const key in replacer) {
      html = html.replaceAll(`{${key}}`, replacer[key]);
    }

    return html;
  }

  /**
   *
   * @param {number} len
   * @returns {string}
   */
  public static genRandNo(len: number = 1): string {
    return Math.random()
      .toString()
      .slice(2, len + 2);
  }

  /**
   *
   * @param {string} val
   * @param {number} saltRound
   * @returns {Promise<string>}
   */
  public static async hash(val: string, saltRound: number = config.get('BCRYPT_SALT_ROUND')): Promise<string> {
    return await bcrypt.hash(val, saltRound);
  }

  /**
   *
   * @param  {string} plainVal
   * @param {string} hashedVal
   * @returns {Promise<boolean>}
   */
  public static async compareHash(plainVal: string, hashedVal: string): Promise<boolean> {
    return await bcrypt.compare(plainVal, hashedVal);
  }
}
