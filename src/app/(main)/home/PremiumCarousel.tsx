'use client';

import { useEffect, useState } from 'react';
import { Box, Text, Button } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import type { EmblaCarouselType } from 'embla-carousel';
import Image from 'next/image';
import Link from 'next/link';
import { JobAd } from '@/types';
import styles from './PremiumCarousel.module.css';

interface PremiumCarouselProps {
  jobAds: JobAd[];
}

export function PremiumCarousel({ jobAds }: PremiumCarouselProps) {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  useEffect(() => {
    if (!embla) return;

    const interval = setInterval(() => {
      embla.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [embla]);

  if (jobAds.length === 0) return null;

  return (
    <Box className={styles.carouselContainer}>
      <Carousel
        withIndicators
        emblaOptions={{ loop: true }}
        className={styles.carousel}
        withControls={false}
        getEmblaApi={setEmbla}
      >
        {jobAds.map((jobAd) => (
          <Carousel.Slide key={jobAd.id}>
            <Box className={styles.card}>
              <Box className={styles.logoSection}>
                {jobAd.logourl ? (
                  <Box className={styles.logoContainer}>
                    <Image
                      src={jobAd.logourl}
                      alt={jobAd.companyname || ''}
                      fill
                      className={styles.logo}
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

              <Box className={styles.content}>
                <Box className={styles.textContent}>
                  <Box className={styles.topRow}>
                    <Text className={styles.topAngebot}>Top-Angebot</Text>
                    {jobAd.companyname && (
                      <Text className={styles.companyName}>{jobAd.companyname}</Text>
                    )}
                  </Box>
                  <Box className={styles.jobTitleWrapper}>
                    <Text className={styles.jobTitle} lineClamp={2}>
                      {jobAd.jobtitle}
                    </Text>
                  </Box>
                  <Text className={styles.description} lineClamp={4}>
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
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
