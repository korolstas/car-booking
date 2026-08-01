import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@prisma';
import { AllExceptionsFilter } from '@common/filters';

import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from './throttler/throttler.module';

@Module({
  imports: [ThrottlerModule, MailModule, PrismaModule, AuthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
