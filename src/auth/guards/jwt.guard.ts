import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '../../common/utils/auth.util';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token is required for authentication');
    }

    try {
      // Xác minh token bằng utility
      const payload = verifyToken(token, 'access');
      request['user'] = payload; // Gắn payload vào request để sử dụng sau này
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true; // Nếu không lỗi thì cho phép truy cập
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
