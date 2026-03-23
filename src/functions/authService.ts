import { AuthResultDto, RegisterRequestDto } from '@/types/aws';
import {
  UserDto,
  User,
  LoginResponse,
  StudentRegisterRequest,
  RegisterResponse,
  CompanyRegisterRequest,
  ChangeInterestsRequest,
  ChangePasswordRequest,
  Student,
} from '@/types';
import { fetchWrapper, ApiError } from '@/lib/fetchWrapper';
import { API_ENDPOINTS } from '@/lib/api-config';

// Helper function to convert API response to Student type
const convertApiResponseToStudent = (apiResponse: any): Student => {
  return {
    id: apiResponse.id,
    userId: apiResponse.userId,
    firstname: apiResponse.firstName,
    lastname: apiResponse.lastName,
    dateofbirth: apiResponse.dateOfBirth,
    email: apiResponse.email,
    phone: apiResponse.phone,
    zipCode: apiResponse.zipCode,
    location: apiResponse.location,
    school: apiResponse.school,
    graduationyear: apiResponse.graduationYear,
    jobinterests: apiResponse.jobInterests,
    skills: apiResponse.skills,
    availability: apiResponse.availability,
    bio: apiResponse.bio,
    favoritejobads: apiResponse.favoriteJobAds,
    favoritecompanies: apiResponse.favoriteCompanies,
    gender: apiResponse.gender,
    username: apiResponse.username,
  };
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const payload = {
      email,
      password,
    };

    const data = await fetchWrapper.post<LoginResponse>(API_ENDPOINTS.login, payload);

    if (!data.success) {
      return {
        success: false,
        token: data.token,
        errorMessage: data.errorMessage || 'Login fehlgeschlagen',
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      student: data.student,
      company: data.company,
    };
  } catch (err) {
    console.error('Login error:', err);

    const errorMessage = err instanceof ApiError ? err.message : 'Fehler beim Login';

    return {
      success: false,
      token: '',
      errorMessage,
    };
  }
};

export const RegisterStudent = async (
  request: StudentRegisterRequest
): Promise<RegisterResponse> => {
  try {
    const data = await fetchWrapper.post<RegisterResponse>(API_ENDPOINTS.register, request);

    if (!data.emailSent) {
      return {
        message: data.message || 'Login fehlgeschlagen',
      };
    }

    return {
      emailSent: data.emailSent,
      message: data.message,
      emailSentTo: data.emailSentTo,
      parentEmailUsed: data.parentEmailUsed,
      mail: data.mail,
    };
  } catch (err) {
    console.error('Login error:', err);

    const errorMessage = err instanceof ApiError ? err.message : 'Fehler beim Login';

    return {
      message: errorMessage,
    };
  }
};

export const registerCompany = async (
  request: CompanyRegisterRequest
): Promise<RegisterResponse> => {
  try {
    const data = await fetchWrapper.post<RegisterResponse>(API_ENDPOINTS.registerCompany, request);

    if (!data.emailSent) {
      return {
        message: data.message || 'Login fehlgeschlagen',
      };
    }

    return {
      emailSent: data.emailSent,
      message: data.message,
      emailSentTo: data.emailSentTo,
      mail: data.mail,
    };
  } catch (err) {
    console.error('Login error:', err);

    const errorMessage = err instanceof ApiError ? err.message : 'Fehler beim Login';

    return {
      message: errorMessage,
    };
  }
};

export const verifyEmailWithFormData = async (
  code: string,
  email: string,
  password: string
): Promise<any> => {
  try {
    const formData = new URLSearchParams();
    formData.append('code', code);
    formData.append('email', email);
    formData.append('password', password);

    const data = await fetchWrapper.post<any>(
      API_ENDPOINTS.verifyEmail,
      formData,
      'application/x-www-form-urlencoded'
    );

    console.log('Verification response:', data);

    if (data.success && data.redirectUrl) {
      return { success: true, redirectUrl: data.redirectUrl };
    }

    return { success: false, error: 'Verification failed' };
  } catch (err) {
    console.error('Verification error:', err);
    const errorMessage =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Fehler bei der Verifizierung';

    return { success: false, error: errorMessage };
  }
};

export const sendEmailToCompany = async (
  jobAdId: number,
  studentId: number | null,
  isMoreInfo: boolean,
  schoolCode: string = '10015'
): Promise<{ success: boolean; message?: string }> => {
  if (!studentId) {
    return {
      success: false,
      message: 'Nur angemeldete Schüler können diese Funktion nutzen.',
    };
  }

  try {
    const emailRequest = {
      jobadid: jobAdId,
      studentid: studentId,
      ismoreinfo: isMoreInfo,
      schoolCode,
    };

    await fetchWrapper.post(API_ENDPOINTS.sendemailtocompany, emailRequest);

    return {
      success: true,
      message: isMoreInfo ? 'Infomaterial wird angefordert...' : 'Bewerbung wird gesendet...',
    };
  } catch (err) {
    console.error('Email send error:', err);
    const errorMessage =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Fehler beim Senden der E-Mail';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const updateStudent = async (
  studentId: number,
  studentData: Partial<any>
): Promise<{ success: boolean; message?: string; student?: Student }> => {
  try {
    const response = await fetchWrapper.post<any>(
      API_ENDPOINTS.updateStudent(studentId),
      studentData
    );

    const convertedStudent = convertApiResponseToStudent(response);

    return {
      success: true,
      message: 'Stammdaten erfolgreich aktualisiert',
      student: convertedStudent,
    };
  } catch (err) {
    console.error('Update student error:', err);
    const errorMessage =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Fehler beim Aktualisieren der Stammdaten';

    return {
      success: false,
      message: errorMessage,
    };
  }
};
export const updateStudentInterests = async (
  studentId: number,
  request: ChangeInterestsRequest
): Promise<{ success: boolean; message?: string; student?: Student }> => {
  try {
    const response = await fetchWrapper.post<any>(
      API_ENDPOINTS.updateStudentInterests(studentId),
      request
    );

    const convertedStudent = convertApiResponseToStudent(response);

    return {
      success: true,
      message: 'Stammdaten erfolgreich aktualisiert',
      student: convertedStudent,
    };
  } catch (err) {
    console.error('Update student error:', err);
    const errorMessage =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Fehler beim Aktualisieren der Stammdaten';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const changePassword = async (
  userId: number,
  newPassword: string,
  email: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const payload: ChangePasswordRequest = {
      userId,
      newPassword,
      email,
    };

    await fetchWrapper.post<any>(API_ENDPOINTS.changePassword, payload);

    return {
      success: true,
      message: 'Passwort erfolgreich geändert',
    };
  } catch (err) {
    console.error('Change password error:', err);
    const errorMessage =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Fehler beim Ändern des Passworts';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const deleteAccount = async (
  email: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetchWrapper.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.deleteAccount,
      { email }
    );

    return {
      success: response.success,
      message: response.message || 'Konto erfolgreich gelöscht',
    };
  } catch (err) {
    console.error('Delete account error:', err);
    const errorMessage =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Fehler beim Löschen des Kontos';

    return {
      success: false,
      message: errorMessage,
    };
  }
};
