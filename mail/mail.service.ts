import { Inject, Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { MAIL_MODULE_OPTIONS } from './mail.constants';
import { EmailRequest, EmailResponse, MailModuleOptions } from './interfaces';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    @Inject(MAIL_MODULE_OPTIONS) readonly options: MailModuleOptions,
  ) {}

  /** 
  * Send new email via nodemailer using payload *
    @param {EmailRequest} emailObject 
   creation payload * 
    @return {Promise<EmailResponse>}
    */
  public async sendEmail(emailObject: EmailRequest): Promise<EmailResponse> {
    const response: EmailResponse = { status: 'success', error: null };
    try {
      emailObject.from = 'NextOne <no-reply@nextone.com>';

      const getTransporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: this.options.mail,
          pass: this.options.password,
        },
      });

      this.verifyTransporter(getTransporter);
      await getTransporter.sendMail(emailObject);
    } catch (error) {
      this.logger.error({ error });
      response.status = 'failed';
      if (error.response) {
        response.error = error.response.body;
      } else {
        response.error = error.toString();
      }
    }

    return response;
  }

  private verifyTransporter(getTransporter) {
    getTransporter.verify((error) => {
      if (error) {
        this.logger.error('Error verifying transporter:', error);
      } else {
        this.logger.verbose('Transporter is ready to send emails');
      }
    });
  }
}
