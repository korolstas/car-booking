import { ThrottlerModule as Throttler } from '@nestjs/throttler';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    Throttler.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
})
export class ThrottlerModule {}
