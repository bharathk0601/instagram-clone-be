import { ConfigOptions } from 'cloudinary';
import config from '@/config/config';

export const cloudinaryConfig: ConfigOptions = {
  cloud_name: config.get('CLOUD_NAME'),
  api_key: config.get('CLOUDINARY_API_KEY'),
  api_secret: config.get('CLOUD_NAME'),
};
