export interface Company {
  id: number;
  name?: string;
  code?: string;
  logopath?: string;
  industry?: string;
  zipcode?: string;
  location?: string;
  address?: string; /* Straße/Hausnummer */
  phone?: string;
  contact_name?: string;
  companysize?: number;
  foundingyear?: number;
  description?: string;
  createcompanpage: boolean;
  premiumheadline?: string;
  premiumdescription?: string;
  premiumfigure1?: string;
  premiumheadline1?: string;
  premiumdescription1?: string;
  premiumfigure2?: string;
  premiumheadline2?: string;
  premiumdescription2?: string;
  premiumcompanyvideopath?: string;
  ispaid: boolean;
}
