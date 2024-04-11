import { Logger } from 'src/shared/logger';

export interface ObjectLiteral {
  [key: string]: any;
}

export interface ErrDetails {
  errorMsg: string;
  stack: string;
}

/* declare global types here */

declare global {
  interface Ctx {
    logger: Logger;
  }

  interface ReqCtx extends Ctx {
    requestId: string;
    routeKey: string;
    userId?: string;
  }
}

declare module 'express' {
  interface Request {
    ctx: ReqCtx;
  }
}

/* declare global types here */
