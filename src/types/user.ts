export enum AccountType {
  Student = 0,
  Company = 1,
}

export interface UserDto {
  id: number;
  email: string;
  vorname?: string;
  nachname?: string;
  accountType: AccountType;
  companyId?: number;
  studentId?: number;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface User {
  id: number;
  email: string;
  vorname?: string;
  nachname?: string;
  accountType: AccountType;
  companyId?: number;
  studentId?: number;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CognitoUser {
  username: string;
  email: string;
  emailVerified: boolean;
  attributes: Record<string, string>;
}
