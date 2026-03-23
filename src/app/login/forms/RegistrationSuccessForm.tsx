"use client";

import { Box, Text, Button } from "@mantine/core";
import { LoginFormLayout } from "./LoginFormLayout";
import styles from "../page.module.css";

interface RegistrationSuccessFormProps {
  onGoToLogin: () => void;
  currentHeading: React.ReactNode;
}

export function RegistrationSuccessForm({
  onGoToLogin,
  currentHeading,
}: RegistrationSuccessFormProps) {
  return (
    <LoginFormLayout heading={currentHeading}>
      {/* Subtext */}
      <Text className={styles.formSubtext}>
        Deine Registrierung ist abgeschlossen. Logge dich mit deinen
        Zugangsdaten ein und starte deine Jobbi-Mission.
      </Text>

      {/* Actions section */}
      <Box className={styles.formActions}>
        <Button size="lg" onClick={onGoToLogin} style={{ fontSize: "1rem" }}>
          Zum Login
        </Button>
      </Box>
    </LoginFormLayout>
  );
}
