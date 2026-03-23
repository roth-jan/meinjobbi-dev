'use client';

import { Box, Text, Button, TextInput } from '@mantine/core';
import Image from 'next/image';
import { LoginFormLayout } from './LoginFormLayout';
import styles from '../page.module.css';

interface ParentalConsentFormProps {
  parentEmail: string;
  onParentEmailChange: (email: string) => void;
  onSubmit: () => void;
  currentHeading: React.ReactNode;
  loginLink: React.ReactNode;
}

export function ParentalConsentForm({
  parentEmail,
  onParentEmailChange,
  onSubmit,
  currentHeading,
  loginLink,
}: ParentalConsentFormProps) {
  return (
    <LoginFormLayout heading={currentHeading}>
      {/* Subtext */}
      <Text className={styles.formSubtext}>
        Du bist noch keine 16 Jahre. Für den Start deiner Jobbi-Mission brauchen wir die
        Startfreigabe einer erziehungsberechtigten Person. Gib eine E-Mail-Adresse ein, wir senden
        den Code für die Freigabe dorthin.
      </Text>

      {/* Fields section */}
      <Box className={styles.formFields}>
        <TextInput
          placeholder="E-Mail der erziehungsberechtigten Person"
          value={parentEmail}
          onChange={(e) => onParentEmailChange(e.target.value)}
          required
        />
        <Box className={styles.warningField}>
          <Image src="/svg/exclamation_mark.svg" alt="" width={22} height={22} />
          <Text className={styles.warningText}>
            E-Mail-Adresse muss sich von deiner
            <br />
            eigenen unterscheiden.
          </Text>
        </Box>
      </Box>

      {/* Actions section */}
      <Box className={styles.formActions}>
        <Button onClick={onSubmit}>Absenden und weiter</Button>
        {loginLink}
      </Box>
    </LoginFormLayout>
  );
}
