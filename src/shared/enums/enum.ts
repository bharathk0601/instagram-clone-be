export enum Environment {
  development = 'development',
  staging = 'staging',
  production = 'production',
}

export enum Econfig {
  ENVIRONMENT = 'ENVIRONMENT',

  POSTGRES_HOST = 'POSTGRES_HOST',
  POSTGRES_PORT = 'POSTGRES_PORT',
  POSTGRES_USER = 'POSTGRES_USER',
  POSTGRES_PASSWORD = 'POSTGRES_PASSWORD',
  POSTGRES_DATABASE = 'POSTGRES_DATABASE',

  THROTTLE_LIMIT = 'THROTTLE_LIMIT',
  THROTTLE_TTL = 'THROTTLE_TTL',

  CLOUDINARY_API_KEY = 'CLOUDINARY_API_KEY',
  CLOUDINARY_API_SECRET = 'CLOUDINARY_API_SECRET',
  CLOUD_NAME = 'CLOUD_NAME',
}

export type TConfig = `${Econfig}`;

export enum Folders {
  BASE_PATH = 'instagram-clone-be',
  PRIFILE_PIC = 'profile-pic',
}

export enum FileTypes {
  IMAGE = 'image',
}
