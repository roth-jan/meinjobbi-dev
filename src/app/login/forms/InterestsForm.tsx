'use client';

import { useState } from 'react';
import { Box, Button } from '@mantine/core';
import { LoginFormLayout } from './LoginFormLayout';
import { InterestsSelector } from '@/components/ui/InterestsSelector';
import styles from '../page.module.css';

interface InterestsFormProps {
  onSubmit: (selectedInterests: string[]) => void;
  currentHeading: React.ReactNode;
  loginLink: React.ReactNode;
}

export function InterestsForm({ onSubmit, currentHeading, loginLink }: InterestsFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <LoginFormLayout heading={currentHeading} wide>
      {/* Cards section - 3x3 interests grid */}
      <InterestsSelector
        selectedInterests={selectedInterests}
        onToggle={toggleInterest}
        maxSelections={3}
      />

      {/* Actions section */}
      <Box className={styles.formActions}>
        <Button
          size="lg"
          onClick={() => onSubmit(selectedInterests)}
          style={{ fontSize: '1rem' }}
          disabled={selectedInterests.length === 0}
        >
          Profil erstellen
        </Button>
        {loginLink}
      </Box>
    </LoginFormLayout>
  );
}
