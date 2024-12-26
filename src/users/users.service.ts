import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from './roles/role.enum';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { validate } from 'class-validator';
import {
  hashPassword,
  comparePassword,
} from '../common/hashPassword/hashPassword.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  // async getRoleUser(): Promise<User[]>{
  //   return this.userModel.find({users: Role.users}).exec();
  // }
  // async getRoleAdmin(): Promise<User[]>{
  //   return this.userModel.find({admin: Role.admin}).exec();
  // }

  findByUsername = async (userName: string): Promise<User> => {
    const foundUser = this.userModel.findOne({ userName }).exec();
    try {
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
      return foundUser;
    } catch (error) {
      throw new Error('Something wrong when find this userName.');
    }
  };

  async getUserById(_id: string): Promise<User> {
    const id = new Types.ObjectId(_id);
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`This User with id: ${_id} not found`);
    }
    return user as UserDocument;
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      const conflictUser = await this.userModel
        .findOne({
          $or: [
            { userName: createUserDto.userName },
            { email: createUserDto.email },
          ],
        })
        .exec();
      if (conflictUser) {
        throw new ConflictException('UserName or Email is existed!');
      }
      const hashedPassword = await hashPassword(createUserDto.password);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        time: new Date(),
      });
      await createdUser.save();
      return { message: 'User created successfully!' };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('UserName or Email is existed!');
      }
      throw error;
    }
  }

  async updateUser(
    _updateUser: UpdateUserDto,
    _id: string,
  ): Promise<{ message: string; user: User }> {
    try {
      const foundUser = await this.getUserById(_id);
      const updateUser = await this.userModel
        .findByIdAndUpdate(foundUser, _updateUser, { new: true })
        .exec();
      if (!updateUser) {
        throw new Error('Failed to update the user');
      }
      await updateUser.save();
      return { message: 'Update user successfully!', user: updateUser };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(
          `Something went wrong when updating user: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async updatePassword(
    _id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    try {
      const errors = await validate(updatePasswordDto);
      if (errors.length > 0) {
        throw new Error('Validation failed for password fields.');
      }
      const foundUser = (await this.getUserById(_id)) as UserDocument;
      const isMath = await comparePassword(
        updatePasswordDto.oldPassword,
        foundUser.password,
      );
      if (!isMath) {
        throw new ConflictException('Old password is incorrect');
      }
      if (updatePasswordDto.oldPassword === updatePasswordDto.newPassword) {
        throw new ConflictException(
          'Your new password can not be the same as the old password',
        );
      }
      if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
        throw new ConflictException(
          'New password and confirm password do not match',
        );
      }
      const hashedPassword = await hashPassword(
        updatePasswordDto.confirmPassword,
      );
      foundUser.password = hashedPassword;
      await foundUser.save();
      return { message: 'Change password successfully!' };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(
          `Something went wrong when updating password: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async deleteUser(
    currentUserRole: Role,
    _id: string,
  ): Promise<{ message: string }> {
    try {
      const foundUser = await this.getUserById(_id);
      if (currentUserRole !== Role.admin) {
        throw new Error('Only Admin have access to delete user!');
      }
      if (foundUser.status) {
        await this.userModel
          .findByIdAndUpdate(_id, { status: false }, { new: true })
          .exec();
        return { message: 'You have banned this account!' };
      } else {
        await this.userModel.findByIdAndDelete(_id).exec();
        return { message: 'Delete peramently this user succesfully!' };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Something went wrong when updating user: ${error.message}`,
      );
    }
  }
}
