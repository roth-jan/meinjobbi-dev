import { fetchWrapper } from '@/lib/fetchWrapper';
import { Student } from '@/types';

export async function getStudentById(id: number): Promise<Student> {
  return fetchWrapper.get<Student>(`/student/${id}`);
}

export async function getStudentByUserId(userId: number): Promise<Student> {
  return fetchWrapper.get<Student>(`/student/user/${userId}`);
}

export async function createStudent(student: Partial<Student>): Promise<Student> {
  return fetchWrapper.post<Student>('/student', student);
}

export async function updateStudent(id: number, student: Partial<Student>): Promise<Student> {
  return fetchWrapper.put<Student>(`/student/${id}`, student);
}

export async function deleteStudent(id: number): Promise<void> {
  return fetchWrapper.del<void>(`/student/${id}`);
}

export async function getStudentFavoriteJobAds(studentId: number): Promise<number[]> {
  return fetchWrapper.get<number[]>(`/student/${studentId}/favorites`);
}
