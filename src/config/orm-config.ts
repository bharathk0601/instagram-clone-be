import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import config from '@/config/config';

export const DbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: config.get('POSTGRES_HOST'),
  port: config.get('POSTGRES_PORT'),
  username: config.get('POSTGRES_USER'),
  password: config.get('POSTGRES_PASSWORD'),
  database: config.get('POSTGRES_DATABASE'),
  entities: [],
  synchronize: false,
  ssl: !config.isDev(),
};
