import { IsPassword } from '@common/decorators';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Токен обязателен' })
  token!: string;

  @IsPassword()
  newPassword!: string;
}
