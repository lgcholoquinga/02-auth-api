import { UserResponse } from './user.interface';

export interface RegisterUser {
  user: UserResponse;
  token?: string;
}
