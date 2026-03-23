const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5027';
};

export const API_ENDPOINTS = {
  login: '/cognito/login',
  loginWithRedirect: '/cognito/auth-redirect',
  register: '/cognito/register',
  registerCompany: '/cognito/register-company',
  verifyEmail: '/cognito/verify-email',
  changePassword: '/cognito/change-password',
  deleteAccount: '/cognito/delete-account',

  getUser: (email: string) => `/user/${email}`,
  createUser: '/user',
  updateUser: (id: number) => `/user/${id}`,
  deleteUser: (id: number) => `/user/${id}`,

  getCompany: (id: number) => `/company/${id}`,
  getCompanies: '/company',
  createCompany: '/company',
  updateCompany: '/company',

  getStudent: (id: number) => `/student/${id}`,
  getStudentByUserId: (userId: number) => `/student/user/${userId}`,
  getStudents: '/student',
  createStudent: '/student',
  updateStudent: (id: number) => `/student/${id}`,
  updateStudentInterests: (id: number) => `/student/interests/${id}`,
  deleteStudent: (id: number) => `/student/interests/${id}`,

  getJobAd: (id: number) => `/jobad/${id}`,
  getJobAds: '/jobad',
  getJobAdsExclue: (schoolCode: string, count: number) => `/jobad/post/tv/${schoolCode}/${count}`,
  getJobAdsByCompany: (companyId: number) => `/jobad/company/${companyId}`,
  createJobAd: '/jobad',
  updateJobAd: '/jobad',
  sendemailtocompany: '/jobad/mail',
  deleteJobAd: (id: number) => `/jobad/${id}`,

  getWerbung: (id: number) => `/werbung/${id}`,
  getWerbungs: '/werbung',
  getWerbungsByCompany: (companyId: number) => `/werbung/company/${companyId}`,
  createWerbung: '/werbung',
  updateWerbung: '/werbung',
  deleteWerbung: (id: number) => `/werbung/${id}`,

  getContactMessage: (id: number) => `/message/kontakt/${id}`,
  createContactMessage: '/message/kontakt',
  getOfferMessage: (id: number) => `/message/offer/${id}`,
  getOfferMessageByEmail: (email: string) => `/message/offer/email/${email}`,
  createOfferMessage: '/message/offer',
};

export const getFullApiUrl = (endpoint: string) => {
  const baseUrl = getApiUrl();
  return `${baseUrl}${endpoint}`;
};
