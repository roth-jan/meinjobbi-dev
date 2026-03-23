'use client';

import { useState, useRef } from 'react';
import { Box, Text } from '@mantine/core';
import Link from 'next/link';
import styles from '../page.module.css';
import type { RegisterStep } from '../page';
import { AccountType, StudentRegisterRequest } from '@/types';
import { RegisterStudent, verifyEmailWithFormData } from '@/functions/authService';
import type { StudentRegistrationFormData } from '@/lib/schemas';
import {
  StudentRegistrationForm,
  ParentalConsentForm,
  InterestsForm,
  CodeVerificationForm,
  RegistrationSuccessForm,
} from './index';

interface StudentRegisterFlowProps {
  onSwitchToLogin: () => void;
  onStepChange: (step: RegisterStep) => void;
  currentHeading: React.ReactNode;
}

export function StudentRegisterFlow({
  onSwitchToLogin,
  onStepChange,
  currentHeading,
}: StudentRegisterFlowProps) {
  const [step, setStepInternal] = useState<RegisterStep>('form');

  const setStep = (newStep: RegisterStep) => {
    setStepInternal(newStep);
    onStepChange(newStep);
  };

  const formDataRef = useRef<StudentRegistrationFormData | null>(null);
  const [parentEmail, setParentEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const isUnder16 = () => {
    if (!formDataRef.current?.geburtsdatum) return false;
    const birthDate = new Date(formDataRef.current.geburtsdatum);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 16;
  };

  const handleFormSubmit = (data: StudentRegistrationFormData) => {
    formDataRef.current = data;

    if (isUnder16()) {
      setStep('parental-consent');
    } else {
      setStep('interests');
    }
  };

  const handleInterestsSubmit = async (interests: string[]) => {
    setSelectedInterests(interests);

    if (!formDataRef.current) return;
    const data = formDataRef.current;

    const studentRegisterRequest: StudentRegisterRequest = {
      email: data.email,
      username: data.username,
      accounttype: AccountType.Student,
      firstname: data.vorname,
      lastname: data.name,
      dateofbirth: data.geburtsdatum,
      school: data.schule,
      graduationyear: parseInt(data.abschlussjahr),
      password: data.password,
      gender: data.geschlecht,
      interests: interests.join(', '),
      parentemail: isUnder16() ? parentEmail : undefined,
    };

    try {
      const result = await RegisterStudent(studentRegisterRequest);

      if (!result.emailSent) {
        alert(result.message);
        return;
      }

      setStep('code-verification');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Błąd podczas rejestracji. Spróbuj ponownie.');
    }
  };

  const handleParentalConsentSubmit = () => {
    if (!parentEmail) return;
    setStep('interests');
  };

  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleCodeVerificationSubmit = async (code: string) => {
    setVerificationError(null);

    if (!formDataRef.current) return;
    const data = formDataRef.current;

    try {
      const result = await verifyEmailWithFormData(code, data.email, data.password);

      if (!result.success) {
        setVerificationError(result.error);
        return;
      }

      console.log('Email verified successfully');
      setStep('success');

      if (result.redirectUrl) {
        console.log('Received redirect URL:', result.redirectUrl);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setVerificationError('Fehler bei der Verifizierung. Bitte versuche es erneut.');
    }
  };

  const getStepClass = (targetStep: RegisterStep) => {
    if (step === targetStep) return styles.slideIn;
    const stepOrder: RegisterStep[] = isUnder16()
      ? ['form', 'parental-consent', 'interests', 'code-verification', 'success']
      : ['form', 'interests', 'code-verification', 'success'];
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
        <StudentRegistrationForm
          onSubmit={handleFormSubmit}
          currentHeading={currentHeading}
          loginLink={loginLink}
        />
      </Box>

      <Box className={`${styles.slide} ${getStepClass('interests')}`}>
        <InterestsForm
          onSubmit={handleInterestsSubmit}
          currentHeading={currentHeading}
          loginLink={loginLink}
        />
      </Box>

      <Box className={`${styles.slide} ${getStepClass('parental-consent')}`}>
        <ParentalConsentForm
          parentEmail={parentEmail}
          onParentEmailChange={setParentEmail}
          onSubmit={handleParentalConsentSubmit}
          currentHeading={currentHeading}
          loginLink={loginLink}
        />
      </Box>

      <Box className={`${styles.slide} ${getStepClass('code-verification')}`}>
        <CodeVerificationForm
          onSubmit={handleCodeVerificationSubmit}
          onResendCode={() => console.log('Resending code...')}
          currentHeading={currentHeading}
          isUnder16={isUnder16()}
          error={verificationError}
        />
      </Box>

      <Box className={`${styles.slide} ${getStepClass('success')}`}>
        <RegistrationSuccessForm onGoToLogin={onSwitchToLogin} currentHeading={currentHeading} />
      </Box>
    </Box>
  );
}
