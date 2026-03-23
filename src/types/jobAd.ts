export interface JobAd {
  id: number;
  userid: number;
  companyid: number;
  registrationdate: string;
  active: boolean;
  jobtitle?: string;
  briefdescription?: string;
  jobtype?: string;
  startdate?: string;
  duration?: string;
  permanent: boolean;
  salary01?: string;
  salary02?: string;
  salary03?: string;
  salary04?: string;
  salary05?: string;
  taskdescription?: string;
  profiledescription?: string;
  jobdescription?: string;
  applicationprocess?: string;
  ispremiumoffer: boolean;
  cities: string;
  contactfirstname: string;
  contactlastname: string;
  contactphone: string;
  contactemail: string;
  logourl: string;
  ispaid: boolean;
  companyname: string;
}

export interface JobAdListItem {
  id: number;
  jobtitle: string;
  companyName: string;
  companyLogoUrl?: string;
  cities?: string;
  registrationdate: string;
}

// Request type for creating/updating job ads (matches backend CreateJobAdRequest)
export interface CreateJobAdRequest {
  userid: number;
  companyid: number;
  registrationdate: string;
  active: boolean;
  jobtitle?: string;
  briefdescription?: string;
  jobtype?: string;
  startdate?: string;
  duration?: string;
  permanent: boolean;
  salary01?: string;
  salary02?: string;
  salary03?: string;
  salary04?: string;
  salary05?: string;
  taskdescription?: string;
  profiledescription?: string;
  jobdescription?: string;
  applicationprocess?: string;
  cities: string;
  contactfirstname: string;
  contactlastname: string;
  contactphone: string;
  contactemail: string;
}

export interface JobAdResponse {
  success: boolean;
  jobAd?: JobAd;
  errorMessage?: string;
}
