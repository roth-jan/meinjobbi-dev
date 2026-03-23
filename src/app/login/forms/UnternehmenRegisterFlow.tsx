'use client';

import { useState } from 'react';
import { Box, Text } from '@mantine/core';
import Link from 'next/link';
import styles from '../page.module.css';
import type { RegisterStep } from '../page';
import { AccountType } from '@/types/user';
import { API_ENDPOINTS } from '@/lib/api-config';
import { registerCompany, verifyEmailWithFormData } from '@/functions/authService';
import {
  UnternehmenRegistrationForm,
  CodeVerificationForm,
  RegistrationSuccessForm,
} from './index';
import { CompanyRegisterRequest } from '@/types';

interface UnternehmenRegisterFlowProps {
  onSwitchToLogin: () => void;
  onStepChange: (step: RegisterStep) => void;
  currentHeading: React.ReactNode;
}

export function UnternehmenRegisterFlow({
  onSwitchToLogin,
  onStepChange,
  currentHeading,
}: UnternehmenRegisterFlowProps) {
  const [step, setStepInternal] = useState<RegisterStep>('form');

  const setStep = (newStep: RegisterStep) => {
    setStepInternal(newStep);
    onStepChange(newStep);
  };

  const [formData, setFormData] = useState({
    unternehmen: '',
    postleitzahl: '',
    ort: '',
    strasse: '',
    branche: '',
    mitarbeiterzahl: '',
    name: '',
    vorname: '',
    email: '',
    telefonnummer: '',
    password: '',
    passwordConfirm: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const companyRegisterRequest: CompanyRegisterRequest = {
    email: formData.email,
    accounttype: AccountType.Company,
    firstname: formData.vorname,
    lastname: formData.name,
    password: formData.password,
    name: formData.unternehmen,
    postalcode: formData.postleitzahl,
    location: formData.ort,
    address: formData.strasse,
    iIndustry: formData.branche,
    companysize: formData.mitarbeiterzahl,
    phone: formData.telefonnummer,
  };

  const handleFormSubmit = async () => {
    try {
      const result = await registerCompany(companyRegisterRequest);

      if (!result.emailSent) {
        alert(result.message);
        return;
      }
      setStep('code-verification');
    } catch (err) {
      console.error('Company registration error:', err);
      alert('Fehler bei der Registrierung. Bitte versuche es erneut.');
    }
  };

  const handleCodeVerificationSubmit = async (code: string) => {
    setVerificationError(null);

    try {
      const result = await verifyEmailWithFormData(code, formData.email, formData.password);

      if (!result.success) {
        setVerificationError(result.error);
        return;
      }

      console.log('Company email verified successfully');
      setStep('success');

      if (result.redirectUrl) {
        console.log('Received redirect URL:', result.redirectUrl);
      }
    } catch (err) {
      console.error('Company verification error:', err);
      setVerificationError('Fehler bei der Verifizierung. Bitte versuche es erneut.');
    }
  };

  const getStepClass = (targetStep: RegisterStep) => {
    if (step === targetStep) return styles.slideIn;
    const stepOrder: RegisterStep[] = ['form', 'code-verification', 'success'];
    const currentIndex = stepOrder.indexOf(step);
    const targetIndex = stepOrder.indexOf(targetStep);
    return targetIndex < currentIndex ? styles.slideOutLeft : styles.slideOutRight;
  };

  const loginLink = (
    <Text className={styles.formActionText} size="xs" c="dimmed">
      Schon ein Account? Hier geht's zum{' '}
      <Link
        href="/login"
        className={styles.highlightedLink}
        onClick={(e) => {
          e.preventDefault();
          onSwitchToLogin();
        }}
      >
        Login
      </Link>
      .
    </Text>
  );

  return (
    <Box className={styles.slideContainer}>
      <Box className={`${styles.slide} ${getStepClass('form')}`}>
        <UnternehmenRegistrationForm
          formData={formData}
          acceptTerms={acceptTerms}
          onFormDataChange={handleFormDataChange}
          onAcceptTermsChange={setAcceptTerms}
          onSubmit={handleFormSubmit}
          currentHeading={currentHeading}
          loginLink={loginLink}
        />
      </Box>

      <Box className={`${styles.slide} ${getStepClass('code-verification')}`}>
        <CodeVerificationForm
          onSubmit={handleCodeVerificationSubmit}
          onResendCode={() => console.log('Resending code...')}
          currentHeading={currentHeading}
          isUnder16={false}
          error={verificationError}
        />
      </Box>

      <Box className={`${styles.slide} ${getStepClass('success')}`}>
        <RegistrationSuccessForm onGoToLogin={onSwitchToLogin} currentHeading={currentHeading} />
      </Box>
    </Box>
  );
}
