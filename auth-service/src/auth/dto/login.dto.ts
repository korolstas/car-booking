import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный формат email адреса' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  readonly email!: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  readonly password!: string;
}
