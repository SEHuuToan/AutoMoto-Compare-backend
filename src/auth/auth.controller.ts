import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken']; // Lấy từ cookie
    if (!refreshToken) {
        throw new UnauthorizedException('No refresh token provided');
    }
    const accessToken = await this.authService.refreshToken(refreshToken);
    return { accessToken }
  }

  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    // Clear the refresh token from cookies
    res.clearCookie('refreshToken', { httpOnly: true, secure: false });
    res.status(200).json({ message: 'Logged out successfully' });
  }
}
