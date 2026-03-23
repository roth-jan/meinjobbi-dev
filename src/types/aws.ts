import { UserDto } from '@/types/user';

export interface AuthResultDto {
  Success: boolean;
  Status?: string;
  IdToken?: string;
  ErrorMessage?: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  user: UserDto;
}

export interface LoginRedirectResponse {
  success: boolean;
  redirectUrl?: string;
  token?: string;
  message?: string;
}
