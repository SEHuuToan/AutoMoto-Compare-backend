import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
// import { Role } from 'src/users/roles/role.enum';
import { User, UserDocument } from '../users/entities/user.entity';
import { comparePassword } from '../common/hashPassword/hashPassword.service';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from 'src/common/utils/auth.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login = async (loginDto: LoginDto) => {
    const { userName, password } = loginDto;
    try {
      const user = await this.usersService.findByUsername(userName);
      if (!user) {
        throw new UnauthorizedException('Invalid username or password!');
      }
      const isMatchPassword = await comparePassword(password, user?.password);
      if (!isMatchPassword) {
        throw new UnauthorizedException('Invalid username or password!');
      }
      const accessToken = generateAccessToken(
        user.userName,
        user.role,
        user._id.toString(),
      );
      const refreshToken = generateRefreshToken(
        user.userName,
        user.role,
        user._id.toString(),
      );

      return { accessToken, refreshToken };
    } catch (error) {
      console.log('error: ', error);
      throw new Error('Something wrong with login service!!!');
    }
  };
  refreshToken = async (refreshToken: string) => {
    try {
      const decoded = verifyToken(refreshToken, 'refresh');
      const user = await this.usersService.findByUsername(decoded.username);
      if (!user) {
        throw new UnauthorizedException('Invalid token: User not found');
      }
      const accessToken = generateAccessToken(
        user.userName,
        user.role,
        user._id.toString(),
      );
      return accessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  };
}
