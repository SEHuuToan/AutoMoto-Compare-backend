// users.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from './roles/role.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { User } from './entities/user.entity';

@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('admin')
  // // @Roles(Role.admin)
  // async findAdminUsers(): Promise<User[]> {
  //   return this.usersService.getRoleAdmin();
  // }

  // @Get('users')
  // // @Roles(Role.admin)
  // async findGuestUsers(): Promise<User[]> {
  //   return this.usersService.getRoleUser();
  // }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  async findAllUser(): Promise<User[]> {
    return this.usersService.getAllUser();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  async findUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post('sign-up')
  async create(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.usersService.createUser(createUserDto);
  }

  @Put('update-information/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    // @Query('currentUserRole') currentUserRole: Role
  ): Promise<{ message: string; user: User }> {
    return this.usersService.updateUser(updateUserDto, id);
  }

  @Put('update-password/:id')
  @Roles(Role.admin, Role.users)
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete('delete/:id')
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('id') id: string,
    @Query('currentUserRole') currentUserRole: Role,
  ): Promise<{ message: string }> {
    return this.usersService.deleteUser(currentUserRole, id);
  }
}
