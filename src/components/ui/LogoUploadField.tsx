'use client';

import { useState } from 'react';
import { Box, Button, Group, Text, TextInput, Image } from '@mantine/core';
import { Popup } from './Popup';
import { InfoIcon } from './InfoIcon';
import logoInfoStyles from './LogoInfoModal.module.css';
import { uploadImage } from '@/lib/uploadImage';

interface LogoUploadFieldProps {
  value: string;
  onUpload: (fileName: string) => void;
  actionsClassName?: string;
  actionsLabelClassName?: string;
  error?: string;
}

export function LogoUploadField({
  value,
  onUpload,
  actionsClassName,
  actionsLabelClassName,
  error,
}: LogoUploadFieldProps) {
  const [showInfo, setShowInfo] = useState(false);

  const handleUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const url = await uploadImage(file);
          onUpload(url);
        } catch (error) {
          console.error('Upload failed:', error);
          // TODO: show error message
        }
      }
    };
    input.click();
  };

  return (
    <>
      <Popup
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Logo-Anforderungen"
      >
        <Group align="stretch" gap="lg" wrap="wrap" justify="center">
          <Box className={logoInfoStyles.item}>
            <Image
              src="/images/logo_horizontal.png"
              alt="Horizontal Logo example"
              maw={200}
              mah={200}
              fit="contain"
            />
            <Text size="sm" c="dimmed" mt="sm" ta="center">
              Mindestbreite von 280px
            </Text>
          </Box>
          <Box className={logoInfoStyles.item}>
            <Image
              src="/images/logo_vertical.png"
              alt="Vertical Logo example"
              maw={200}
              mah={200}
              fit="contain"
            />
            <Text size="sm" c="dimmed" mt="sm" ta="center">
              Mindesthöhe von 280px
            </Text>
          </Box>
        </Group>
      </Popup>
      <TextInput
        label="Logo"
        placeholder="Bitte eintragen"
        value={value}
        readOnly
        required
        error={error}
      />
      <Box className={actionsClassName}>
        <Box className={actionsLabelClassName} />
        <Box>
          <Button onClick={handleUpload}>Hochladen</Button>
          <Group mt="sm" gap={0} align="flex-start" wrap="nowrap">
            <Text fz={15} c="dimmed" maw={340}>
              Bitte beachten Sie, dass Ihr Logo an der längsten Seite ein
              Mindestmaß von min. 280px benötigt.
            </Text>
            <span
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setShowInfo(true)}
            >
              <InfoIcon />
            </span>
          </Group>
        </Box>
      </Box>
    </>
  );
}
