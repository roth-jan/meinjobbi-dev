import { fetchWrapper } from '@/lib/fetchWrapper';
import { Werbung } from '@/types';

export async function getAllWerbungs(): Promise<Werbung[]> {
  return fetchWrapper.get<Werbung[]>('/werbung');
}

export async function getWerbungById(id: number): Promise<Werbung> {
  return fetchWrapper.get<Werbung>(`/werbung/item/${id}`);
}

export async function getWerbungsByCompanyId(companyId: number): Promise<Werbung[]> {
  return fetchWrapper.get<Werbung[]>(`/werbung/${companyId}`);
}

export async function createWerbung(werbung: Omit<Werbung, 'id'>): Promise<Werbung> {
  return fetchWrapper.post<Werbung>('/werbung', werbung);
}

export async function updateWerbung(werbung: Werbung): Promise<Werbung> {
  return fetchWrapper.post<Werbung>('/werbung/update', werbung);
}

export async function deleteWerbung(id: number): Promise<void> {
  await fetchWrapper.del<void>(`/werbung/${id}`);
}
