import { z } from 'zod';

export const studentRegistrationSchema = z
  .object({
    email: z
      .string()
      .min(1, 'E-Mail ist erforderlich')
      .email('Ungültige E-Mail-Adresse'),
    username: z.string().min(1, 'Username ist erforderlich'),
    vorname: z.string().min(1, 'Vorname ist erforderlich'),
    name: z.string().min(1, 'Name ist erforderlich'),
    geschlecht: z.string().min(1, 'Geschlecht ist erforderlich'),
    geburtsdatum: z.string().min(1, 'Geburtsdatum ist erforderlich'),
    abschlussjahr: z.string().min(1, 'Abschlussjahr ist erforderlich'),
    schule: z.string().min(1, 'Schulauswahl ist erforderlich'),
    password: z
      .string()
      .min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
    passwordConfirm: z.string().min(1, 'Passwort bestätigen ist erforderlich'),
    acceptTerms: z.literal(true, {
      message: 'Datenschutzbestimmungen müssen akzeptiert werden',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwörter stimmen nicht überein',
    path: ['passwordConfirm'],
  });

export type StudentRegistrationFormData = z.infer<
  typeof studentRegistrationSchema
>;
