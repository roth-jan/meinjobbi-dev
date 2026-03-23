'use client';

import { Box, Text, Button } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { JobAd } from '@/types';
import styles from './JobOfferCard.module.css';

interface JobOfferCardProps {
  jobAd: JobAd;
}

export function JobOfferCard({ jobAd }: JobOfferCardProps) {
  return (
    <Box className={styles.card}>
      {/* Logo Section */}
      <Box className={styles.logoSection}>
        {jobAd.logourl ? (
          <Box className={styles.logoContainer}>
            <Image src={jobAd.logourl} alt={jobAd.companyname || ''} fill className={styles.logo} />
          </Box>
        ) : (
          <Box className={styles.logoPlaceholder}>
            <Text c="dimmed" size="sm">
              Logo
            </Text>
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Box className={styles.content}>
        <Box className={styles.textContent}>
          {jobAd.companyname && <Text className={styles.companyName}>{jobAd.companyname}</Text>}
          <Box className={styles.jobTitleWrapper}>
            <Text className={styles.jobTitle} lineClamp={2}>
              {jobAd.jobtitle}
            </Text>
          </Box>
          <Text className={styles.description} lineClamp={5}>
            {jobAd.briefdescription || jobAd.jobdescription}
          </Text>
        </Box>

        <Box className={styles.buttonWrapper}>
          <Button component={Link} href={`/offer/${jobAd.id}`}>
            Angebot anschauen
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
