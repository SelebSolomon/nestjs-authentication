import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'reynold57@ethereal.email',
        pass: 'N5CDF1qc9NW6APrhJ5',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: 'backend auth server',
      to: to,
      subject: 'password reset request',
      html: `
      <p>hellow boy</p>
      <p> click the link to reset your password </p>
      <a href=${resetLink}> Reset Link </a>
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
