import { Injectable, OnModuleInit } from '@nestjs/common';
import * as kickbox from 'kickbox';
import * as nodemailer from 'nodemailer';

import config from '@/config/config';
import { NodeMailerConfig } from '@/config/mailer.config';
import { MailOptions } from '@/shared/interfaces';

@Injectable()
export class MailerService implements OnModuleInit {
  private kickBox;
  private transporter;

  onModuleInit() {
    this.kickBox = kickbox.client(config.get('KICK_BOX_API_KEY')).kickbox();
    this.transporter = new nodemailer.createTransport(NodeMailerConfig);
  }

  /**
   *
   * @param {string} email
   * @returns {boolean}
   */
  public async isEmailValid(email: string): Promise<boolean> {
    if (config.get('BYPASS_EMAIL_EXISTENCE_CHECK')) {
      return true;
    }

    return new Promise((resolve, reject) => {
      this.kickBox.verify(email, {}, (err, res) => {
        if (err) return reject(err);

        resolve(res?.body?.result === 'deliverable');
      });
    });
  }

  /**
   *
   * @param {MailOptions} mailOptions
   * @returns
   */
  private async sendEmail(mailOptions: MailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return reject(error);
        }

        return resolve(info.response);
      });
    });
  }
}
