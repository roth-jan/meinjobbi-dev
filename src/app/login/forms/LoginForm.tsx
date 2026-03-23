"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Text,
  Button,
  TextInput,
  PasswordInput,
  Checkbox,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginFormLayout } from "./LoginFormLayout";
import { ActionCard } from "../components/ActionCard";
import { heroContent, loginActionCards } from "../constants";
import { loginSchema, type LoginFormData } from "@/lib/schemas";
import { login } from "@/functions/authService";
import { useAuthStore } from "@/stores";
import styles from "../page.module.css";

type LoginMode = "schueler" | "unternehmen";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  mode?: LoginMode;
}

export function LoginForm({
  onSwitchToRegister,
  mode = "schueler",
}: LoginFormProps) {
  const router = useRouter();
  const loginUser = useAuthStore((state) => state.login);
  const isUnternehmen = mode === "unternehmen";

  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    const result = await login(data.email, data.password);

    if (result.success && result.user && result.token) {
      if (result.user.status === -1) {
        setServerError("Dieses Konto wurde gelöscht.");
        return;
      }

      loginUser(
        result.user,
        result.token,
        result.student || null,
        result.company || null,
      );

      if (rememberMe) {
        localStorage.setItem("jobbi_email", data.email);
      }
      router.push("/home");
    } else {
      setServerError(result.errorMessage || "Login fehlgeschlagen");
    }
  };

  const actionCards = loginActionCards[mode];

  return (
    <LoginFormLayout
      heading={
        <>
          Einloggen &<br />
          los geht's
        </>
      }
      wide={isUnternehmen}
      mobileText={
        isUnternehmen
          ? "Jobbi bringt Ihr Unternehmen direkt in die Schulen – auf Monitore, ins Webportal und in die App."
          : heroContent.text
      }
    >
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={styles.formFields}>
          <TextInput
            placeholder="E-Mail"
            {...register("email")}
            error={errors.email?.message}
            disabled={isSubmitting}
          />
          <PasswordInput
            placeholder="Passwort"
            {...register("password")}
            error={errors.password?.message}
            disabled={isSubmitting}
          />
          <Link href="/login/forgot-password" className={styles.forgotPassword}>
            <span className={styles.forgotPasswordHighlight}>Passwort</span>{" "}
            vergessen?
          </Link>
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.currentTarget.checked)}
            label="Daten für nächsten Login merken"
            className={styles.rememberMe}
            disabled={isSubmitting}
          />
          {serverError && (
            <Text c="red" size="sm">
              {serverError}
            </Text>
          )}
        </Box>

        <Box className={styles.formActions}>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            leftSection={
              <Image src="/svg/login-arrow.svg" alt="" width={24} height={24} />
            }
          >
            {isSubmitting ? "Wird eingeloggt..." : "Jetzt einloggen"}
          </Button>
          <Text className={styles.formActionText} size="xs" c="dimmed">
            Noch kein Account? Hier geht's zur{" "}
            <Link
              href="/register"
              className={styles.highlightedLink}
              onClick={(e) => {
                if (onSwitchToRegister) {
                  e.preventDefault();
                  onSwitchToRegister();
                }
              }}
            >
              Registrierung
            </Link>
            .
          </Text>
        </Box>
      </form>

      {/* Action Cards */}
      <Box className={isUnternehmen ? styles.formCardsRow : styles.formCards}>
        {actionCards.map((card) => (
          <ActionCard
            key={card.href}
            title={card.title}
            description={card.description}
            href={card.href}
          />
        ))}
      </Box>

      {!isUnternehmen && (
        <Text className={styles.mobileNote}>{heroContent.note}</Text>
      )}
    </LoginFormLayout>
  );
}
