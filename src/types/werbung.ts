export enum WerbungType {
  None = 0,
  Jobbi_StartSeite = 1,
  WebMenu_Dashboard = 2,
  WebMenu_Login = 4,
  WebMenu_StartSeite = 8,
  Werbung = 100,
  Anzeigen = 300,
}

// Field names match API response (lowercase)
export interface Werbung {
  id: number;
  userid: number;
  companyid: number;
  type: WerbungType;
  active: boolean;
  registrationdate: string;
  duration?: string;
  hintergrundbild?: string;
  topline?: string;
  titel?: string;
  subtitel?: string;
  internebuttonurl?: string;
  externebuttonurl?: string;
  buttonname?: string;
  isortauswaehlen: boolean;
  ortauswaehlen?: string;
  jobaddid?: number;
  ispaid: boolean;
  advertisementtype: number;
}
