import { z } from 'zod';

export const profilVerwaltenSchema = z
  .object({
    // Company fields — names match Company type exactly
    logopath: z.string().min(1, 'Logo ist erforderlich'),
    name: z.string().min(1, 'Unternehmensname ist erforderlich'),
    description: z.string().min(1, 'Unternehmensbeschreibung ist erforderlich'),
    zipcode: z.string().min(1, 'Postleitzahl ist erforderlich'),
    location: z.string().min(1, 'Ort ist erforderlich'),
    address: z.string().min(1, 'Straße/Hausnummer ist erforderlich'),
    industry: z.string().min(1, 'Branche ist erforderlich'),
    companysize: z.number({ error: 'Mitarbeiteranzahl ist erforderlich' }).min(0, 'Mitarbeiteranzahl muss positiv sein'),
    phone: z.string().optional(),
    contact_name: z.string().optional(),
    // Non-company fields
    contactName: z.string().optional(),
    email: z
      .string()
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: 'Ungültige E-Mail-Adresse',
      }),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return !!data.currentPassword && data.currentPassword.length >= 8;
      }
      return true;
    },
    {
      message: 'Bitte geben Sie Ihr aktuelles Passwort ein (min. 8 Zeichen)',
      path: ['currentPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return data.newPassword.length >= 8;
      }
      return true;
    },
    {
      message: 'Das Passwort muss mindestens 8 Zeichen lang sein',
      path: ['newPassword'],
    },
  );

export type ProfilVerwaltenFormData = z.infer<typeof profilVerwaltenSchema>;
