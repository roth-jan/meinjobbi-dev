'use client';

import { Box, Text, Button, UnstyledButton } from '@mantine/core';
import Image from 'next/image';
import styles from './Popup.module.css';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

export function Popup({
  isOpen,
  onClose,
  title,
  description,
  buttonText,
  onButtonClick,
  children,
}: PopupProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Box className={styles.overlay} onClick={handleOverlayClick}>
      <Box className={styles.popup}>
        <UnstyledButton className={styles.closeButton} onClick={onClose}>
          <Image src="/svg/circle_cross.svg" alt="Close" width={52} height={52} />
        </UnstyledButton>

        <Text className={styles.title}>{title}</Text>

        {description && <Text className={styles.description}>{description}</Text>}

        {children}

        {buttonText && (
          <Button size="lg" className={styles.actionButton} onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
}
