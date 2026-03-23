'use client';

import { useEffect } from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';
import { AuthGuard } from '@/components';
import { Sidebar } from '@/components/layout/Sidebar';
import { useUser } from '@/stores/authStore';
import { AccountType } from '@/types';
import styles from './layout.module.css';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (user?.accountType === AccountType.Company) {
      setColorScheme('light');
    } else {
      setColorScheme('dark');
    }
  }, [user?.accountType, setColorScheme]);

  return (
    <AuthGuard>
      <Box className={styles.layout}>
        <div data-mantine-color-scheme="dark">
          <Sidebar />
        </div>
        <Box className={styles.main}>{children}</Box>
      </Box>
    </AuthGuard>
  );
}
