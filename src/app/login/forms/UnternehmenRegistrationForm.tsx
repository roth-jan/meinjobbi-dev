'use client';

import { Box, TextInput, PasswordInput, Checkbox, Button, Select } from '@mantine/core';
import { LoginFormLayout } from './LoginFormLayout';
import styles from '../page.module.css';

interface UnternehmenFormData {
  unternehmen: string;
  postleitzahl: string;
  ort: string;
  strasse: string;
  branche: string;
  mitarbeiterzahl: string;
  name: string;
  vorname: string;
  email: string;
  telefonnummer: string;
  password: string;
  passwordConfirm: string;
}

interface UnternehmenRegistrationFormProps {
  formData: UnternehmenFormData;
  acceptTerms: boolean;
  onFormDataChange: (field: string, value: string) => void;
  onAcceptTermsChange: (value: boolean) => void;
  onSubmit: () => void;
  currentHeading: React.ReactNode;
  loginLink: React.ReactNode;
}

const branchenOptions = [
  { value: 'handwerk', label: 'Handwerk' },
  { value: 'industrie', label: 'Industrie' },
  { value: 'handel', label: 'Handel' },
  { value: 'dienstleistung', label: 'Dienstleistung' },
  { value: 'gesundheit', label: 'Gesundheit & Soziales' },
  { value: 'it', label: 'IT & Technik' },
  { value: 'gastronomie', label: 'Gastronomie & Hotellerie' },
  { value: 'bau', label: 'Bau & Architektur' },
  { value: 'logistik', label: 'Logistik & Transport' },
  { value: 'sonstiges', label: 'Sonstiges' },
];

const mitarbeiterOptions = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '201-500', label: '201-500' },
  { value: '500+', label: '500+' },
];

export function UnternehmenRegistrationForm({
  formData,
  acceptTerms,
  onFormDataChange,
  onAcceptTermsChange,
  onSubmit,
  currentHeading,
  loginLink,
}: UnternehmenRegistrationFormProps) {
  const isFormValid =
    formData.unternehmen &&
    formData.postleitzahl &&
    formData.ort &&
    formData.strasse &&
    formData.branche &&
    formData.mitarbeiterzahl &&
    formData.name &&
    formData.vorname &&
    formData.email &&
    formData.telefonnummer &&
    formData.password &&
    formData.passwordConfirm &&
    formData.password === formData.passwordConfirm &&
    acceptTerms;

  return (
    <LoginFormLayout heading={currentHeading} wide>
      <Box className={styles.formGrid}>
        <TextInput
          placeholder="Unternehmen"
          value={formData.unternehmen}
          onChange={(e) => onFormDataChange('unternehmen', e.target.value)}
          required
        />
        <TextInput
          placeholder="Postleitzahl"
          value={formData.postleitzahl}
          onChange={(e) => onFormDataChange('postleitzahl', e.target.value)}
          required
        />
        <TextInput
          placeholder="Ort"
          value={formData.ort}
          onChange={(e) => onFormDataChange('ort', e.target.value)}
          required
        />
        <TextInput
          placeholder="Straße/Hausnummer"
          value={formData.strasse}
          onChange={(e) => onFormDataChange('strasse', e.target.value)}
          required
        />
        <Select
          placeholder="Branche"
          data={branchenOptions}
          value={formData.branche}
          onChange={(value) => onFormDataChange('branche', value || '')}
          required
        />
        <Select
          placeholder="Mitarbeiterzahl"
          data={mitarbeiterOptions}
          value={formData.mitarbeiterzahl}
          onChange={(value) => onFormDataChange('mitarbeiterzahl', value || '')}
          required
        />
        <TextInput
          placeholder="Name"
          value={formData.name}
          onChange={(e) => onFormDataChange('name', e.target.value)}
          required
        />
        <TextInput
          placeholder="Vorname"
          value={formData.vorname}
          onChange={(e) => onFormDataChange('vorname', e.target.value)}
          required
        />
        <TextInput
          placeholder="E-Mail"
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange('email', e.target.value)}
          required
        />
        <TextInput
          placeholder="Telefonnummer"
          type="tel"
          value={formData.telefonnummer}
          onChange={(e) => onFormDataChange('telefonnummer', e.target.value)}
          required
        />
        <PasswordInput
          placeholder="Passwort"
          value={formData.password}
          onChange={(e) => onFormDataChange('password', e.target.value)}
          required
        />
        <PasswordInput
          placeholder="Passwort bestätigen"
          value={formData.passwordConfirm}
          onChange={(e) => onFormDataChange('passwordConfirm', e.target.value)}
          required
        />
      </Box>

      <Checkbox
        checked={acceptTerms}
        onChange={(e) => onAcceptTermsChange(e.currentTarget.checked)}
        className={styles.formGridCheckbox}
        label={
          <>
            Ich akzeptiere die{' '}
            <a href="https://ntc.software/agb.html" target="_blank" rel="noopener noreferrer" className={styles.highlightedLink}>
              AGB
            </a>{' '}
            und{' '}
            <a href="https://ntc.software/datenschutz.html" target="_blank" rel="noopener noreferrer" className={styles.highlightedLink}>
              Datenschutzbestimmungen
            </a>
          </>
        }
      />

      <Box className={styles.formActions}>
        <Button size="lg" onClick={onSubmit} disabled={!isFormValid} style={{ fontSize: '1rem' }}>
          Jetzt registrieren
        </Button>
        {loginLink}
      </Box>
    </LoginFormLayout>
  );
}
