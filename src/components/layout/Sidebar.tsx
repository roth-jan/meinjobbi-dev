"use client";

import {
  Box,
  Stack,
  Text,
  UnstyledButton,
  Drawer,
  Group,
  Burger,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useUser } from "@/stores";
import { useStudent, useCompany } from "@/stores/authStore";
import { AccountType } from "@/types";
import styles from "./Sidebar.module.css";

const studentNavItems = [
  { href: "/home", label: "Start" },
  { href: "/chancen", label: "Chancen" },
  { href: "/schools-race", label: "School's Race" },
  { href: "/bewerbungen", label: "Bewerbungen" },
  { href: "/einstellungen", label: "Einstellungen" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support & Kontakt" },
];

const companyNavItems = [
  { href: "/home", label: "Start" },
  { href: "/jobads", label: "Stellenausschreibungen" },
  { href: "/werbung", label: "Werbung schalten" },
  { href: "/profilverwalten", label: "Profil verwalten" },
];

interface SidebarContentProps {
  onNavigate?: () => void;
  hideLogo?: boolean;
}

function SidebarContent({ onNavigate, hideLogo = false }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const student = useStudent();
  const company = useCompany();
  const logout = useAuthStore((state) => state.logout);
  const navItems = user?.accountType === AccountType.Company ? companyNavItems : studentNavItems;

  // Determine name to display - prioritize student if present, otherwise company
  const displayName = student
    ? `${student.firstname} ${student.lastname}`
    : company
      ? company.name
      : "User";

  const displayInitials = student
    ? `${student.firstname?.[0] || ""}${student.lastname?.[0] || ""}`
    : company
      ? company.name?.[0] || ""
      : "U";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <Box className={styles.sidebarContent}>
      {/* Logo - hidden on mobile drawer */}
      {!hideLogo && (
        <Link href="/home" className={styles.logo} onClick={onNavigate}>
          <Image
            src="/svg/jobbi_logo_text.svg"
            alt="Jobbi"
            width={72}
            height={28}
            priority
          />
          <Image
            src="/svg/jobbi_head.svg"
            alt=""
            width={38}
            height={38}
            priority
          />
        </Link>
      )}

      {/* Navigation */}
      <Stack gap={2} className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <UnstyledButton
              key={item.href}
              component={Link}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={onNavigate}
            >
              {item.label}
            </UnstyledButton>
          );
        })}
      </Stack>

      {/* User section */}
      <Box className={styles.userSection}>
        <Group gap="sm" className={styles.userInfo}>
          <Avatar size="sm" radius="xl" color="gray">
            {displayInitials}
          </Avatar>
          <Text className={styles.userName} c="white">
            {displayName}
          </Text>
        </Group>
        <UnstyledButton className={styles.logoutButton} onClick={handleLogout}>
          <Image
            src="/svg/logout-arrow.svg"
            alt=""
            width={28}
            height={28}
            style={{ marginTop: "-4px" }}
          />
          <Text className={styles.logoutText} c="white">Logout</Text>
        </UnstyledButton>
      </Box>
    </Box>
  );
}

export function Sidebar() {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <Box className={styles.desktopSidebar}>
        <SidebarContent />
      </Box>

      {/* Mobile Header */}
      <Box className={styles.mobileHeader}>
        <Burger opened={opened} onClick={toggle} color="white" size="sm" />
        <Link href="/home">
          <Image
            src="/svg/jobbi_logo_text.svg"
            alt="Jobbi"
            width={72}
            height={28}
            priority
          />
          <Image
            src="/svg/jobbi_head.svg"
            alt=""
            width={38}
            height={38}
            priority
          />
        </Link>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        position="top"
        size="100%"
        withCloseButton={false}
        classNames={{
          body: styles.mobileDrawerBody,
          content: styles.mobileDrawerContent,
        }}
      >
        <Box className={styles.mobileDrawerHeader}>
          <Burger opened={opened} onClick={toggle} color="white" size="sm" />
          <Link href="/home" onClick={close}>
            <Image
              src="/svg/jobbi_logo_text.svg"
              alt="Jobbi"
              width={72}
              height={28}
              priority
            />
            <Image
              src="/svg/jobbi_head.svg"
              alt=""
              width={38}
              height={38}
              priority
            />
          </Link>
        </Box>
        <SidebarContent onNavigate={close} hideLogo />
      </Drawer>
    </>
  );
}
