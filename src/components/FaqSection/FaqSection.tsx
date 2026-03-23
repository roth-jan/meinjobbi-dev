'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Title, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FaqSection.module.css';

export function FaqSection() {
  const [titleFontSize, setTitleFontSize] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const calculateFontSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
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
  }, [calculateFontSize]);

  return (
    <Box className={styles.container} ref={containerRef}>
      <Title order={2} className={styles.title} ref={titleRef} style={{ fontSize: titleFontSize }}>
        Fragen? Na klar!
      </Title>
      <Box className={styles.cardsWrapper}>
        <Link href="/support" className={styles.card}>
          <Box className={styles.cardContent}>
            <Title order={3} className={styles.cardTitle}>
              Support
            </Title>
            <Text className={styles.cardSubtext}>
              Schreib uns und wir helfen Dir bei Deinem individuellen Anliegen!
            </Text>
          </Box>
          <Image
            src="/svg/pfeil-grafik.svg"
            alt=""
            width={180}
            height={180}
            className={styles.cardArrow}
          />
        </Link>
        <Link href="/faq" className={styles.card}>
          <Box className={styles.cardContent}>
            <Title order={3} className={styles.cardTitle}>
              FAQ
            </Title>
            <Text className={styles.cardSubtext}>
              Schau rein und erhalte Hilfe auf die häufigsten Fragen!
            </Text>
          </Box>
          <Image
            src="/svg/pfeil-grafik.svg"
            alt=""
            width={180}
            height={180}
            className={styles.cardArrow}
          />
        </Link>
      </Box>
    </Box>
  );
}
