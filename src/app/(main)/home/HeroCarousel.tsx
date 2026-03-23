'use client';

import { useEffect, useState } from 'react';
import { Box, Text, Title, Button, Stack } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import type { EmblaCarouselType } from 'embla-carousel';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Werbung } from '@/types';
import styles from './page.module.css';

interface HeroCarouselProps {
  werbungs: Werbung[];
}

export function HeroCarousel({ werbungs }: HeroCarouselProps) {
  const router = useRouter();
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  useEffect(() => {
    if (!embla) return;

    const interval = setInterval(() => {
      embla.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [embla]);

  const handleButtonClick = (werbung: Werbung) => {
    if (werbung.jobaddid) {
      router.push(`/offer/${werbung.jobaddid}`);
    } else if (werbung.externebuttonurl) {
      window.open(werbung.externebuttonurl, '_blank');
    } else if (werbung.internebuttonurl) {
      router.push(werbung.internebuttonurl);
    }
  };

  return (
    <Carousel
      withIndicators
      height="100%"
      emblaOptions={{ loop: true }}
      className={styles.carousel}
      getEmblaApi={setEmbla}
      nextControlIcon={<Image src="/svg/arrow-right-white.svg" alt="" width={32} height={32} />}
      previousControlIcon={<Image src="/svg/arrow-left-white.svg" alt="" width={32} height={32} />}
    >
      {werbungs.map((werbung) => (
        <Carousel.Slide key={werbung.id}>
          <Box pos="relative" h="100%">
            {/* Background Image */}
            {werbung.hintergrundbild && (
              <>
                <Image
                  src={werbung.hintergrundbild}
                  alt=""
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                {/* Blurred copy with wave mask */}
                <div className={styles.blurredImageContainer}>
                  <Image
                    src={werbung.hintergrundbild}
                    alt=""
                    fill
                    style={{
                      objectFit: 'cover',
                      filter: 'blur(15px)',
                      transform: 'scale(1.1)',
                    }}
                  />
                </div>
              </>
            )}
            {/* Content */}
            <Stack
              align="center"
              justify="center"
              h="100%"
              p="xl"
              pos="relative"
              style={{ zIndex: 3 }}
            >
              {werbung.topline && (
                <Text size="lg" fw={500} ta="center">
                  {werbung.topline}
                </Text>
              )}
              <Title order={1} ta="center">
                {werbung.titel}
              </Title>
              {werbung.subtitel && (
                <Text size="lg" ta="center" maw={800}>
                  {werbung.subtitel}
                </Text>
              )}
              <Button onClick={() => handleButtonClick(werbung)}>
                {werbung.buttonname || 'Angebot anschauen'}
              </Button>
            </Stack>
            {/* Wave Overlay */}
            <img src="/svg/wave.svg" alt="" className={styles.waveOverlay} />
          </Box>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
