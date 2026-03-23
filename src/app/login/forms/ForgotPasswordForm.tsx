'use client';

import { useState } from 'react';
import { Box, Text, Button, TextInput } from '@mantine/core';
import { LoginFormLayout } from './LoginFormLayout';
import styles from '../page.module.css';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFormValid = email.trim() !== '' && email.includes('@');

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      // TODO: Call API to send password reset email
      console.log('Password reset requested for:', email);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
      alert('Fehler beim Anfordern des Passworts. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading = isSubmitted ? (
    <>
      E-Mail
      <br />
      gesendet!
    </>
  ) : (
    <>
      Neues Passwort
      <br />
      anfordern
    </>
  );

  return (
    <LoginFormLayout heading={heading}>
      {!isSubmitted ? (
        <>
          <Box className={styles.formFields}>
            <Text size="sm" c="dimmed" mb="md">
              Gib deine E-Mail-Adresse ein. Du erhältst eine E-Mail mit einem Link zum Zurücksetzen
              deines Passworts.
            </Text>
            <TextInput
              placeholder="E-Mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          <Box className={styles.formActions}>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              loading={isSubmitting}
              style={{ fontSize: '1rem' }}
            >
              Passwort anfordern
            </Button>
            <Text className={styles.formActionText} size="xs" c="dimmed">
              Zurück zum{' '}
              <a
                href="#"
                className={styles.highlightedLink}
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToLogin();
                }}
              >
                Login
              </a>
            </Text>
          </Box>
        </>
      ) : (
        <>
          <Box className={styles.formFields}>
            <Text size="sm" c="dimmed">
              Wir haben dir eine E-Mail mit einem Link zum Zurücksetzen deines Passworts gesendet.
              Bitte überprüfe dein Postfach.
            </Text>
          </Box>

          <Box className={styles.formActions}>
            <Button size="lg" onClick={onSwitchToLogin} style={{ fontSize: '1rem' }}>
              Zurück zum Login
            </Button>
          </Box>
        </>
      )}
    </LoginFormLayout>
  );
}
