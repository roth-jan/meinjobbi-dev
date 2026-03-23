"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Card,
    TextInput,
    PasswordInput,
    NumberInput,
    Select,
    Button,
    Title,
    Alert,
    Stack,
    Group,
} from "@mantine/core";
import { BasicFooter } from "@/components";
import { DeleteProfileSection } from "@/components/ui/DeleteProfileSection";
import { LogoUploadField } from "@/components/ui/LogoUploadField";
import styles from "./page.module.css";
import { useCompany, useAuthStore, useUser } from "@/stores/authStore";
import {
    updateCompany as updateCompanyAction,
    getCompanyById,
} from "@/app/actions/companyActions";
import { changePassword, deleteAccount } from "@/functions/authService";
import {
    profilVerwaltenSchema,
    type ProfilVerwaltenFormData,
} from "@/lib/schemas";

const INDUSTRIES = [
    "IT",
    "Social",
    "Handwerk",
    "Gesundheit",
    "Bildung",
    "Handel",
    "Industrie",
];

export default function ProfilVerwaltenPage() {
    const router = useRouter();
    const company = useCompany();
    const user = useUser();
    const { setCompany, logout } = useAuthStore();

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [initialized, setInitialized] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ProfilVerwaltenFormData>({
        resolver: zodResolver(profilVerwaltenSchema),
        defaultValues: {
            logopath: "",
            name: "",
            description: "",
            zipcode: "",
            location: "",
            address: "",
            industry: "",
            companysize: undefined,
            contactName: "",
            email: "",
            phone: "",
            currentPassword: "",
            newPassword: "",
        },
    });

    useEffect(() => {
      console.log("ProfilVerwaltenPage mounted, user and company from store:", {
        user,
        company
      });
      if (user?.companyId) {
            getCompanyById(user.companyId)
                .then((c) => setCompany(c))
                .catch((err) => console.error("failed to load company", err));
                console.log("Company loaded in ProfilVerwaltenPage:", company);
        }
    }, [user?.companyId]);

    useEffect(() => {
        if (!initialized && (company || user)) {
            reset({
                logopath: company?.logopath || "",
                name: company?.name || "",
                description: company?.description || "",
                zipcode: company?.zipcode || "",
                location: company?.location || "",
                address: company?.address || "",
                industry: company?.industry || "",
                companysize: company?.companysize ?? undefined,
                contact_name: company?.contact_name || "",
                email: user?.email || "",
                phone: company?.phone || "",
                currentPassword: "",
                newPassword: "",
            });
            setInitialized(true);
        }
    }, [initialized, company, user, reset]);

    const onSubmit = async (data: ProfilVerwaltenFormData) => {
        if (!company?.id) return;

        const {
            contactName,
            email,
            currentPassword,
            newPassword,
            ...companyData
        } = data;
        setIsSaving(true);
        setMessage(null);

        try {
            const updated = await updateCompanyAction(company.id, companyData);
            if (updated) setCompany(updated);

            if (newPassword) {
                const result = await changePassword(
                    user!.id,
                    newPassword,
                    user!.email,
                );
                if (!result.success) {
                    throw new Error(
                        result.message || "Fehler beim Ändern des Passworts",
                    );
                }
                setMessage({
                    type: "success",
                    text: "Profil und Passwort erfolgreich geändert! Sie werden in Kürze abgemeldet...",
                });
                setTimeout(() => {
                    logout();
                    router.push("/login");
                }, 2000);
            } else {
                setMessage({
                    type: "success",
                    text: "Profil erfolgreich aktualisiert!",
                });
            }
        } catch {
            setMessage({
                type: "error",
                text: "Fehler beim Aktualisieren des Profils",
            });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const handleDeleteProfile = async () => {
        if (!user?.id || !user?.email) return;
        setIsDeleting(true);
        setMessage(null);

        try {
            const result = await deleteAccount(user.email);
            if (result.success) {
                setMessage({
                    type: "success",
                    text: "Profil erfolgreich gelöscht! Sie werden in Kürze abgemeldet...",
                });
                setTimeout(() => {
                    logout();
                    router.push("/login");
                }, 2000);
            } else {
                setMessage({
                    type: "error",
                    text: result.message || "Fehler beim Löschen des Profils",
                });
            }
        } catch {
            setMessage({
                type: "error",
                text: "Fehler beim Löschen des Profils",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Card shadow="sm" radius="lg" className={styles.card}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap="md">
                        <Title order={1} size="h2">
                            Profil verwalten
                        </Title>

                        {message && (
                            <Alert
                                color={
                                    message.type === "success" ? "green" : "red"
                                }
                            >
                                {message.text}
                            </Alert>
                        )}

                        <Controller
                            name="logopath"
                            control={control}
                            render={({ field }) => (
                                <LogoUploadField
                                    value={field.value}
                                    onUpload={(fileName) =>
                                        field.onChange(fileName)
                                    }
                                    actionsClassName={styles.logoActions}
                                    actionsLabelClassName={
                                        styles.logoActionsLabel
                                    }
                                    error={errors.logopath?.message}
                                />
                            )}
                        />

                        <TextInput
                            label="Unternehmensname"
                            placeholder="Bitte eintragen"
                            {...register("name")}
                            error={errors.name?.message}
                            required
                        />
                        <TextInput
                            label="Unternehmensbeschreibung"
                            placeholder="Bitte eintragen"
                            {...register("description")}
                            error={errors.description?.message}
                            required
                        />
                        <TextInput
                            label="Postleitzahl"
                            placeholder="Bitte eintragen"
                            {...register("zipcode")}
                            error={errors.zipcode?.message}
                            required
                        />
                        <TextInput
                            label="Ort"
                            placeholder="Bitte eintragen"
                            {...register("location")}
                            error={errors.location?.message}
                            required
                        />
                        <TextInput
                            label="Straße/Hausnummer"
                            placeholder="Bitte eintragen"
                            {...register("address")}
                            error={errors.address?.message}
                            required
                        />
                        <Controller
                            name="industry"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Branche"
                                    placeholder="Bitte eintragen"
                                    value={field.value || null}
                                    onChange={(val) =>
                                        field.onChange(val || "")
                                    }
                                    data={INDUSTRIES}
                                    error={errors.industry?.message}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="companysize"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label="Mitarbeiteranzahl"
                                    placeholder="Bitte eintragen"
                                    value={field.value ?? ""}
                                    onChange={(val) =>
                                        field.onChange(
                                            typeof val === "number"
                                                ? val
                                                : undefined,
                                        )
                                    }
                                    min={0}
                                    error={errors.companysize?.message}
                                    required
                                />
                            )}
                        />
                        <TextInput
                            label="E-Mail"
                            placeholder="Bitte eintragen"
                            {...register("email")}
                            error={errors.email?.message}
                        />
                        <TextInput
                            label="Telefon"
                            placeholder="Bitte eintragen"
                            {...register("phone")}
                            error={errors.phone?.message}
                        />
                        <TextInput
                            label="Kontaktname"
                            placeholder="Bitte eintragen"
                            {...register("contact_name")}
                            error={errors.contact_name?.message}
                        />
                        <PasswordInput
                            label="Aktuelles Passwort"
                            placeholder="Aktuelles Passwort eingeben"
                            {...register("currentPassword")}
                            error={errors.currentPassword?.message}
                        />
                        <PasswordInput
                            label="Neues Passwort"
                            placeholder="Neues Passwort eingeben"
                            {...register("newPassword")}
                            error={errors.newPassword?.message}
                        />

                        <Group justify="flex-end" mt="md">
                            <Button type="submit" loading={isSaving}>
                                Profil speichern
                            </Button>
                        </Group>

                        <Box mt={80}>
                            <DeleteProfileSection
                                description="Lösche Ihr Unternehmensprofil und alle darin enthaltenen Inhalte dauerhaft von der Jobbi-Plattform. Dieser Vorgang kann nicht rückgängig gemacht werden."
                                onDelete={handleDeleteProfile}
                                loading={isDeleting}
                            />
                        </Box>
                    </Stack>
                </form>
            </Card>
            <div className={styles.footerWrapper}>
                <BasicFooter />
            </div>
        </>
    );
}
