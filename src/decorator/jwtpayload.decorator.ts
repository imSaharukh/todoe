import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const JWTPayload = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    Logger.log(request.user);

    if (!request.user) {
      return null;
    }

    return request.user;
  },
);

export interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
}
