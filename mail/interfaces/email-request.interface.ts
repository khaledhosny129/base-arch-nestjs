/**
 * Payload object required to send email via sendgrid.
 */
export interface EmailRequest {
  to: string | string[];
  //cc: string[];
  from: string;
  subject: string;
  text?: string;
  html: string;
  attachments?: any;
}
