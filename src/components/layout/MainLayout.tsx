'use client';

import { Box } from '@mantine/core';
import { BasicFooter } from './BasicFooter';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Sidebar />
      <Box component="main" style={{ flex: 1 }}>
        {children}
      </Box>
      {showFooter && <BasicFooter />}
    </Box>
  );
}
