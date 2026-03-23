import { fetchWrapper, ApiError } from "@/lib/fetchWrapper";
import { JobAd, CreateJobAdRequest, JobAdResponse } from "@/types";

export async function getAllJobAds(
	pageSize = 10,
	pageNumber = 1,
): Promise<JobAd[]> {
	return fetchWrapper.get<JobAd[]>(`/jobad/all/${pageSize}/${pageNumber}`);
}

export async function getJobAdById(id: number): Promise<JobAd> {
	return fetchWrapper.get<JobAd>(`/jobad/${id}`);
}

export async function getJobAdsByCompanyId(companyId: number): Promise<JobAd[]> {
	return fetchWrapper.get<JobAd[]>(`/jobad/company/${companyId}`);
}

export async function createJobAd(
	jobAd: CreateJobAdRequest,
): Promise<JobAdResponse> {
	try {
		const result = await fetchWrapper.post<JobAd>("/jobad", jobAd);
		return {
			success: true,
			jobAd: result,
		};
	} catch (err) {
		console.error("Create job ad error:", err);
		const errorMessage =
			err instanceof ApiError ? err.message : "Fehler beim Erstellen der Stellenanzeige";
		return {
			success: false,
			errorMessage,
		};
	}
}

export async function updateJobAd(
	id: number,
	jobAd: CreateJobAdRequest,
): Promise<JobAdResponse> {
	try {
		const result = await fetchWrapper.put<JobAd>(`/jobad/${id}`, jobAd);
		return {
			success: true,
			jobAd: result,
		};
	} catch (err) {
		console.error("Update job ad error:", err);
		const errorMessage =
			err instanceof ApiError ? err.message : "Fehler beim Aktualisieren der Stellenanzeige";
		return {
			success: false,
			errorMessage,
		};
	}
}

export async function deleteJobAd(id: number): Promise<void> {
	return fetchWrapper.del<void>(`/jobad/${id}`);
}

// Student favorites
export async function addJobAdToFavorites(studentId: number, jobAdId: number): Promise<void> {
  return fetchWrapper.post<void>(`/student/${studentId}/favorites/${jobAdId}`);
}

export async function removeJobAdFromFavorites(studentId: number, jobAdId: number): Promise<void> {
  return fetchWrapper.del<void>(`/student/${studentId}/favorites/${jobAdId}`);
}

// TV Carousel
export async function getJobAdsForTvCarousel(schoolCode: string, count: number): Promise<JobAd[]> {
  return fetchWrapper.get<JobAd[]>(`/jobad/tv/${schoolCode}/${count}`);
}

export async function getJobAdsForTvCarouselWithExcludes(
  schoolCode: string,
  count: number,
  excludeIds: number[]
): Promise<JobAd[]> {
  return await fetchWrapper.post<JobAd[]>(`/jobad/post/tv/${schoolCode}/${count}`, excludeIds);
}
