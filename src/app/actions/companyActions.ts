import { fetchWrapper } from '@/lib/fetchWrapper';
import { Company } from '@/types';

export async function getCompanyById(id: number): Promise<Company> {
  return fetchWrapper.get<Company>(`/company/${id}`);
}

export async function getCompanyByUserId(userId: number): Promise<Company> {
  return fetchWrapper.get<Company>(`/company/user/${userId}`);
}

export async function createCompany(company: Partial<Company>): Promise<Company> {
  return fetchWrapper.post<Company>('/company', company);
}

export async function updateCompany(id: number, company: Partial<Company>): Promise<Company> {
  return fetchWrapper.put<Company>(`/company/${id}`, company);
}

export async function deleteCompany(id: number): Promise<void> {
  return fetchWrapper.del<void>(`/company/${id}`);
}
