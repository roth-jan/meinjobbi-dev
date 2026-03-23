'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Title, Text, TextInput, Select, PasswordInput, Button } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { InterestsSelector } from '@/components/ui/InterestsSelector';
import { BasicFooter } from '@/components';
import { DeleteProfileSection } from '@/components/ui/DeleteProfileSection';
import styles from './page.module.css';
import { useStudent, useAuthStore, useUser } from '@/stores/authStore';
import {
  updateStudent,
  updateStudentInterests,
  changePassword,
  deleteAccount,
} from '@/functions/authService';
import { ChangeInterestsRequest } from '@/types/api';

export default function EinstellungenPage() {
  const router = useRouter();
  const student = useStudent();
  const user = useUser();
  const { setStudent, logout } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    vorname: '',
    name: '',
    geschlecht: '',
    geburtsdatum: '',
    abschlussjahr: '',
    schule: '',
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoadingStammdaten, setIsLoadingStammdaten] = useState(false);
  const [isLoadingInterests, setIsLoadingInterests] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    if (student) {
      // Parse dateofbirth from ISO format (e.g., "2005-12-12T00:00:00Z") to input format (e.g., "2005-12-12")
      let parsedDateOfBirth = '';
      if (student.dateofbirth) {
        parsedDateOfBirth = dayjs(student.dateofbirth).format('YYYY-MM-DD');
      }

      // Parse jobinterests from comma-separated string to array
      let parsedInterests: string[] = [];
      if (student.jobinterests) {
        parsedInterests = student.jobinterests
          .split(',')
          .map((interest) => interest.trim())
          .filter((interest) => interest.length > 0);
      }

      setFormData({
        email: student.email || '',
        username: student.username || '',
        vorname: student.firstname || '',
        name: student.lastname || '',
        geschlecht: student.gender || '',
        geburtsdatum: parsedDateOfBirth,
        abschlussjahr: student.graduationyear ? student.graduationyear.toString() : '',
        schule: student.school || '',
      });

      setSelectedInterests(parsedInterests);
    }
  }, [student]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveStammdaten = async () => {
    if (!student?.id) {
      setErrorMessage('Student ID nicht gefunden');
      return;
    }

    setIsLoadingStammdaten(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updatePayload = {
        id: student.id,
        firstname: formData.vorname,
        lastname: formData.name,
        dateofbirth: formData.geburtsdatum,
        gender: formData.geschlecht,
        graduationyear: formData.abschlussjahr ? parseInt(formData.abschlussjahr, 10) : null,
        school: formData.schule,
        email: formData.email,
        username: formData.username,
        jobinterests: selectedInterests.join(', '),
      };

      const result = await updateStudent(student.id, updatePayload);

      if (result.success) {
        setSuccessMessage('Stammdaten erfolgreich aktualisiert!');
        // Update authStore with new student data from API response
        if (result.student) {
          setStudent(result.student);
        }
      } else {
        setErrorMessage(result.message || 'Fehler beim Aktualisieren der Stammdaten');
      }
    } catch (error) {
      console.error('Save Stammdaten error:', error);
      setErrorMessage('Fehler beim Aktualisieren der Stammdaten');
    } finally {
      setIsLoadingStammdaten(false);
      // Clear messages after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleSaveInterests = async () => {
    if (!student?.id) {
      setErrorMessage('Student ID nicht gefunden');
      return;
    }

    setIsLoadingInterests(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const interestsString = selectedInterests.join(', ');

      const result = await updateStudentInterests(student.id, { interests: interestsString });

      if (result.success) {
        setSuccessMessage('Stärkenprofil erfolgreich aktualisiert!');
        // Update authStore with new student data from API response
        if (result.student) {
          setStudent(result.student);
        }
      } else {
        setErrorMessage(result.message || 'Fehler beim Aktualisieren des Stärkenprofils');
      }
    } catch (error) {
      console.error('Save Interests error:', error);
      setErrorMessage('Fehler beim Aktualisieren des Stärkenprofils');
    } finally {
      setIsLoadingInterests(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleSavePassword = async () => {
    if (!user?.id) {
      setErrorMessage('User ID nicht gefunden');
      return;
    }

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setErrorMessage('Bitte füllen Sie alle Felder aus');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Die Passwörter stimmen nicht überein');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Das Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    setIsLoadingPassword(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await changePassword(user.id, passwordData.newPassword, user.email);

      if (result.success) {
        setSuccessMessage('Passwort erfolgreich geändert! Sie werden in Kürze abgemeldet...');
        // Clear password fields
        setPasswordData({
          newPassword: '',
          confirmPassword: '',
        });

        // Logout user after 2 seconds and redirect to login
        setTimeout(() => {
          logout();
          router.push('/login');
        }, 2000);
      } else {
        setErrorMessage(result.message || 'Fehler beim Ändern des Passworts');
      }
    } catch (error) {
      console.error('Save Password error:', error);
      setErrorMessage('Fehler beim Ändern des Passworts');
    } finally {
      setIsLoadingPassword(false);
      if (!successMessage) {
        setTimeout(() => {
          setSuccessMessage(null);
          setErrorMessage(null);
        }, 5000);
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (!user?.id) {
      setErrorMessage('User ID nicht gefunden');
      return;
    }
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await deleteAccount(user.email);

      if (result.success) {
        setSuccessMessage('Profil erfolgreich gelöscht! Sie werden in Kürze abgemeldet...');
        setTimeout(() => {
          logout();
          router.push('/login');
        }, 2000);
      } else {
        setErrorMessage(result.message || 'Fehler beim Löschen des Profils');
      }
    } catch (error) {
      console.error('Delete Profile error:', error);
      setErrorMessage('Fehler beim Löschen des Profils');
    } finally {
      if (!successMessage) {
        setTimeout(() => {
          setSuccessMessage(null);
          setErrorMessage(null);
        }, 5000);
      }
    }
  };

  return (
    <>
      <Box className={styles.container}>
        <Title order={1} className={styles.pageTitle}>
          Kontoeinstellungen
        </Title>

        {/* Stammdaten Section */}
        <Box className={styles.section}>
          <Title order={2} className={styles.sectionTitle}>
            Stammdaten ändern
          </Title>

          {successMessage && (
            <Box
              style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#d3f9d8',
                borderRadius: '4px',
                color: '#2f9e44',
              }}
            >
              {successMessage}
            </Box>
          )}
          {errorMessage && (
            <Box
              style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#ffe0e0',
                borderRadius: '4px',
                color: '#c92a2a',
              }}
            >
              {errorMessage}
            </Box>
          )}

          <Box className={styles.formGrid}>
            <Box className={styles.inputWrapper}>
              <TextInput
                placeholder="E-Mail"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
            <Box className={styles.inputWrapper}>
              <TextInput
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleFormChange('username', e.target.value)}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
            <Box className={styles.inputWrapper}>
              <TextInput
                placeholder="Vorname"
                value={formData.vorname}
                onChange={(e) => handleFormChange('vorname', e.target.value)}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
            <Box className={styles.inputWrapper}>
              <TextInput
                placeholder="Name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
            <Box className={styles.inputWrapper}>
              <Select
                placeholder="Geschlecht"
                value={formData.geschlecht}
                onChange={(value) => handleFormChange('geschlecht', value || '')}
                data={[
                  { value: 'male', label: 'Männlich' },
                  { value: 'female', label: 'Weiblich' },
                  { value: 'diverse', label: 'Divers' },
                ]}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
            <Box className={styles.inputWrapper}>
              <DateInput
                placeholder="Geburtsdatum"
                locale="de"
                valueFormat="DD.MM.YYYY"
                value={formData.geburtsdatum ? new Date(formData.geburtsdatum) : null}
                onChange={(value) =>
                  handleFormChange(
                    'geburtsdatum',
                    value ? dayjs(value).format('YYYY-MM-DD') : '',
                  )
                }

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
            <Box className={styles.inputWrapper}>
              <Select
                placeholder="Voraussichtliches Abschlussjahr"
                value={formData.abschlussjahr}
                onChange={(value) => handleFormChange('abschlussjahr', value || '')}
                data={[
                  { value: '2025', label: '2025' },
                  { value: '2026', label: '2026' },
                  { value: '2027', label: '2027' },
                  { value: '2028', label: '2028' },
                  { value: '2029', label: '2029' },
                ]}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
            <Box className={styles.inputWrapper}>
              <Select
                placeholder="Schulauswahl"
                value={formData.schule}
                onChange={(value) => handleFormChange('schule', value || '')}
                data={[
                  { value: 'gymnasium', label: 'Gymnasium' },
                  { value: 'realschule', label: 'Realschule' },
                  { value: 'hauptschule', label: 'Hauptschule' },
                  { value: 'gesamtschule', label: 'Gesamtschule' },
                ]}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
          </Box>

          <Box className={styles.buttonWrapper}>
            <Button
              size="lg"
              onClick={handleSaveStammdaten}
              loading={isLoadingStammdaten}
              disabled={isLoadingStammdaten}
            >
              Stammdaten speichern
            </Button>
          </Box>
        </Box>

        {/* Stärkenprofil Section */}
        <Box className={styles.section}>
          <Title order={2} className={styles.sectionTitle}>
            Stärkenprofil ändern
          </Title>

          {successMessage && (
            <Box
              style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#d3f9d8',
                borderRadius: '4px',
                color: '#2f9e44',
              }}
            >
              {successMessage}
            </Box>
          )}
          {errorMessage && (
            <Box
              style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#ffe0e0',
                borderRadius: '4px',
                color: '#c92a2a',
              }}
            >
              {errorMessage}
            </Box>
          )}

          <InterestsSelector
            selectedInterests={selectedInterests}
            onToggle={toggleInterest}
            maxSelections={3}
          />

          <Box className={styles.buttonWrapper}>
            <Button
              size="lg"
              onClick={handleSaveInterests}
              loading={isLoadingInterests}
              disabled={isLoadingInterests}
            >
              Stärkenprofil speichern
            </Button>
          </Box>
        </Box>

        {/* Passwort Section */}
        <Box className={styles.section}>
          <Title order={2} className={styles.sectionTitle}>
            Passwort ändern
          </Title>

          {successMessage && (
            <Box
              style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#d3f9d8',
                borderRadius: '4px',
                color: '#2f9e44',
              }}
            >
              {successMessage}
            </Box>
          )}
          {errorMessage && (
            <Box
              style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#ffe0e0',
                borderRadius: '4px',
                color: '#c92a2a',
              }}
            >
              {errorMessage}
            </Box>
          )}

          <Box className={styles.formGrid}>
            <Box className={styles.inputWrapper}>
              <PasswordInput
                placeholder="Neues Passwort eingeben"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
            <Box className={styles.inputWrapper}>
              <PasswordInput
                placeholder="Passwort bestätigen"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}

              />
              <span className={styles.requiredAsterisk}>*</span>
            </Box>
          </Box>

          <Box className={styles.buttonWrapper}>
            <Button
              size="lg"
              onClick={handleSavePassword}
              loading={isLoadingPassword}
              disabled={isLoadingPassword}
            >
              Passwort speichern
            </Button>
          </Box>
        </Box>

        {/* Profil löschen Section */}
        <Box className={styles.section}>
          <DeleteProfileSection onDelete={handleDeleteProfile} />
        </Box>
      </Box>

      <Box className={styles.footerWrapper}>
        <BasicFooter />
      </Box>
    </>
  );
}
