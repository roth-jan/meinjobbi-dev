import { Box, Text, Button } from '@mantine/core';
import styles from './DeleteProfileSection.module.css';

interface DeleteProfileSectionProps {
  description?: string;
  onDelete: () => void;
  loading?: boolean;
}

export function DeleteProfileSection({
  description = 'Lösche Dein Profil und alle darin enthaltenen Inhalte dauerhaft von der Jobbi-Plattform. Dieser Vorgang kann nicht rückgängig gemacht werden.',
  onDelete,
  loading,
}: DeleteProfileSectionProps) {
  return (
    <Box className={styles.box}>
      <Box style={{ flex: 1 }}>
        <Text fw={700} fz="var(--font-subtext)" lh="var(--font-subtext-lh)" mb={4}>Profil löschen</Text>
        <Text fz="var(--font-copytext)" lh="var(--font-copytext-lh)" maw={500}>{description}</Text>
      </Box>
      <Button color="red" onClick={onDelete} loading={loading} style={{ flexShrink: 0 }}>
        Profil löschen
      </Button>
    </Box>
  );
}
