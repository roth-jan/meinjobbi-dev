import { Student, User, Company, AccountType } from '@/types';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  errorMessage?: string;
  token: string;
  user?: User;
  student?: Student;
  company?: Company;
}

export interface AuthUser {
  user: User;
  student?: Student;
  token: string;
}

export interface EmailRequest {
  jobadid: number;
  studentid: number;
  ismoreinfo: boolean;
  schoolCode: string;
}

export interface StudentRegisterRequest {
  email: string;
  username: string;
  accounttype: AccountType;
  firstname: string;
  lastname: string;
  dateofbirth: string;
  school: string;
  graduationyear?: number;
  password: string;
  gender: string;
  interests: string;
  parentemail?: string;
}

export interface CompanyRegisterRequest {
  name: string;
  postalcode: string;
  location: string;
  address: string;
  iIndustry: string;
  companysize: string;
  firstname: string;
  lastname: string;
  accounttype: AccountType;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  cognitoRegistered?: boolean;
  emailSent?: boolean;
  mail?: string;
  message: string;
  parentEmailUsed?: string;
  emailSentTo?: string;
}

export interface ChangeInterestsRequest {
  interests: string;
}

export interface ChangePasswordRequest {
  userId: number;
  newPassword: string;
  email: string;
}
