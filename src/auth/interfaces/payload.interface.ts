import { Role } from 'src/users/roles/role.enum';

export interface JwtPayload {
  userName: string;
  role: Role;
  id: string;
}
