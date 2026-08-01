import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

export const SECRET = process.env.JWT_SECRET || 'super_secret_key';
export const EXPIRES_IN = '3h';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: SECRET,
      signOptions: { expiresIn: EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
