'use client';

import { useState, useEffect } from 'react';
import { Box, Text, UnstyledButton, Button, Switch } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { BasicFooter } from '@/components/layout';
import { AccountType } from '@/types/user';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './RegisterForm';
import { heroContent } from './constants';
import styles from './page.module.css';

const isDev = process.env.NODE_ENV === 'development';

export type RegisterStep =
  | 'form'
  | 'parental-consent'
  | 'interests'
  | 'code-verification'
  | 'success';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [activeLogin, setActiveLogin] = useState<'none' | 'schueler' | 'unternehmen'>('none');
  const [hoveredPanel, setHoveredPanel] = useState<'none' | 'schueler' | 'unternehmen'>('none');
  // Separate states for Schüler and Unternehmen
  const [schuelerRegistering, setSchuelerRegistering] = useState(false);
  const [schuelerRegisterStep, setSchuelerRegisterStep] = useState<RegisterStep>('form');
  const [schuelerRegisterKey, setSchuelerRegisterKey] = useState(0);
  const [schuelerFormVisible, setSchuelerFormVisible] = useState(false);

  const [unternehmenRegistering, setUnternehmenRegistering] = useState(false);
  const [unternehmenRegisterStep, setUnternehmenRegisterStep] = useState<RegisterStep>('form');
  const [unternehmenRegisterKey, setUnternehmenRegisterKey] = useState(0);
  const [unternehmenFormVisible, setUnternehmenFormVisible] = useState(false);

  const isExpanded = activeLogin !== 'none';

  // Delay adding visible class so the position class is applied first
  useEffect(() => {
    if (activeLogin === 'schueler') {
      const timer = requestAnimationFrame(() => {
        setSchuelerFormVisible(true);
      });
      return () => cancelAnimationFrame(timer);
    }
    setSchuelerFormVisible(false);
  }, [activeLogin]);

  useEffect(() => {
    if (activeLogin === 'unternehmen') {
      const timer = requestAnimationFrame(() => {
        setUnternehmenFormVisible(true);
      });
      return () => cancelAnimationFrame(timer);
    }
    setUnternehmenFormVisible(false);
  }, [activeLogin]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Schüler handlers
  const handleSchuelerSwitchToRegister = () => {
    setSchuelerRegisterKey((k) => k + 1);
    setSchuelerRegisterStep('form');
    setSchuelerRegistering(true);
    scrollToTop();
  };

  const handleSchuelerSwitchToLogin = () => {
    setSchuelerRegistering(false);
    scrollToTop();
  };

  // Unternehmen handlers
  const handleUnternehmenSwitchToRegister = () => {
    setUnternehmenRegisterKey((k) => k + 1);
    setUnternehmenRegisterStep('form');
    setUnternehmenRegistering(true);
    scrollToTop();
  };

  const handleUnternehmenSwitchToLogin = () => {
    setUnternehmenRegistering(false);
    scrollToTop();
  };

  const getSchuelerRegisterHeading = () => {
    switch (schuelerRegisterStep) {
      case 'parental-consent':
        return (
          <>
            Du bist unter 16
            <br />
            E-Mail der Eltern benötigt
          </>
        );
      case 'interests':
        return (
          <>
            Deine Stärken
            <br />& Interessen
          </>
        );
      case 'code-verification':
        return <>Fast geschafft!</>;
      case 'success':
        return <>Du bist jetzt Jobbinaut!</>;
      default:
        return (
          <>
            Erstelle dein
            <br />
            Jobbi-Profil
          </>
        );
    }
  };

  const getUnternehmenRegisterHeading = () => {
    switch (unternehmenRegisterStep) {
      case 'success':
        return <>Registrierung erfolgreich!</>;
      default:
        return (
          <>
            Unternehmen
            <br />
            registrieren
          </>
        );
    }
  };

  const isSchueler = activeLogin === 'schueler';

  const handleDevLogin = () => {
    login(
      {
        id: 1,
        email: 'dev@test.com',
        vorname: 'Dev',
        nachname: 'User',
        accountType: AccountType.Company,
      },
      'dev-token'
    );
    router.push('/home');
  };

  const handleSchuelerClick = () => {
    setActiveLogin('schueler');
    setSchuelerRegistering(false);
  };

  const handleUnternehmenClick = () => {
    setActiveLogin('unternehmen');
    setUnternehmenRegistering(false);
  };

  const handleToggleChange = () => {
    // Reset all states when switching
    setSchuelerRegistering(false);
    setSchuelerRegisterStep('form');
    setUnternehmenRegistering(false);
    setUnternehmenRegisterStep('form');
    setActiveLogin(isSchueler ? 'unternehmen' : 'schueler');
  };

  return (
    <Box className={styles.container}>
      {/* Dev button */}
      {isDev && (
        <Button
          onClick={handleDevLogin}
          variant="filled"
          color="red"
          size="xs"
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 100 }}
        >
          DEV: Homepage
        </Button>
      )}

      {/* Toggle Switch */}
      <Box className={`${styles.toggleContainer} ${isExpanded ? styles.toggleVisible : ''}`}>
        <Text className={`${styles.toggleLabel} ${isSchueler ? styles.toggleLabelActive : ''}`}>
          Schüler
        </Text>
        <Switch
          checked={!isSchueler}
          onChange={handleToggleChange}
          size="lg"
          color="jobbiGold"
          thumbIcon={null}
          className={styles.toggleSwitch}
        />
        <Text className={`${styles.toggleLabel} ${!isSchueler ? styles.toggleLabelActive : ''}`}>
          Unternehmen
        </Text>
      </Box>

      {/* Form Panel - Schüler (LEFT) */}
      <Box className={`${styles.formPanel} ${schuelerFormVisible ? styles.formPanelVisible : ''}`}>
        <Box
          className={`${styles.formSlide} ${schuelerRegistering ? styles.slideOutLeft : styles.slideIn}`}
        >
          <LoginForm onSwitchToRegister={handleSchuelerSwitchToRegister} />
        </Box>
        <Box
          className={`${styles.formSlide} ${schuelerRegistering ? styles.slideIn : styles.slideOutRight}`}
        >
          <RegisterForm
            key={schuelerRegisterKey}
            onSwitchToLogin={handleSchuelerSwitchToLogin}
            onStepChange={setSchuelerRegisterStep}
            currentHeading={getSchuelerRegisterHeading()}
          />
        </Box>
      </Box>

      {/* Form Panel - Unternehmen (RIGHT) */}
      <Box
        className={`${styles.formPanel} ${styles.formPanelRight} ${unternehmenFormVisible ? styles.formPanelVisible : ''}`}
      >
        <Box
          className={`${styles.formSlide} ${unternehmenRegistering ? styles.slideOutLeft : styles.slideIn}`}
        >
          <LoginForm onSwitchToRegister={handleUnternehmenSwitchToRegister} mode="unternehmen" />
        </Box>
        <Box
          className={`${styles.formSlide} ${unternehmenRegistering ? styles.slideIn : styles.slideOutRight}`}
        >
          <RegisterForm
            key={unternehmenRegisterKey}
            onSwitchToLogin={handleUnternehmenSwitchToLogin}
            onStepChange={setUnternehmenRegisterStep}
            currentHeading={getUnternehmenRegisterHeading()}
            mode="unternehmen"
          />
        </Box>
      </Box>

      {/* Unternehmen Panel */}
      <Box
        className={`${styles.panel} ${styles.unternehmenPanel} ${isExpanded ? `${styles.panelHiddenMobile} ${styles.panelNoDim}` : ''} ${!isExpanded && hoveredPanel === 'schueler' ? styles.panelDimmed : ''}`}
        onMouseEnter={() => !isExpanded && setHoveredPanel('unternehmen')}
        onMouseLeave={() => !isExpanded && setHoveredPanel('none')}
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
        <Box className={styles.panelOverlay} />
        <Box className={`${styles.panelContent} ${isExpanded ? styles.panelContentHidden : ''}`}>
          <UnstyledButton onClick={handleUnternehmenClick} className={styles.loginButton}>
            <Text className={styles.loginButtonTitle}>Login für Unternehmen</Text>
            <Text className={styles.loginButtonSubtitle}>Jetzt einloggen oder registrieren.</Text>
          </UnstyledButton>
        </Box>
        <Box
          className={`${styles.heroContent} ${styles.heroContentLeft} ${activeLogin === 'unternehmen' ? styles.heroContentVisible : ''}`}
        >
          <Box className={styles.heroTop}>
            <Text className={styles.heroTitle}>
              Ihr Draht zu
              <br />
              jungen Talenten
            </Text>
            <Text className={styles.heroText}>
              Jobbi bringt Ihr Unternehmen direkt in die Schulen – auf Monitore, ins Webportal und
              in die App. So erreichen Sie junge Talente dort, wo Berufsorientierung wirklich
              stattfindet. Schüler:innen können Infos anfordern, Besuchstermine vereinbaren oder
              sich direkt bei Ihnen bewerben – einfach, digital und regional wirksam.
            </Text>
          </Box>
          <Box className={styles.heroBottom} />
        </Box>
      </Box>

      {/* Schüler Panel */}
      <Box
        className={`${styles.panel} ${styles.schuelerPanel} ${isExpanded ? `${styles.panelHiddenMobile} ${styles.panelNoDim}` : ''} ${!isExpanded && hoveredPanel === 'unternehmen' ? styles.panelDimmed : ''}`}
        onMouseEnter={() => !isExpanded && setHoveredPanel('schueler')}
        onMouseLeave={() => !isExpanded && setHoveredPanel('none')}
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
        <Box className={`${styles.panelContent} ${isExpanded ? styles.panelContentHidden : ''}`}>
          <UnstyledButton onClick={handleSchuelerClick} className={styles.loginButton}>
            <Text className={styles.loginButtonTitle}>Login für Schüler</Text>
            <Text className={styles.loginButtonSubtitle}>Jetzt einloggen oder registrieren.</Text>
          </UnstyledButton>
        </Box>
        <Box
          className={`${styles.heroContent} ${activeLogin === 'schueler' ? styles.heroContentVisible : ''}`}
        >
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

      {/* Logo - only shown when not expanded */}
      {!isExpanded && (
        <Box className={styles.logo}>
          <Image
            src="/svg/jobbi_logo_new.svg"
            alt="Job x Bildung"
            width={170}
            height={107}
            priority
          />
        </Box>
      )}

      {/* Center headline overlay - only shown when not expanded */}
      {!isExpanded && (
        <Box className={styles.centerOverlay}>
          <Text className={styles.headline}>
            Jetzt durchstarten.
            <br />
            Gemeinsam Zukunft bewegen.
          </Text>
        </Box>
      )}

      <BasicFooter />
    </Box>
  );
}
