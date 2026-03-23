'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Text, Loader, Center, Stack, Button, Title } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getJobAdById } from '@/app/actions/jobAdActions';
import { getCompanyById } from '@/app/actions/companyActions';
import { getAllWerbungs } from '@/app/actions/werbungActions';
import { sendEmailToCompany } from '@/functions/authService';
import { useStudent } from '@/stores/authStore';
import { BasicFooter } from '@/components/layout';
import { FaqSection, Popup } from '@/components';
import { JobAd, Company, Werbung } from '@/types';
import styles from './page.module.css';

interface OfferContentProps {
  offerId: string;
}

export function OfferContent({ offerId }: OfferContentProps) {
  const [jobAd, setJobAd] = useState<JobAd | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [titleFontSize, setTitleFontSize] = useState(100);
  const [activePopup, setActivePopup] = useState<'info' | 'visit' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const student = useStudent();

  const calculateFontSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const isMobile = window.innerWidth <= 768;
    const multiplier = isMobile ? 1.0 : 0.95;
    const containerWidth = containerRef.current.offsetWidth * multiplier;
    const titleElement = titleRef.current;

    let min = 10;
    let max = 500;

    while (max - min > 1) {
      const mid = Math.floor((min + max) / 2);
      titleElement.style.fontSize = `${mid}px`;

      if (titleElement.scrollWidth <= containerWidth) {
        min = mid;
      } else {
        max = mid;
      }
    }

    setTitleFontSize(min);
  }, []);

  useEffect(() => {
    calculateFontSize();
    window.addEventListener('resize', calculateFontSize);
    return () => window.removeEventListener('resize', calculateFontSize);
  }, [calculateFontSize, jobAd, company]);

  useEffect(() => {
    async function loadData() {
      try {
        const id = parseInt(offerId, 10);
        if (isNaN(id)) {
          setError('Ungültige Angebots-ID');
          return;
        }
        const [jobAdData, allWerbungs] = await Promise.all([getJobAdById(id), getAllWerbungs()]);
        setJobAd(jobAdData);

        // Check if this offer has a premium Werbung (same logic as homepage)
        const hasPremiumWerbung = allWerbungs.some(
          (w: Werbung) => w.active && w.ispaid && !w.topline && w.jobaddid === id
        );
        setIsPremium(hasPremiumWerbung);

        if (jobAdData.companyid) {
          const companyData = await getCompanyById(jobAdData.companyid);
          setCompany(companyData);
        }
      } catch (err) {
        console.error('Failed to load job ad:', err);
        setError('Angebot nicht gefunden');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [offerId]);

  if (loading) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Loader color="blue" size="xl" />
      </Center>
    );
  }

  if (error || !jobAd) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" gap="md">
          <Text size="xl" fw={700}>
            {error || 'Angebot nicht gefunden'}
          </Text>
          <Text c="dimmed">Das angeforderte Stellenangebot existiert nicht.</Text>
        </Stack>
      </Center>
    );
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

  const handleSendEmail = async (isMoreInfo: boolean) => {
    if (!student?.id) {
      alert('Nur angemeldete Schüler können diese Funktion nutzen.');
      return;
    }

    if (!jobAd) {
      alert('Angebot nicht gefunden.');
      return;
    }

    setIsSubmitting(true);
    const result = await sendEmailToCompany(jobAd.id, student.id, isMoreInfo);

    if (result.success) {
      alert(result.message || 'E-Mail wurde gesendet!');
      setActivePopup(null);
    } else {
      alert(`Fehler: ${result.message}`);
    }
    setIsSubmitting(false);
  };

  const salaries = [
    jobAd.salary01,
    jobAd.salary02,
    jobAd.salary03,
    jobAd.salary04,
    jobAd.salary05,
  ].filter(Boolean);

  const logoUrl = company?.logopath || jobAd.logourl;

  return (
    <>
      {/* Hero Section */}
      <Box className={styles.heroSection}>
        <Box className={styles.logoBox}>
          {logoUrl ? (
            <Box className={styles.logoContainer}>
              <Image
                src={logoUrl}
                alt={company?.name || jobAd.companyname || ''}
                fill
                className={styles.logoImage}
              />
            </Box>
          ) : (
            <Box className={styles.logoPlaceholder}>
              <Text c="dimmed" size="sm">
                Logo
              </Text>
            </Box>
          )}
        </Box>

        <Box className={styles.heroContent}>
          {isPremium && <span className={styles.badge}>Top-Angebot</span>}
          <h1 className={styles.title}>{jobAd.jobtitle}</h1>
          <p className={styles.description}>{jobAd.briefdescription || jobAd.jobdescription}</p>
          <Button>Jetzt bewerben</Button>
        </Box>
      </Box>

      {/* Auf einen Blick Section */}
      <Box className={styles.blickSection} ref={containerRef}>
        <Title
          order={2}
          className={styles.blickTitle}
          ref={titleRef}
          style={{ fontSize: titleFontSize }}
        >
          Auf einen Blick
        </Title>

        <Box className={styles.infoBox}>
          <Box className={styles.infoColumn}>
            <span className={styles.infoLabel}>Unternehmen:</span>
            <span className={styles.infoValue}>{company?.name || jobAd.companyname}</span>
            <span className={styles.infoValue}>{company?.location || jobAd.cities}</span>
          </Box>

          {jobAd.duration && (
            <Box className={styles.infoColumn}>
              <span className={styles.infoLabel}>Dauer:</span>
              <span className={styles.infoValue}>{jobAd.duration}</span>
            </Box>
          )}

          {jobAd.jobtype && (
            <Box className={styles.infoColumn}>
              <span className={styles.infoLabel}>Jobtyp:</span>
              <span className={styles.infoValue}>{jobAd.jobtype}</span>
            </Box>
          )}

          {jobAd.startdate && (
            <Box className={styles.infoColumn}>
              <span className={styles.infoLabel}>Frühster Beginn:</span>
              <span className={styles.infoValue}>{formatDate(jobAd.startdate)}</span>
            </Box>
          )}

          {salaries.length > 0 && (
            <Box className={styles.infoColumn}>
              <span className={styles.infoLabel}>Gehalt:</span>
              {salaries.map((salary, index) => (
                <span key={index} className={styles.infoValue}>
                  Jahr {index + 1}: {salary}
                </span>
              ))}
            </Box>
          )}
        </Box>

        <Box className={styles.buttonRow}>
          <Button bg="var(--color-primary)" onClick={() => router.push('/home')}>
            Zurück zur Übersicht
          </Button>
          <Button bg="var(--color-primary)" onClick={() => setActivePopup('visit')}>
            Besuchstermin anfragen
          </Button>
          <Button bg="var(--color-primary)" onClick={() => setActivePopup('info')}>
            Infomaterial anfordern
          </Button>
        </Box>
      </Box>

      {/* Content Sections */}
      {company?.description && (
        <Box className={styles.section}>
          <h2 className={styles.sectionTitle}>Über uns</h2>
          <p className={styles.sectionContent}>{company.description}</p>
        </Box>
      )}

      {jobAd.taskdescription && (
        <Box className={styles.section}>
          <h2 className={styles.sectionTitle}>Deine Aufgaben</h2>
          <p className={styles.sectionContent}>{jobAd.taskdescription}</p>
        </Box>
      )}

      {jobAd.profiledescription && (
        <Box className={styles.section}>
          <h2 className={styles.sectionTitle}>Dein Profil</h2>
          <p className={styles.sectionContent}>{jobAd.profiledescription}</p>
        </Box>
      )}

      {jobAd.jobdescription && (
        <Box className={styles.section}>
          <h2 className={styles.sectionTitle}>Unser Angebot</h2>
          <p className={styles.sectionContent}>{jobAd.jobdescription}</p>
        </Box>
      )}

      {jobAd.applicationprocess && (
        <Box className={styles.section}>
          <h2 className={styles.sectionTitle}>Bewerbungsprozess</h2>
          <p className={styles.sectionContent}>{jobAd.applicationprocess}</p>
        </Box>
      )}

      {(jobAd.contactfirstname || jobAd.contactemail || jobAd.contactphone) && (
        <Box className={styles.contactBox}>
          <Box className={styles.contactLeft}>
            <h2 className={styles.sectionTitle}>Kontakt</h2>
            <p className={styles.sectionContent}>
              Für Rückfragen steht dir {jobAd.contactfirstname} {jobAd.contactlastname} gerne zur
              Verfügung. Wir freuen uns auf deine Bewerbung!
            </p>
          </Box>
          <Box className={styles.contactRight}>
            {jobAd.contactemail && <span className={styles.contactInfo}>{jobAd.contactemail}</span>}
            {jobAd.contactphone && <span className={styles.contactInfo}>{jobAd.contactphone}</span>}
          </Box>
          <Image
            src="/svg/pfeil-grafik.svg"
            alt=""
            width={180}
            height={180}
            className={styles.contactArrow}
          />
        </Box>
      )}

      <FaqSection />

      <Box className={styles.footerWrapper}>
        <BasicFooter />
      </Box>

      <Popup
        isOpen={activePopup === 'info'}
        onClose={() => setActivePopup(null)}
        title="Prima, dass du dich bewerben möchtest!"
        description="Gleich geht deine Bewerbung raus. Jobbi sendet eine E-Mail mit deinem Profil und deinen Kontaktdaten (E-Mail-Adresse und – falls vorhanden – Mobilnummer) automatisch an das ausgewählte Unternehmen. Das Unternehmen nutzt deine Angaben nur, um direkt mit dir Kontakt aufzunehmen. Alle Partnerunternehmen sind verpflichtet, deine Daten vertraulich zu behandeln und nicht an Dritte weiterzugeben."
        buttonText={isSubmitting ? 'Wird gesendet...' : 'Bewerbung jetzt absenden'}
        onButtonClick={() => handleSendEmail(true)}
      />

      <Popup
        isOpen={activePopup === 'visit'}
        onClose={() => setActivePopup(null)}
        title="Gut gemacht – du möchtest mehr erfahren!"
        description="Gleich wird deine Anfrage gesendet. Jobbi sendet eine E-Mail mit deinem Profil und deinen Kontaktdaten (E-Mail-Adresse und Mobilnummer) automatisch an das ausgewählte Unternehmen. Das Unternehmen nutzt deine Angaben nur, um dir Informationsmaterial zum Beruf oder zur Ausbildung zu schicken oder direkt mit dir Kontakt aufzunehmen. Alle Partnerunternehmen sind verpflichtet, deine Daten vertraulich zu behandeln und nicht an Dritte weiterzugeben."
        buttonText={isSubmitting ? 'Wird angefordert...' : 'Besuchstermin anfragen'}
        onButtonClick={() => handleSendEmail(false)}
      />
    </>
  );
}
