import { Econfig, TConfig, Environment } from '@/shared/enums';
import logger from '@/shared/logger/logger';

class Config {
  private readonly ENVIRONMENT: string = process.env.ENVIRONMENT;

  private readonly POSTGRES_HOST: string = process.env.POSTGRES_HOST;
  private readonly POSTGRES_PORT: number = Number(process.env.POSTGRES_PORT);
  private readonly POSTGRES_USER: string = process.env.POSTGRES_USER;
  private readonly POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD;
  private readonly POSTGRES_DATABASE: string = process.env.POSTGRES_DATABASE;

  private readonly REDIS_URL: string = process.env.REDIS_URL;

  private readonly THROTTLE_LIMIT: number = 20;
  private readonly THROTTLE_TTL: number = 1000;

  private readonly CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY;
  private readonly CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET;
  private readonly CLOUD_NAME: string = process.env.CLOUD_NAME;

  private readonly KICK_BOX_API_KEY: string = process.env.KICK_BOX_API_KEY;

  private readonly NODE_MAILER_USER: string = process.env.NODE_MAILER_USER;
  private readonly NODE_MAILER_PASS: string = process.env.NODE_MAILER_PASS;

  private readonly BYPASS_EMAIL_EXISTENCE_CHECK: boolean = process.env.BYPASS_EMAIL_EXISTENCE_CHECK === 'TRUE';

  constructor() {
    switch (this.ENVIRONMENT) {
      case Environment.DEVELOPMENT:
        break;
      case Environment.STAGING:
        break;
      case Environment.PRODUCTION:
        this.BYPASS_EMAIL_EXISTENCE_CHECK = false;
        break;
    }

    const configKeys = Object.keys(this);
    for (const key of Object.values(Econfig)) {
      if (!configKeys.includes(key)) {
        logger.warn(`${key} is not present in config class.`);
      }
    }
  }

  public get<T>(key: TConfig): T {
    return <T>this[key];
  }

  public isDev(): boolean {
    return this.ENVIRONMENT === Environment.DEVELOPMENT;
  }

  public isStaging(): boolean {
    return this.ENVIRONMENT === Environment.STAGING;
  }

  public isProd(): boolean {
    return this.ENVIRONMENT === Environment.PRODUCTION;
  }
}

export const config = new Config();
