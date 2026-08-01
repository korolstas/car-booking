import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
        port: Number(process.env.MAIL_PORT) || 2525,
        auth: {
          user: process.env.MAIL_USER || 'your_user',
          pass: process.env.MAIL_PASS || 'your_pass',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
