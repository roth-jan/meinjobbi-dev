'use client';

import { Box, Text } from '@mantine/core';
import Image from 'next/image';
import styles from '../page.module.css';

interface LoginFormLayoutProps {
  heading: React.ReactNode;
  wide?: boolean;
  /** Extra text shown below heading on mobile (e.g. hero text) */
  mobileText?: React.ReactNode;
  children: React.ReactNode;
}

export function LoginFormLayout({
  heading,
  wide,
  mobileText,
  children,
}: LoginFormLayoutProps) {
  return (
    <Box className={wide ? styles.formLayoutWide : styles.formLayout}>
      {/* Desktop header */}
      <Box className={styles.formHeader}>
        <Box className={styles.formLogo}>
          <Image src="/svg/jobbi_head.svg" alt="Jobbi" width={80} height={80} />
        </Box>
        <Text className={styles.formHeading}>{heading}</Text>
      </Box>

      {/* Mobile header */}
      <Box className={styles.mobileHeader}>
        <Box className={styles.formLogo}>
          <Image src="/svg/jobbi_head.svg" alt="Jobbi" width={60} height={60} />
        </Box>
        <Text className={styles.mobileHeading}>{heading}</Text>
        {mobileText && <Text className={styles.mobileText}>{mobileText}</Text>}
      </Box>

      {children}
    </Box>
  );
}
