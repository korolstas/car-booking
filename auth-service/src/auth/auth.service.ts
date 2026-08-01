import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { PrismaService } from '@prisma';

import { RegisterDto, LoginDto, VerifyEmailDto, ResetPasswordDto } from './dto';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SECRET } from './auth.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private createBcryptHash = async (value: string): Promise<string> => {
    const saltRounds = 10;

    return await bcrypt.hash(value, saltRounds);
  };

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: SECRET,
      }),
      this.jwtService.signAsync(payload, {
        secret: SECRET,
        expiresIn: '7d',
      }),
    ]);

    const hash = await this.createBcryptHash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

    return { message: 'Вы успешно вышли из системы' };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await this.createBcryptHash(dto.password);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
      },
    });

    try {
      await this.mailService.sendVerificationEmail(
        user.email,
        verificationToken,
      );
    } catch (e) {
      console.error('Ошибка отправки письма:', e);
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      message:
        'Регистрация прошла успешно. Проверьте почту для подтверждения email.',
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!existingUser) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isMatch = await bcrypt.compare(dto.password, existingUser.password);

    if (!isMatch) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const tokens = await this.generateTokens(
      existingUser.id,
      existingUser.email,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = existingUser;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<{
      sub: number;
      email: string;
    }>(refreshToken, {
      secret: SECRET,
    });

    if (!payload) {
      throw new UnauthorizedException('Невалидный или истекший refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return tokens;
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Невалидный токен верификации');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: 'Email успешно подтвержден!' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      return {
        message:
          'Если такой email зарегистрирован, мы отправили инструкцию по сбросу пароля.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const resetPasswordExp = new Date(Date.now() + 15 * 60 * 1000);

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken,
        resetPasswordExp,
      },
    });

    try {
      await this.mailService.sendResetPasswordEmail(user.email, resetToken);
    } catch (e) {
      console.error('Ошибка отправки письма:', e);
      throw new InternalServerErrorException('Не удалось отправить письмо');
    }

    return {
      message: 'Инструкция отправлена на email',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Невалидный или истекший токен сброса пароля',
      );
    }

    const hashedPassword = await this.createBcryptHash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExp: null,
      },
    });

    return { message: 'Пароль успешно изменен' };
  }
}
