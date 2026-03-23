"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Box, Text, Title, Stack, Button } from "@mantine/core";
import { getAllWerbungs, getAllJobAds } from "@/app/actions";
import { Werbung, JobAd, AccountType } from "@/types";
import { HeroCarousel } from "./HeroCarousel";
import { JobOfferCard } from "./JobOfferCard";
import { PremiumCarousel } from "./PremiumCarousel";
import { BasicFooter, FaqSection } from "@/components";
import { useAuthStore } from "@/stores";
import { useStudent, useCompany } from "@/stores/authStore";
import styles from "./page.module.css";

export default function HomePage() {
  const [werbungs, setWerbungs] = useState<Werbung[]>([]);
  const [jobAds, setJobAds] = useState<JobAd[]>([]);
  const [premiumJobAds, setPremiumJobAds] = useState<JobAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [titleFontSize, setTitleFontSize] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { user, setUser } = useAuthStore();
  const student = useStudent();
  const company = useCompany();
  const isCompany = user?.accountType === AccountType.Company;

  // DEBUG - dane użytkownika
  useEffect(() => {
    console.log("=== USER DATA ===");
    console.log("User:", user);
    console.log("Student:", student);
    console.log("Company:", company);
    console.log("AccountType:", user?.accountType, isCompany ? "(Company)" : "(Student)");
  }, [user, student, company, isCompany]);

  const toggleAccountType = () => {
    if (!user) return;
    const newType = isCompany ? AccountType.Student : AccountType.Company;
    setUser({ ...user, accountType: newType });
  };

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
    window.addEventListener("resize", calculateFontSize);
    return () => window.removeEventListener("resize", calculateFontSize);
  }, [calculateFontSize, jobAds, premiumJobAds]);

  useEffect(() => {
    async function loadData() {
      try {
        const [allWerbungs, allJobAds] = await Promise.all([
          getAllWerbungs(),
          getAllJobAds(10, 1),
        ]);
        const filteredWerbungs = allWerbungs.filter(
          (w: Werbung) => w.active && w.ispaid && w.hintergrundbild,
        );
        setWerbungs(filteredWerbungs);

        const premiumWerbungs = allWerbungs.filter(
          (w: Werbung) => w.active && w.ispaid && !w.topline && w.jobaddid,
        );

        const premiumJobAdIds = premiumWerbungs.map((w: Werbung) => w.jobaddid);
        const filteredPremiumJobAds = allJobAds.filter(
          (j: JobAd) => j.active && premiumJobAdIds.includes(j.id),
        );
        setPremiumJobAds(filteredPremiumJobAds);

        const filteredJobAds = allJobAds.filter(
          (j: JobAd) => j.active && j.ispaid && !premiumJobAdIds.includes(j.id),
        );

        setJobAds(filteredJobAds);
      } catch (error) {
        console.error("Failed to load data:", error);
        if (error instanceof Error) {
          console.error("Detailed error:", error.message);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <>
      {/* DEV Toggle Button */}
      {process.env.NODE_ENV === "development" && (
        <Button
          onClick={toggleAccountType}
          size="xs"
          color="orange"
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 9999,
          }}
        >
          DEV: {isCompany ? "Company" : "Student"}
        </Button>
      )}

      {/* Hero Carousel Section */}
      <Box className={styles.hero}>
        {!loading && werbungs.length > 0 ? (
          <HeroCarousel werbungs={werbungs} />
        ) : (
          <Box className={styles.heroContent}>
            <Stack align="center" gap="md">
              <Title order={1} className={styles.slideTitle}>
                Willkommen bei Jobbi
              </Title>
              <Text
                ta="center"
                maw={600}
                className={styles.slideDescription}
              >
                Entdecke spannende Ausbildungsangebote in deiner Nähe.
              </Text>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Info Section */}
      <Box className={styles.infoSection}>
        <Box className={styles.infoGrid}>
          <Title order={2} className={styles.infoTitle}>
            Jobbi - Bildungsangebote
            <br />
            und Ausbildungsplatz in
            <br />
            Deiner Nähe
          </Title>
          <Text className={styles.infoText}>
            Auf Jobbi findest du alle aktuellen Ausbildungs- und
            Weiterbildungsangebote in deiner Region und kannst dich ganz einfach
            bewerben.
          </Text>
        </Box>
      </Box>

      {/* Job Offers Section */}
      <Box className={styles.jobOffersSection} ref={containerRef}>
        <Title
          order={2}
          className={styles.sectionTitle}
          ref={titleRef}
          style={{ fontSize: titleFontSize }}
        >
          Deine Angebote
        </Title>

        {/* Premium Carousel */}
        {premiumJobAds.length > 0 && <PremiumCarousel jobAds={premiumJobAds} />}

        {/* Regular Job Offers */}
        {jobAds.length > 0 && (
          <Stack className={styles.jobOffersList}>
            {jobAds.map((jobAd) => (
              <JobOfferCard key={jobAd.id} jobAd={jobAd} />
            ))}
          </Stack>
        )}
      </Box>

      {/* FAQ Section */}
      <FaqSection />

      <Box className={styles.footerWrapper}>
        <BasicFooter />
      </Box>
    </>
  );
}
