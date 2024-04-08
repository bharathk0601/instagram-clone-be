import { Econfig, Environment } from '@/shared/enums';
import { IConfig, TConfig } from '@/shared/interfaces';
import logger from '@/shared/logger/logger';

class Config implements IConfig {
  private readonly ENVIRONMENT: string = process.env.ENVIRONMENT;
  private readonly POSTGRES_HOST: string = process.env.POSTGRES_HOST;
  private readonly POSTGRES_PORT: number = Number(process.env.POSTGRES_PORT);
  private readonly POSTGRES_USER: string = process.env.POSTGRES_USER;
  private readonly POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD;
  private readonly POSTGRES_DATABASE: string = process.env.POSTGRES_DATABASE;
  private readonly THROTTLE_LIMIT: number = 10;
  private readonly THROTTLE_TTL: number = 5000;

  constructor() {
    switch (this.ENVIRONMENT) {
      case Environment.development:
        break;
      case Environment.staging:
        this.THROTTLE_LIMIT = 200;
        this.THROTTLE_TTL = 5000;
        break;
      case Environment.production:
        break;
    }
  }

  public get<T>(key: TConfig): T {
    return <T>this[key];
  }

  public isDev(): boolean {
    return this.ENVIRONMENT === Environment.development;
  }

  public isStaging(): boolean {
    return this.ENVIRONMENT === Environment.staging;
  }

  public isProd(): boolean {
    return this.ENVIRONMENT === Environment.production;
  }
}

const config = new Config();

for (const key of Object.values(Econfig)) {
  if (!config[key]) {
    logger.warn(`${key} is not present in config class.`);
  }
}

export default config;
