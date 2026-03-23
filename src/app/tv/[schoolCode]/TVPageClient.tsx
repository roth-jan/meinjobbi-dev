'use client';
import { useEffect, useState } from 'react';
import { Box, Text, Loader, Center, Stack } from '@mantine/core';
import { getSchoolByCode } from '@/app/actions';
import { getJobAdsForTvCarousel } from '@/app/actions/jobAdActions';
import { JobAd, School } from '@/types';
import { TVCarousel } from './TVCarousel';
import styles from './page.module.css';
import Image from 'next/image';

const PageRefreshIntervals = 120; // minutes

interface TVPageClientProps {
  schoolCode: string;
}

export function TVPageClient({ schoolCode }: TVPageClientProps) {
  const [school, setSchool] = useState<School | null>(null);
  const [jobAds, setJobAds] = useState<JobAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [schoolData, randomJobAds] = await Promise.all([
          getSchoolByCode(schoolCode),
          getJobAdsForTvCarousel(schoolCode, 8),
        ]);
        setSchool(schoolData);
        setJobAds(randomJobAds);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Schule nicht gefunden');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [schoolCode]);

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, PageRefreshIntervals * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box className={styles.tvPage}>
        <Center h="100%">
          <Loader color="blue" size="xl" />
        </Center>
      </Box>
    );
  }
  if (error || !school) {
    return (
      <Box className={styles.tvPage}>
        <Box className={styles.header}>
          <Box />
          <Image
            src="/svg/jobbi_logo_new.svg"
            alt="Jobbi"
            width={150}
            height={60}
            className={styles.logo}
          />
        </Box>
        <Center h="100%">
          <Stack align="center" gap="md">
            <Text className={styles.errorTitle}>Schule nicht gefunden</Text>
            <Text className={styles.errorText}>Die angegebene Schul-ID jest ungültig.</Text>
          </Stack>
        </Center>
      </Box>
    );
  }
  return (
    <Box className={styles.tvPage}>
      <Box className={styles.header}>
        <Box className={styles.schoolInfo}>
          <Text className={styles.schoolName}>{school.name}</Text>
          <Text className={styles.schoolCity}>{school.city}</Text>
        </Box>
        <Image
          src="/svg/jobbi-logo-old.svg"
          alt="Jobbi"
          width={150}
          height={60}
          className={styles.logo}
        />
      </Box>

      <Box className={styles.carouselContainer}>
        {jobAds.length > 0 ? (
          <TVCarousel jobAds={jobAds} schoolCode={schoolCode} />
        ) : (
          <Center h="100%">
            <Stack align="center" gap="md">
              <Text className={styles.errorTitle}>Keine Stellenanzeigen verfügbar</Text>
              <Text className={styles.errorText}>
                Für {school.city} sind derzeit keine Stellenanzeigen verfügbar.
              </Text>
            </Stack>
          </Center>
        )}
      </Box>
    </Box>
  );
}
