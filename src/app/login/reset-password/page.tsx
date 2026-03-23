'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Text, Button, PasswordInput, Loader, Center } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { BasicFooter } from '@/components/layout';
import styles from '../page.module.css';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid =
    password.length >= 8 && passwordConfirm.length >= 8 && password === passwordConfirm;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Call API to reset password with code and new password
      console.log('Password reset for:', email, 'with code:', code);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Fehler beim Zurücksetzen des Passworts. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if no code or email in URL
  if (!code || !email) {
    return (
      <Box className={styles.container}>
        <Box className={`${styles.formPanel} ${styles.formPanelVisible}`}>
          <Box className={styles.formSlide}>
            <Box className={styles.formLayout}>
              <Box className={styles.formHeader}>
                <Box className={styles.formLogo}>
                  <Image src="/svg/jobbi_head.svg" alt="Jobbi" width={80} height={80} />
                </Box>
                <Text className={styles.formHeading}>
                  Ungültiger
                  <br />
                  Link
                </Text>
              </Box>

              <Box className={styles.formFields}>
                <Text size="sm" c="dimmed">
                  Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link zum
                  Zurücksetzen deines Passworts an.
                </Text>
              </Box>

              <Box className={styles.formActions}>
                <Button size="lg" component={Link} href="/login" style={{ fontSize: '1rem' }}>
                  Zurück zum Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className={`${styles.panel} ${styles.schuelerPanel}`}>
          <Box className={styles.panelBackground}>
            <Image
              src="/images/jobbi-schueler-keyvisual.jpg"
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>
          <Box className={styles.panelOverlay} />
        </Box>

        <BasicFooter />
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={`${styles.formPanel} ${styles.formPanelVisible}`}>
        <Box className={styles.formSlide}>
          <Box className={styles.formLayout}>
            {/* Desktop header */}
            <Box className={styles.formHeader}>
              <Box className={styles.formLogo}>
                <Image src="/svg/jobbi_head.svg" alt="Jobbi" width={80} height={80} />
              </Box>
              <Text className={styles.formHeading}>
                {isSubmitted ? (
                  <>
                    Passwort
                    <br />
                    geändert!
                  </>
                ) : (
                  <>
                    Neues Passwort
                    <br />
                    vergeben
                  </>
                )}
              </Text>
            </Box>

            {/* Mobile header */}
            <Box className={styles.mobileHeader}>
              <Box className={styles.formLogo}>
                <Image src="/svg/jobbi_head.svg" alt="Jobbi" width={60} height={60} />
              </Box>
              <Text className={styles.mobileHeading}>
                {isSubmitted ? (
                  <>
                    Passwort
                    <br />
                    geändert!
                  </>
                ) : (
                  <>
                    Neues Passwort
                    <br />
                    vergeben
                  </>
                )}
              </Text>
            </Box>

            {!isSubmitted ? (
              <>
                <Box className={styles.formFields}>
                  <Text size="sm" c="dimmed" mb="md">
                    Gib ein neues Passwort ein und bestätige es. Danach kannst du dich wieder bei
                    Jobbi einloggen.
                  </Text>
                  <PasswordInput
                    placeholder="Neues Passwort (min. 8 Zeichen)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                  />
                  <PasswordInput
                    placeholder="Passwort wiederholen"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}

                    error={
                      passwordConfirm && password !== passwordConfirm
                        ? 'Passwörter stimmen nicht überein'
                        : undefined
                    }
                  />
                  {error && (
                    <Text size="sm" c="red">
                      {error}
                    </Text>
                  )}
                </Box>

                <Box className={styles.formActions}>
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    loading={isSubmitting}
                    style={{ fontSize: '1rem' }}
                  >
                    Neues Passwort erstellen
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box className={styles.formFields}>
                  <Text size="sm" c="dimmed">
                    Dein Passwort wurde erfolgreich geändert. Du kannst dich jetzt mit deinem neuen
                    Passwort einloggen.
                  </Text>
                </Box>

                <Box className={styles.formActions}>
                  <Button size="lg" component={Link} href="/login" style={{ fontSize: '1rem' }}>
                    Zum Login
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Background panel */}
      <Box className={`${styles.panel} ${styles.schuelerPanel}`}>
        <Box className={styles.panelBackground}>
          <Image
            src="/images/jobbi-schueler-keyvisual.jpg"
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>
        <Box className={styles.panelOverlay} />
      </Box>

      <BasicFooter />
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Box className={styles.container}>
          <Center style={{ height: '100vh' }}>
            <Loader size="lg" />
          </Center>
        </Box>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
