import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  email: string;
  [key: string]: unknown;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (data && user) {
      return user[data];
    }

    return user;
  },
);
