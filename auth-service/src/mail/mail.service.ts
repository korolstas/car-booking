import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  [x: string]: any;
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Подтверждение регистрации',
      html: `
        <h3>Добро пожаловать!</h3>
        <p>Для подтверждения вашего email нажмите на кнопку:</p>
        <a href="${url}"><button>Подтвердить</button></a>
      `,
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Сброс пароля',
      html: `
        <h3>Сброс пароля</h3>
        <p>Вы запросили сброс пароля. Для установки нового пароля перейдите по ссылке ниже:</p>
        <p><a href="${url}">${url}</a></p>
        <p>Ссылка действительна в течение 15 минут.</p>
      `,
    });
  }
}
