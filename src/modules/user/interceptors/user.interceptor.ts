import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { decode } from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];
    const user = decode(token);
    request.user = user;
    console.log(token);
    console.log(user);

    return handler.handle();
  }
}
