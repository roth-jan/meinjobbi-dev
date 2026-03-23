'use client';

import { Box, Text } from '@mantine/core';
import { ActionCard } from '@/app/login/components/ActionCard';
import styles from './InterestsSelector.module.css';

const interests = [
  {
    id: 'handwerklich',
    title: 'Handwerklich',
    subtitle: 'Ich arbeite gerne mit Werkzeugen und Materialen.',
  },
  {
    id: 'technik_it',
    title: 'Technik & IT',
    subtitle: 'Computer, Programmieren, Elektronik interessieren mich.',
  },
  {
    id: 'kommunikation',
    title: 'Kommunikation',
    subtitle: 'Ich spreche gerne mit Menschen, telefoniere, erkläre.',
  },
  {
    id: 'kreativ_design',
    title: 'Kreativ & Design',
    subtitle: 'Ich arbeite gerne mit Werkzeugen und Materialen.',
  },
  {
    id: 'organisation_zahlen',
    title: 'Organisation & Zahlen',
    subtitle: 'Ich plane gerne, rechne und habe Überblick.',
  },
  {
    id: 'natur_umwelt',
    title: 'Natur & Umwelt',
    subtitle: 'Ich mag Biologie, Natur oder Umweltschutz.',
  },
  {
    id: 'menschen_soziales',
    title: 'Menschen & Soziales',
    subtitle: 'Ich helfe gern anderen, arbeite mit Menschen.',
  },
  {
    id: 'forschen_tufteln',
    title: 'Forschen & Tüfteln',
    subtitle: 'Ich probiere aus, bastle, teste Lösungen.',
  },
  {
    id: 'gute_frage',
    title: 'Gute Frage...',
    subtitle: 'Ich weiß es noch nicht – überrascht mich!',
  },
];

interface InterestsSelectorProps {
  selectedInterests: string[];
  onToggle: (id: string) => void;
  maxSelections?: number;
}

export function InterestsSelector({
  selectedInterests,
  onToggle,
  maxSelections = 3,
}: InterestsSelectorProps) {
  const handleToggle = (id: string) => {
    if (selectedInterests.includes(id)) {
      onToggle(id);
    } else if (selectedInterests.length < maxSelections) {
      onToggle(id);
    }
  };

  return (
    <Box>
      <Box className={styles.grid}>
        {interests.map((interest) => (
          <ActionCard
            key={interest.id}
            title={interest.title}
            description={interest.subtitle}
            onClick={() => handleToggle(interest.id)}
            selected={selectedInterests.includes(interest.id)}
          />
        ))}
      </Box>
      <Text className={styles.hint}>* Wähle maximal {maxSelections} Interessen aus.</Text>
    </Box>
  );
}
