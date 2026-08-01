import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '../constants';

export function IsPassword(): PropertyDecorator {
  return applyDecorators(
    IsString({ message: 'Пароль должен быть строкой' }),
    IsNotEmpty({ message: 'Пароль обязателен для заполнения' }),
    Matches(PASSWORD_REGEX, {
      message: PASSWORD_REGEX_MESSAGE,
    }),
  );
}
