import { IsNotEmpty } from 'class-validator';
import { BaseUserDto } from './baseUsers.dto';
import { Role } from 'src/users/roles/role.enum';
export class CreateUserDto extends BaseUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  role: Role.users; // Bắt buộc role khi tạo user mới là users
}
