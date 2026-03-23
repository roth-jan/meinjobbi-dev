import { fetchWrapper } from '@/lib/fetchWrapper';
import { School } from '@/types';

export async function getSchoolByCode(code: string): Promise<School> {
  return fetchWrapper.get<School>(`/schools/code/${code}`);
}

export async function getAllSchools(): Promise<School[]> {
  return fetchWrapper.get<School[]>('/schools');
}
