import { UserResponse } from './user.interface';

export interface LoginResponse {
  user: UserResponse;
  token: string;
}
