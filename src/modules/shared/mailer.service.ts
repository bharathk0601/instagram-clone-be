import { Injectable, OnModuleInit } from '@nestjs/common';
import * as kickbox from 'kickbox';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

import { config } from '@/config';
import { NodeMailerConfig } from '@/config/mailer.config';
import { MailOptions } from '@/shared/interfaces';
import { Utils } from '@/shared/utils';

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
   * @param {ReqCtx} ctx
   * @returns {boolean}
   */
  public async isEmailValid(email: string, ctx: ReqCtx): Promise<boolean> {
    if (config.get('BYPASS_EMAIL_EXISTENCE_CHECK')) {
      return true;
    }

    return new Promise((resolve, reject) => {
      this.kickBox.verify(email, {}, (err, res) => {
        if (err) return reject(err);

        ctx.logger.log(`res | ${JSON.stringify(res)}`, 'MailerService | isEmailValid');
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

  /**
   *
   * @param {string} toEmail
   * @param {string} otp
   */
  public async verifyEmail(toEmail: string, otp: string) {
    const html = fs.readFileSync('src/templates/verify-email.html', { encoding: 'utf-8' });
    const template = Utils.htmlValSubstituter(html, { otp });
    const mailOptions = {
      to: toEmail,
      subject: 'Email Verfication OTP',
      html: template,
    };

    await this.sendEmail(mailOptions);
  }

  public async restPasswordToken(toEmail: string, tokenUrl: string) {
    const html = fs.readFileSync('src/templates/reset-password.html', { encoding: 'utf-8' });
    const template = Utils.htmlValSubstituter(html, { tokenUrl });
    const mailOptions = {
      to: toEmail,
      subject: 'Reset Password',
      html: template,
    };

    await this.sendEmail(mailOptions);
  }
}
