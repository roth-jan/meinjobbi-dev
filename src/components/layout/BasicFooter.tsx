import { Box, Text, Group } from '@mantine/core';
import Link from 'next/link';
import styles from './BasicFooter.module.css';

export function BasicFooter() {
  return (
    <Box className={styles.footer}>
      <Text className={styles.copyright}>
        © {new Date().getFullYear()} NTConsult Software & Service GmbH. Alle Rechte vorbehalten.
      </Text>
      <Group gap="lg" className={styles.footerLinks}>
        <a href="https://meinjobbi.de/impressum/" className={styles.footerLink}>
          Impressum
        </a>
        <a href="https://meinjobbi.de/datenschutz/" className={styles.footerLink}>
          Datenschutz
        </a>
        <a
          href="https://ntc.software/agb.html"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          AGB
        </a>
      </Group>
    </Box>
  );
}
