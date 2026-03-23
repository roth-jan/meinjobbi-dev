'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextInput,
  PasswordInput,
  Select,
  Checkbox,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { LoginFormLayout } from './LoginFormLayout';
import {
  studentRegistrationSchema,
  type StudentRegistrationFormData,
} from '@/lib/schemas';
import styles from '../page.module.css';

interface StudentRegistrationFormProps {
  onSubmit: (data: StudentRegistrationFormData) => void;
  currentHeading: React.ReactNode;
  loginLink: React.ReactNode;
}

export function StudentRegistrationForm({
  onSubmit,
  currentHeading,
  loginLink,
}: StudentRegistrationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentRegistrationFormData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      email: '',
      username: '',
      vorname: '',
      name: '',
      geschlecht: '',
      geburtsdatum: '',
      abschlussjahr: '',
      schule: '',
      password: '',
      passwordConfirm: '',
      acceptTerms: false as unknown as true,
    },
  });

  return (
    <LoginFormLayout heading={currentHeading} wide>
      {/* Fields section */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={styles.formFields}>
          <Box className={styles.formGrid}>
            <TextInput
              placeholder="E-Mail"
              {...register('email')}
              error={errors.email?.message}
              required
            />
            <TextInput
              placeholder="Username"
              {...register('username')}
              error={errors.username?.message}
              required
            />
            <TextInput
              placeholder="Vorname"
              {...register('vorname')}
              error={errors.vorname?.message}
              required
            />
            <TextInput
              placeholder="Name"
              {...register('name')}
              error={errors.name?.message}
              required
            />
            <Controller
              name="geschlecht"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Geschlecht"
                  value={field.value}
                  onChange={(value) => field.onChange(value || '')}
                  data={[
                    { value: 'male', label: 'Männlich' },
                    { value: 'female', label: 'Weiblich' },
                    { value: 'diverse', label: 'Divers' },
                  ]}
                  error={errors.geschlecht?.message}
                  required
                />
              )}
            />
            <Controller
              name="geburtsdatum"
              control={control}
              render={({ field }) => (
                <DateInput
                  placeholder="Geburtsdatum"
                  locale="de"
                  valueFormat="DD.MM.YYYY"
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) =>
                    field.onChange(
                      value ? dayjs(value).format('YYYY-MM-DD') : '',
                    )
                  }
                  error={errors.geburtsdatum?.message}
                  required
                />
              )}
            />
            <Controller
              name="abschlussjahr"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Voraussichtliches Abschlussjahr"
                  value={field.value}
                  onChange={(value) => field.onChange(value || '')}
                  data={[
                    { value: '2025', label: '2025' },
                    { value: '2026', label: '2026' },
                    { value: '2027', label: '2027' },
                    { value: '2028', label: '2028' },
                    { value: '2029', label: '2029' },
                  ]}
                  error={errors.abschlussjahr?.message}
                  required
                />
              )}
            />
            <Controller
              name="schule"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Schulauswahl"
                  value={field.value}
                  onChange={(value) => field.onChange(value || '')}
                  data={[
                    { value: 'gymnasium', label: 'Gymnasium' },
                    { value: 'realschule', label: 'Realschule' },
                    { value: 'hauptschule', label: 'Hauptschule' },
                    { value: 'gesamtschule', label: 'Gesamtschule' },
                  ]}
                  error={errors.schule?.message}
                  required
                />
              )}
            />
            <PasswordInput
              placeholder="Passwort"
              {...register('password')}
              error={errors.password?.message}
              required
            />
            <PasswordInput
              placeholder="Passwort bestätigen"
              {...register('passwordConfirm')}
              error={errors.passwordConfirm?.message}
              required
            />
          </Box>

          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === true}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
                label="Ich akzeptiere die Datenschutzbestimmungen *"
                className={styles.formGridCheckbox}
                error={errors.acceptTerms?.message}
              />
            )}
          />
        </Box>

        {/* Actions section */}
        <Box className={styles.formActions}>
          <Button type="submit" size="lg" style={{ fontSize: '1rem' }}>
            Nächster Schritt
          </Button>
          {loginLink}
        </Box>
      </form>
    </LoginFormLayout>
  );
}
