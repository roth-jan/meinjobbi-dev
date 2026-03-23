'use client';

import { useState } from 'react';
import { Box, Text, Button, TextInput, Alert } from '@mantine/core';
import { LoginFormLayout } from './LoginFormLayout';
import styles from '../page.module.css';

const isDev = process.env.NODE_ENV === 'development';

interface CodeVerificationFormProps {
  onSubmit: (code: string) => Promise<void>;
  onResendCode: () => void;
  currentHeading: React.ReactNode;
  isUnder16?: boolean;
  error?: string | null;
}

export function CodeVerificationForm({
  onSubmit,
  onResendCode,
  currentHeading,
  isUnder16 = false,
  error: externalError,
}: CodeVerificationFormProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const error = externalError || internalError;

  const handleSubmit = async () => {
    setIsLoading(true);
    setInternalError(null);
    try {
      await onSubmit(code);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginFormLayout heading={currentHeading}>
      {/* Subtext */}
      <Text className={styles.formSubtext}>
        {isUnder16
          ? 'Der Startcode wurde per E-Mail an die erziehungsberechtigte Person gesendet. Gib ihn hier ein und dir wird die Startfreigabe erteilt.'
          : 'Der Startcode wurde dir per E-Mail gesendet. Gib ihn hier ein und dir wird die Startfreigabe erteilt.'}
      </Text>

      {/* Code input */}
      <Box className={styles.formFields}>
        <TextInput
          placeholder="Code eingeben"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isLoading}
        />
        {error && (
          <Alert color="red" mt="sm">
            {error}
          </Alert>
        )}
      </Box>

      {/* Actions section */}
      <Box className={styles.formActions}>
        <Button
          size="lg"
          onClick={handleSubmit}
          style={{ fontSize: '1rem' }}
          disabled={!code || isLoading}
          loading={isLoading}
        >
          Jetzt bestätigen
        </Button>
        <Text className={styles.formActionText} size="xs" c="dimmed">
          Kein Code erhalten?{' '}
          <a
            href="#"
            className={styles.highlightedLink}
            onClick={(e) => {
              e.preventDefault();
              onResendCode();
            }}
          >
            Erneut senden
          </a>
        </Text>
        {isDev && (
          <Button
            size="xs"
            color="red"
            onClick={() => onSubmit('dev-code')}
            style={{ marginTop: '0.5rem' }}
          >
            DEV: Skip
          </Button>
        )}
      </Box>
    </LoginFormLayout>
  );
}
