'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Text, Title, Stack, Group } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import type { EmblaCarouselType } from 'embla-carousel';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { JobAd } from '@/types';
import styles from './TVCarousel.module.css';
import { getJobAdsForTvCarouselWithExcludes } from '@/app/actions/jobAdActions';

interface TVCarouselProps {
  jobAds: JobAd[];
  schoolCode: string;
}

export function TVCarousel({ jobAds, schoolCode }: TVCarouselProps) {
  const [realAds, setRealAds] = useState<JobAd[]>(jobAds || []);
  const [slides, setSlides] = useState<(JobAd & { __synthetic?: boolean; __sid?: string })[]>([]);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  const TOTAL_SLIDES = jobAds?.length || 8;
  const MAX_REALS = Math.ceil(TOTAL_SLIDES / 2);

  const syntheticTemplate = {
    __synthetic: true,
    __sid: 'synthetic-jobbi',
    id: 'synthetic-jobbi',
    jobtitle: 'Hier seht Ihr bald Ausbildungsmöglichkeiten in Eurer Nähe!',
    briefdescription:
      'Jobbi zeigt Euch, welche Firmen in Eurer Nähe Ausbildungsmöglichkeiten anbieten und wie Ihr Euch dort bewerben könnt.',
    jobdescription:
      'Jobbi bringt Ihre Ausbildungsangebote dorthin, wo junge Menschen sie wirklich sehen: in Schulen, online und direkt aufs Smartphone. So erreichen Sie Schüler:innen früher, relevanter und messbar – für mehr passende Bewerbungen und kürzere Besetzungszeiten.',
    logourl: '/svg/jobbi-logo-old.svg',
    companyname: 'Jobbi',
    cities: 'Dinslaken',
    jobtype: 'Ausbildung',
    startdate: new Date('2026-08-01'),
    salary01: 'keine Vergütung',
  } as any;

  const syntheticTemplate2 = {
    __synthetic: true,
    __sid: 'synthetic-jobbi2',
    id: 'synthetic-jobbi2',
    jobtitle: 'Ausbildung zum Bankkaufmann / -frau (m/w/d)',
    briefdescription:
      'Schule, fertig, los. Hier bist Du richtig: Starte jetzt Deine Ausbildung bei der Sparkasse Rhein-Maas - mit einem starken Team und tollen Möglichkeiten. Noch Fragen? ausbildung@skrm.de',
    jobdescription:
      'Schule, fertig, los. Hier bist Du richtig: Starte jetzt Deine Ausbildung bei der Sparkasse Rhein-Maas - mit einem starken Team und tollen Möglichkeiten. Noch Fragen? ausbildung@skrm.de',
    logourl: '/images/srm_logo.jpg',
    companyname: 'Sparkasse Rhein-Maas',
    cities: 'Kleve',
    jobtype: 'Ausbildung',
    startdate: new Date('2026-08-01'),
    salary01: '1343 €',
  } as any;

  const syntheticTemplates = [syntheticTemplate, syntheticTemplate2];

  const shuffle = <T,>(arr: T[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const buildSlides = useCallback(
    (reals: JobAd[]) => {
      const out: any[] = [];
      const limited = (reals || []).slice(0, MAX_REALS);

      for (let i = 0; i < 8; i++) {
        const tmpl = syntheticTemplates[i % syntheticTemplates.length];
        out.push({
          ...tmpl,
          __sid: tmpl.__sid + '-' + i + '-' + Date.now(),
        });
        if (out.length >= TOTAL_SLIDES) break;
      }

      setSlides(out.slice(0, TOTAL_SLIDES));
    },
    [MAX_REALS, TOTAL_SLIDES]
  );

  useEffect(() => {
    const s = new Set<number>();
    (jobAds || []).forEach((a) => s.add(a.id));
    seenIdsRef.current = s;
    setRealAds((jobAds || []).slice(0, MAX_REALS));
    buildSlides((jobAds || []).slice(0, MAX_REALS));
  }, [jobAds, buildSlides, MAX_REALS]);

  const loadMoreOffers = useCallback(async () => {
    try {
      const excludeIds = Array.from(seenIdsRef.current);
      const candidates = await getJobAdsForTvCarouselWithExcludes(
        schoolCode,
        TOTAL_SLIDES,
        excludeIds
      );
      if (!Array.isArray(candidates) || candidates.length === 0) return;
      const picked = shuffle(candidates).slice(0, MAX_REALS);
      seenIdsRef.current = new Set(picked.map((p) => p.id));
      setRealAds(picked);
      buildSlides(picked);
    } catch { }
  }, [schoolCode, MAX_REALS, buildSlides, TOTAL_SLIDES]);

  useEffect(() => {
    if (!embla) return;
    const interval = setInterval(() => {
      embla.scrollNext();
    }, 10000);
    return () => clearInterval(interval);
  }, [embla]);

  const handleSlideChange = async (index: number) => {
    if (index === slides.length - 1) {
      await loadMoreOffers();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  const truncateText = (text?: string, maxLength = 300) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const getQrValue = (slide: any) => {
    const sid: string = slide.__sid ?? String(slide.id ?? '');
    if (sid.startsWith('synthetic-jobbi2')) {
      return 'https://tinyurl.com/mtbvj22z';
      //  return 'https://www.sparkasse-rhein-maas.de/de/home/ihre-sparkasse/karriere.html?n=true&stref=search&q=Ausbildung';
    }
    return 'https://meinjobbi.de';
  };

  return (
    <Box className={styles.carouselWrapper}>
      <Carousel
        withIndicators
        height="100%"
        emblaOptions={{ loop: true }}
        className={styles.carousel}
        withControls={false}
        getEmblaApi={setEmbla}
        onSlideChange={handleSlideChange}
      >
        {slides.map((slide) => {
          const isSynthetic = Boolean(slide.__synthetic);
          const isSynthetic2 = slide.__sid?.startsWith('synthetic-jobbi2');
          const key = isSynthetic ? slide.__sid || slide.id : slide.id;

          return (
            <Carousel.Slide key={String(key)}>
              <Box className={styles.slide}>
                <Box className={styles.mainContent}>
                  <Box className={styles.logoBox}>
                    {slide.logourl ? (
                      <div className={`${styles.logoContainer} ${isSynthetic2 ? styles.synthetic2LogoBg : ''}`}>
                        <Image src={slide.logourl} alt="" fill className={styles.companyLogo} />
                      </div>
                    ) : (
                      <Box className={`${styles.logoPlaceholder} ${isSynthetic2 ? styles.synthetic2LogoBg : ''}`}>
                        <Text c="dimmed">Logo</Text>
                      </Box>
                    )}
                  </Box>

                  <Stack className={styles.jobDetails}>
                    <Title order={1} className={styles.jobTitle}>
                      {' '}
                      {slide.jobtitle}{' '}
                    </Title>
                    <Text className={styles.jobDescription}>
                      {' '}
                      {truncateText(slide.briefdescription || slide.jobdescription)}{' '}
                    </Text>

                    <Group className={styles.qrSection}>
                      <Box className={styles.qrCode}>
                        {slide.__sid?.startsWith('synthetic-jobbi2') ? (
                          <Image
                            src="/images/srm_qr.png"
                            alt="QR Code"
                            fill
                            className={styles.qrImage}
                          />
                        ) : (
                          <QRCodeSVG
                            value={getQrValue(slide)}
                            size={256}
                            level="Q"
                            bgColor="#ffffff"
                            fgColor="#f5a623"
                          />
                        )}
                      </Box>
                      {isSynthetic ? (
                        <Text className={styles.qrText}>
                          {' '}
                          Interessiert? <br /> Jetzty Jobbi <br /> kennenlernen!{' '}
                        </Text>
                      ) : (
                        <Text className={styles.qrText}>
                          {' '}
                          Interessiert? Mehr <br /> Infos zu der Stelle <br /> findest du hier!{' '}
                        </Text>
                      )}
                    </Group>
                  </Stack>
                </Box>

                <Box className={styles.sidebar}>
                  <Stack style={{ gap: '2vw' }}>
                    <Box>
                      <Text className={styles.infoLabel}>Unternehmen:</Text>
                      <Text className={styles.infoValue}>{slide.companyname || '-'}</Text>
                    </Box>
                    <Box>
                      <Text className={styles.infoLabel}>Ort:</Text>
                      <Text className={styles.infoValue}>{slide.cities || 'Dinslaken'}</Text>
                    </Box>
                    <Box>
                      <Text className={styles.infoLabel}>Typ:</Text>
                      <Text className={styles.infoValue}>{slide.jobtype || 'Ausbildung'}</Text>
                    </Box>
                    <Box>
                      <Text className={styles.infoLabel}>Ausbildungsstart:</Text>
                      <Text className={styles.infoValue}>{formatDate(slide.startdate)}</Text>
                    </Box>
                    <Box>
                      <Text className={styles.infoLabel}>Startgehalt:</Text>
                      <Text className={styles.infoValue}>{slide.salary01 || '-'}</Text>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </Box>
  );
}
