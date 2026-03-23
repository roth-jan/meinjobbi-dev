'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  TextInput,
  Select,
  Switch,
  Checkbox,
  Button,
  Title,
  Alert,
  Stack,
  Group,
  Text,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { BasicFooter } from '@/components';
import { Popup } from '@/components/ui/Popup';
import { CitySelector, type City } from '@/components/ui/CitySelector';
import { useAuthStore } from '@/stores';
import {
  createJobAd,
  updateJobAd,
  getJobAdById,
} from '@/app/actions/jobAdActions';
import type { CreateJobAdRequest } from '@/types';
import { jobAdSchema, type JobAdFormData } from '@/lib/schemas';
import styles from './page.module.css';

const JOB_TYPES = [
  'Vollzeit',
  'Teilzeit',
  'Praktikum',
  'Werkstudent',
  'Minijob',
  'Befristet',
  'Unbefristet',
  'Zeitarbeit',
  'Freelance / Selbstständig',
  'B2B-Vertrag',
  'Ausbildung',
  'Aushilfe / Nebenjob',
  'Homeoffice / Remote',
  'Hybride Arbeit',
  'Präsenzarbeit (Vor-Ort)',
];

const CITIES: City[] = [
  { id: 1, name: 'Berlin', selected: false },
  { id: 2, name: 'Hamburg', selected: false },
  { id: 3, name: 'München', selected: false },
  { id: 4, name: 'Köln', selected: false },
  { id: 5, name: 'Frankfurt', selected: false },
  { id: 6, name: 'Stuttgart', selected: false },
  { id: 7, name: 'Düsseldorf', selected: false },
  { id: 8, name: 'Leipzig', selected: false },
  { id: 9, name: 'Dortmund', selected: false },
  { id: 10, name: 'Essen', selected: false },
];

export default function JobAdsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, company } = useAuthStore();

  const editId = searchParams.get('id');
  const isEditMode = !!editId;

  const [cities, setCities] = useState<City[]>(CITIES);
  const [localizationRequired, setLocalizationRequired] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [initialized, setInitialized] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<JobAdFormData>({
    resolver: zodResolver(jobAdSchema),
    defaultValues: {
      active: true,
      jobtitle: '',
      briefdescription: '',
      jobtype: '',
      startdate: '',
      duration: '',
      permanent: false,
      salary01: '',
      salary02: '',
      salary03: '',
      salary04: '',
      salary05: '',
      taskdescription: '',
      profiledescription: '',
      jobdescription: '',
      applicationprocess: '',
      cities: '',
      contactfirstname: '',
      contactlastname: '',
      contactphone: '',
      contactemail: '',
    },
  });

  const jobTitle = watch('jobtitle');

  // Load existing job ad data when editing
  useEffect(() => {
    if (!isEditMode || !editId || initialized) return;

    const loadJobAd = async () => {
      try {
        const jobAd = await getJobAdById(Number(editId));
        reset({
          active: jobAd.active,
          jobtitle: jobAd.jobtitle || '',
          briefdescription: jobAd.briefdescription || '',
          jobtype: jobAd.jobtype || '',
          startdate: jobAd.startdate ? jobAd.startdate.split('T')[0] : '',
          duration: jobAd.duration || '',
          permanent: jobAd.permanent,
          salary01: jobAd.salary01 || '',
          salary02: jobAd.salary02 || '',
          salary03: jobAd.salary03 || '',
          salary04: jobAd.salary04 || '',
          salary05: jobAd.salary05 || '',
          taskdescription: jobAd.taskdescription || '',
          profiledescription: jobAd.profiledescription || '',
          jobdescription: jobAd.jobdescription || '',
          applicationprocess: jobAd.applicationprocess || '',
          cities: jobAd.cities || '',
          contactfirstname: jobAd.contactfirstname || '',
          contactlastname: jobAd.contactlastname || '',
          contactphone: jobAd.contactphone || '',
          contactemail: jobAd.contactemail || '',
        });

        if (jobAd.cities) {
          setLocalizationRequired(true);
          const selectedCityNames = jobAd.cities.split(',').map((c) => c.trim());
          setCities((prev) =>
            prev.map((city) => ({
              ...city,
              selected: selectedCityNames.includes(city.name),
            })),
          );
        }
        setInitialized(true);
      } catch (err) {
        console.error('Error loading job ad:', err);
        setMessage({ type: 'error', text: 'Fehler beim Laden der Stellenanzeige' });
      }
    };
    loadJobAd();
  }, [isEditMode, editId, initialized, reset]);

  const buildRequest = (data: JobAdFormData): CreateJobAdRequest | null => {
    if (!user?.id || !company?.id) {
      setMessage({ type: 'error', text: 'Benutzer oder Unternehmen nicht gefunden' });
      return null;
    }

    const selectedCities = cities
      .filter((c) => c.selected)
      .map((c) => c.name)
      .join(', ');

    return {
      userid: user.id,
      companyid: company.id,
      registrationdate: new Date().toISOString(),
      ...data,
      cities: localizationRequired ? selectedCities : '',
    };
  };

  const onSubmit = async (data: JobAdFormData) => {
    const request = buildRequest(data);
    if (!request) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = isEditMode && editId
        ? await updateJobAd(Number(editId), request)
        : await createJobAd(request);

      if (response.success) {
        setShowSuccessPopup(true);
      } else {
        setMessage({ type: 'error', text: response.errorMessage || 'Fehler beim Speichern' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Fehler beim Speichern der Stellenanzeige' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    router.push('/jobads');
  };

  return (
    <>
      <Card shadow="sm" radius="lg" className={styles.card}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Title order={1} size="h2">
              {isEditMode ? 'Stellenanzeige bearbeiten' : 'Neue Stellenanzeige erstellen'}
            </Title>

            {message && (
              <Alert color={message.type === 'success' ? 'green' : 'red'}>
                {message.text}
              </Alert>
            )}

            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Switch
                  label="Stellenanzeige aktiv"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.currentTarget.checked)}
                  size="lg"
                />
              )}
            />

            <TextInput
              label="Jobtitel"
              placeholder="Bitte eintragen"
              {...register('jobtitle')}
              error={errors.jobtitle?.message}
              required
            />
            <TextInput
              label="Kurzbeschreibung"
              placeholder="Bitte eintragen"
              {...register('briefdescription')}
              error={errors.briefdescription?.message}
            />
            <Controller
              name="jobtype"
              control={control}
              render={({ field }) => (
                <Select
                  label="Jobtyp"
                  placeholder="Jobtyp auswählen"
                  value={field.value || null}
                  onChange={(val) => field.onChange(val || '')}
                  data={JOB_TYPES}
                  error={errors.jobtype?.message}
                />
              )}
            />
            <Controller
              name="startdate"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="Jobstart"
                  placeholder="Datum auswählen"
                  locale="de"
                  valueFormat="DD.MM.YYYY"
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) =>
                    field.onChange(value ? dayjs(value).format('YYYY-MM-DD') : '')
                  }
                  error={errors.startdate?.message}
                />
              )}
            />
            <TextInput
              label="Dauer"
              placeholder="Bitte eintragen"
              {...register('duration')}
              error={errors.duration?.message}
            />
            <Controller
              name="permanent"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Unbefristet"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.currentTarget.checked)}
                />
              )}
            />

            <TextInput
              label="Gehalt 1"
              placeholder="Bitte eintragen"
              {...register('salary01')}
            />
            <TextInput
              label="Gehalt 2"
              placeholder="Bitte eintragen"
              {...register('salary02')}
            />
            <TextInput
              label="Gehalt 3"
              placeholder="Bitte eintragen"
              {...register('salary03')}
            />

            <TextInput
              label="Deine Aufgaben"
              placeholder="Bitte eintragen"
              {...register('taskdescription')}
            />
            <TextInput
              label="Dein Profil"
              placeholder="Bitte eintragen"
              {...register('profiledescription')}
            />
            <TextInput
              label="Unser Angebot"
              placeholder="Bitte eintragen"
              {...register('jobdescription')}
            />
            <TextInput
              label="Bewerbungsprozess"
              placeholder="Bitte eintragen"
              {...register('applicationprocess')}
            />

            <Title order={3} mt="xl">
              Wo soll die Stellenanzeige geschaltet werden?
            </Title>

            <Checkbox
              label="Bewerber müssen an einem bestimmten Ort zur Schule gehen."
              checked={localizationRequired}
              onChange={(e) => setLocalizationRequired(e.currentTarget.checked)}
            />

            {localizationRequired && (
              <Box>
                <CitySelector
                  cities={cities}
                  localizationRequired={localizationRequired}
                  onCitiesChange={setCities}
                />
              </Box>
            )}

            <Title order={3} mt="xl">
              Kontakt
            </Title>

            <TextInput
              label="Vorname"
              placeholder="Bitte eintragen"
              {...register('contactfirstname')}
              error={errors.contactfirstname?.message}
              required
            />
            <TextInput
              label="Name"
              placeholder="Bitte eintragen"
              {...register('contactlastname')}
              error={errors.contactlastname?.message}
              required
            />
            <TextInput
              label="Telefon"
              placeholder="Bitte eintragen"
              {...register('contactphone')}
              error={errors.contactphone?.message}
              required
            />
            <TextInput
              label="E-Mail Adresse"
              placeholder="Bitte eintragen"
              {...register('contactemail')}
              error={errors.contactemail?.message}
              required
            />

            <Box className={styles.cardBottomSection}>
              <Text fw={700} fz="var(--font-subtext)" lh="var(--font-subtext-lh)" c="white" mb="sm">
                Übersicht
              </Text>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text c="white" fz="var(--font-copytext)" lh="var(--font-copytext-lh)">
                    Stellenanzeige {jobTitle || '(Titel eingeben)'}
                  </Text>
                  <Text c="white" fz="sm">Dauer: 1 Jahr</Text>
                </Box>
                <Text c="white" fw={700} fz="var(--font-subtext)">385,00€</Text>
              </Group>

              <Box
                style={{
                  borderTop: '1px solid rgba(183, 197, 214, 0.5)',
                  margin: '1.5rem 0',
                }}
              />

              <Group justify="center" gap="md">
                <Button variant="filled" onClick={() => console.log('Preview')}>
                  Vorschau ansehen
                </Button>
                <Button type="submit" loading={isSaving}>
                  {isEditMode ? 'Speichern' : 'Publizieren'}
                </Button>
              </Group>
            </Box>
          </Stack>
        </form>
      </Card>

      <Popup
        isOpen={showSuccessPopup}
        onClose={handlePopupClose}
        title="Erfolgreich gespeichert!"
        description="Ihre Stellenanzeige wurde gespeichert! Die geänderten Anzeigendaten sind nun für Besucher sichtbar."
        buttonText="Zurück zur Übersicht"
        onButtonClick={handlePopupClose}
      />

      <div className={styles.footerWrapper}>
        <BasicFooter />
      </div>
    </>
  );
}
