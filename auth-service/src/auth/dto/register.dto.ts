import { IsEmail, IsNotEmpty } from 'class-validator';

import { IsPassword } from '@common/decorators';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный формат email адреса' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  readonly email!: string;

  @IsPassword()
  readonly password!: string;
}
