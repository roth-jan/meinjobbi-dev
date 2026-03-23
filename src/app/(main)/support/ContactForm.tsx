'use client';

import { useState } from 'react';
import { Message } from '@/types/messages';
import { TextInput, Textarea, Checkbox, Button } from '@mantine/core';
import Link from 'next/link';
import { SuccessCard } from './SuccessCard';
import styles from './ContactForm.module.css';
import { API_ENDPOINTS, getFullApiUrl } from '@/lib/api-config';

interface FormData {
  vorname: string;
  name: string;
  telefon: string;
  email: string;
  betreff: string;
  nachricht: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    vorname: '',
    name: '',
    telefon: '',
    email: '',
    betreff: '',
    nachricht: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const message: Message = {
      name: formData.name,
      vorname: formData.vorname,
      nummer: formData.telefon,
      mail: formData.email,
      subject: formData.betreff,
      message: formData.nachricht,
    };

    try {
      const response = await fetch(getFullApiUrl(API_ENDPOINTS.createContactMessage), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Message sent successfully:', result);

      // Reset form on success
      setFormData({
        vorname: '',
        name: '',
        telefon: '',
        email: '',
        betreff: '',
        nachricht: '',
      });
      setAcceptTerms(false);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.vorname.trim() !== '' &&
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.betreff.trim() !== '' &&
    formData.nachricht.trim() !== '' &&
    acceptTerms;

  if (submitSuccess) {
    return <SuccessCard />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Persönliche Daten</h3>
        <div className={styles.grid}>
          <div className={styles.inputWrapper}>
            <TextInput
              placeholder="Vorname"
              value={formData.vorname}
              onChange={(e) => handleChange('vorname', e.target.value)}
              classNames={{ input: styles.input }}
            />
            <span className={styles.requiredAsterisk}>*</span>
          </div>
          <div className={styles.inputWrapper}>
            <TextInput
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              classNames={{ input: styles.input }}
            />
            <span className={styles.requiredAsterisk}>*</span>
          </div>
          <div className={styles.inputWrapper}>
            <TextInput
              placeholder="Telefonnummer"
              value={formData.telefon}
              onChange={(e) => handleChange('telefon', e.target.value)}
              classNames={{ input: styles.input }}
            />
            <span className={styles.requiredAsterisk}>*</span>
          </div>
          <div className={styles.inputWrapper}>
            <TextInput
              placeholder="E-Mail"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              classNames={{ input: styles.input }}
            />
            <span className={styles.requiredAsterisk}>*</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Dein Anliegen</h3>
        <div className={styles.fullWidth}>
          <div className={styles.inputWrapper}>
            <TextInput
              placeholder="Betreff"
              value={formData.betreff}
              onChange={(e) => handleChange('betreff', e.target.value)}
              classNames={{ input: styles.input }}
            />
            <span className={styles.requiredAsterisk}>*</span>
          </div>
          <div className={styles.inputWrapper}>
            <Textarea
              placeholder="Deine Nachricht..."
              value={formData.nachricht}
              onChange={(e) => handleChange('nachricht', e.target.value)}
              minRows={6}
              classNames={{ input: styles.textarea }}
            />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {submitError && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>Fehler: {submitError}</div>
        )}
        <Checkbox
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.currentTarget.checked)}
          label={
            <>
              Ich akzeptiere die{' '}
              <a href="https://meinjobbi.de/datenschutz/" className={styles.link}>
                Datenschutzbestimmungen
              </a>
              .*
            </>
          }
          classNames={{ label: styles.checkboxLabel }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Wird gesendet...' : 'Jetzt senden'}
        </Button>
      </div>
    </div>
  );
}
