'use client';

import { useState } from 'react';
import { Box, Text, UnstyledButton, Button, Switch } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BasicFooter } from '@/components/layout';
import { ForgotPasswordForm } from '../forms';
import { heroContent } from '../constants';
import styles from '../page.module.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [hoveredPanel, setHoveredPanel] = useState<'none' | 'schueler' | 'unternehmen'>('none');

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  return (
    <Box className={styles.container}>
      {/* Toggle Switch - hidden but keeps layout consistent */}
      <Box className={`${styles.toggleContainer} ${styles.toggleVisible}`}>
        <Text className={`${styles.toggleLabel} ${styles.toggleLabelActive}`}>Schüler</Text>
        <Switch
          checked={false}
          onChange={() => {}}
          size="lg"
          color="jobbiGold"
          thumbIcon={null}
          disabled
        />
        <Text className={styles.toggleLabel}>Unternehmen</Text>
      </Box>

      {/* Form Panel */}
      <Box className={`${styles.formPanel} ${styles.formPanelVisible}`}>
        <Box className={`${styles.formSlide} ${styles.slideIn}`}>
          <ForgotPasswordForm onSwitchToLogin={handleSwitchToLogin} />
        </Box>
      </Box>

      {/* Unternehmen Panel */}
      <Box
        className={`${styles.panel} ${styles.unternehmenPanel} ${styles.panelHiddenMobile} ${styles.panelNoDim}`}
        onMouseEnter={() => setHoveredPanel('unternehmen')}
        onMouseLeave={() => setHoveredPanel('none')}
      >
        <Box className={styles.panelBackground}>
          <Image
            src="/images/jobbi-unternehmen-keyvisual.jpg"
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>
        <Box className={styles.panelContent}>
          <UnstyledButton
            onClick={() => router.push('/login/unternehmen')}
            className={styles.loginButton}
          >
            <Text className={styles.loginButtonTitle}>Login für Unternehmen</Text>
            <Text className={styles.loginButtonSubtitle}>Jetzt einloggen oder registrieren.</Text>
          </UnstyledButton>
        </Box>
      </Box>

      {/* Schüler Panel */}
      <Box
        className={`${styles.panel} ${styles.schuelerPanel} ${styles.panelHiddenMobile} ${styles.panelNoDim}`}
        onMouseEnter={() => setHoveredPanel('schueler')}
        onMouseLeave={() => setHoveredPanel('none')}
      >
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
        <Box className={`${styles.panelContent} ${styles.panelContentHidden}`} />
        <Box className={`${styles.heroContent} ${styles.heroContentVisible}`}>
          <Box className={styles.heroTop}>
            <Text className={styles.heroTitle}>
              {heroContent.title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </Text>
            <Text className={styles.heroText}>
              {heroContent.text} <span className={styles.asterisk}>*</span>
            </Text>
          </Box>
          <Box className={styles.heroBottom}>
            <Text className={styles.heroNote}>{heroContent.note}</Text>
          </Box>
        </Box>
      </Box>

      <BasicFooter />
    </Box>
  );
}
