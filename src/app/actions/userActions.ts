import { fetchWrapper } from '@/lib/fetchWrapper';
import { UserDto } from '@/types';

export async function getUserByEmail(email: string): Promise<UserDto> {
  return fetchWrapper.get<UserDto>(`/user/${email}`);
}

export async function createUser(user: Partial<UserDto>): Promise<UserDto> {
  return fetchWrapper.post<UserDto>('/user', user);
}

export async function updateUser(id: number, user: Partial<UserDto>): Promise<UserDto> {
  return fetchWrapper.put<UserDto>(`/user/${id}`, user);
}

export async function deleteUser(id: number): Promise<void> {
  return fetchWrapper.del<void>(`/user/${id}`);
}
