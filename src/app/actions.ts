import { fetchWrapper } from '@/lib/fetchWrapper';
import { Werbung, JobAd, School } from '@/types';

export async function getAllWerbungs(): Promise<Werbung[]> {
  try {
    return await fetchWrapper.get<Werbung[]>('/werbung');
  } catch (error) {
    console.error('Failed to fetch werbungs:', error);
    return [];
  }
}

export async function getAllJobAds(limit = 10, page = 1): Promise<JobAd[]> {
  try {
    return await fetchWrapper.get<JobAd[]>(`/jobad/all/${limit}/${page}`);
  } catch (error) {
    console.error('Failed to fetch job ads:', error);
    return [];
  }
}

export async function getJobAdById(id: string): Promise<JobAd | null> {
  try {
    return await fetchWrapper.get<JobAd>(`/jobad/${id}`);
  } catch (error) {
    console.error('Failed to fetch job ad:', error);
    return null;
  }
}

export async function getSchoolByCode(code: string): Promise<School | null> {
  try {
    return await fetchWrapper.get<School>(`/schools/code/${code}`);
  } catch (error) {
    console.error('Failed to fetch school by code:', error);
    return null;
  }
}
