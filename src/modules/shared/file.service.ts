import { Injectable, OnModuleInit } from '@nestjs/common';

import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

import { cloudinaryConfig } from '@/config';
import { Folders } from '@/shared/enums';

@Injectable()
export class FileService implements OnModuleInit {
  constructor() {}

  onModuleInit() {
    cloudinary.config(cloudinaryConfig);
  }

  /**
   *
   * @param {string} flie
   * @param {Folders} folder
   * @returns {UploadApiResponse}
   */
  private async upload(flie: string, folder: Folders): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(flie, {
      resource_type: 'auto',
      folder: `${Folders.BASE_PATH}/${folder}`,
    });
  }

  /**
   *
   * @param {string} profilePic
   * @returns {UploadApiResponse}
   */
  public async uploadProfilePic(profilePic: string, ctx: ReqCtx | Ctx) {
    const result = await this.upload(profilePic, Folders.PRIFILE_PIC);
    ctx.logger.log(`result | ${JSON.stringify(result)}`, 'FileService | uploadProfilePic');

    return { url: result.url, publicId: result.public_id };
  }

  /**
   *
   * @param {string} publicId
   * @returns {boolean}
   */
  public async deleteFile(publicId: string, ctx: ReqCtx | Ctx): Promise<boolean> {
    const result = await cloudinary.uploader.destroy(publicId);
    ctx.logger.log(`result | ${JSON.stringify(result)}`, 'FileService | deleteFile');

    return result?.result === 'ok';
  }
}
