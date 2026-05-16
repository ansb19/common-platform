import { SendEmailParams } from './send-email-params.interface';

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<void>;
}