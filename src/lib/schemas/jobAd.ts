import { z } from 'zod';

export const jobAdSchema = z.object({
  active: z.boolean(),
  jobtitle: z.string().min(1, 'Jobtitel ist erforderlich'),
  briefdescription: z.string().optional(),
  jobtype: z.string().optional(),
  startdate: z.string().optional(),
  duration: z.string().optional(),
  permanent: z.boolean(),
  salary01: z.string().optional(),
  salary02: z.string().optional(),
  salary03: z.string().optional(),
  salary04: z.string().optional(),
  salary05: z.string().optional(),
  taskdescription: z.string().optional(),
  profiledescription: z.string().optional(),
  jobdescription: z.string().optional(),
  applicationprocess: z.string().optional(),
  cities: z.string().optional(),
  contactfirstname: z.string().min(1, 'Vorname ist erforderlich'),
  contactlastname: z.string().min(1, 'Name ist erforderlich'),
  contactphone: z.string().min(1, 'Telefon ist erforderlich'),
  contactemail: z
    .string()
    .min(1, 'E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse'),
});

export type JobAdFormData = z.infer<typeof jobAdSchema>;
