'use client';

import { Accordion, Box } from '@mantine/core';
import Image from 'next/image';

const faqItems = [
  {
    question: 'Was ist Jobbi eigentlich?',
    answer:
      'Jobbi ist dein Portal für Ausbildung, Praktikum und Studium. Hier findest du spannende Unternehmen in deiner Region, kannst direkt Kontakt aufnehmen, Infomaterial anfordern, Besuchstermine vereinbaren oder dich bewerben – alles kostenlos. Und das Beste: In vielen Schulen läuft Jobbi auch auf dem Schulmonitor – also den Bildschirmen auf den Fluren oder im Aufenthaltsbereich. Dort siehst du aktuelle Ausbildungs- und Praktikumsstellen aus deiner Umgebung.',
  },
  {
    question: 'Wie melde ich mich an?',
    answer: (
      <Box>
        <div>Ganz einfach:</div>
        <div>1. Geh auf jobbi.de oder öffne die Jobbi-App.</div>
        <div>2. Registriere dich mit deiner E-Mail-Adresse oder über deine Schule.</div>
        <div>3. Bestätige den Code, den du per Mail bekommst – fertig!</div>
      </Box>
    ),
  },
  {
    question: 'Was ist das Schools Race?',
    answer:
      'Das Schools Race ist ein Wettbewerb zwischen allen Schüler:innen deiner Schule. Für jede Aktivität auf Jobbi (z. B. Logins, Klicks, Anfragen oder Bewerbungen) bekommst du Punkte. Die aktivsten Nutzer:innen gewinnen Preise – und dein Rang steigt automatisch, je mehr du machst.',
  },
  {
    question: 'Wie sammle ich Punkte?',
    answer:
      'Du bekommst Punkte für viele Dinge, z. B.: • Registrierung & Logins • Ausbildungsstellen anschauen • Informationsmaterial anfordern • Besuchstermine oder Bewerbungen abschicken • Aktiv bleiben auf der Seite Dein Punktestand wird täglich aktualisiert.',
  },
  {
    question: 'Wo sehe ich meinen Punktestand?',
    answer:
      'Deinen Score siehst du in der rechten Seitennavigation direkt bei deinem Avatar – und auf der Seite „Schools Race“. Dort siehst du auch, welchen Rang du aktuell hast.',
  },
  {
    question: 'Wie kann ich mich über Jobbi bewerben?',
    answer:
      'Wenn du eine Ausbildungs- oder Praktikumsstelle spannend findest, kannst du dich direkt über Jobbi.de bewerben. Sobald du auf „Bewerbung starten“ klickst, wird automatisch eine vorbereitete E-Mail an das Unternehmen gesendet – mit deinen Kontaktdaten und deiner Anfrage. Wichtig: Das Unternehmen antwortet dir über deine hinterlegte E-Mail-Adresse. Schau also regelmäßig in dein Postfach (und auch in den Spam-Ordner), damit du keine Antwort verpasst. In Zukunft wird es zusätzlich einen Messenger-Bereich direkt in Jobbi geben. Dann kannst du dort mit Unternehmen schreiben, Fragen stellen oder Termine absprechen – alles an einem Ort.',
  },
  {
    question: 'Was kann ich gewinnen?',
    answer:
      'Am Ende jedes Schuljahres (bzw. Halbjahres) gibt es 10 Hauptpreise für die aktivsten Schüler:innen – und 25 coole Jobbi-Hoodies werden unter allen aktiven Teilnehmer:innen verlost. Je aktiver du bist, desto größer deine Chance!',
  },
  {
    question: 'Was bringen mir die Ränge?',
    answer:
      'Jeder Rank zeigt, wie aktiv du bist – vom Starter bis zum Ausbildungs-Großmeister. Je mehr Punkte du sammelst, desto höher steigst du auf. Und: höhere Ränge bringen oft Bonuspunkte oder Extra-Features.',
  },
  {
    question: 'Wie kann ich den Schulmonitor nutzen?',
    answer:
      'Auf dem Schulmonitor siehst du aktuelle Ausbildungs- und Praktikumsstellen direkt in deiner Schule. Wenn dich eine Stelle interessiert, scanne einfach den QR-Code mit deinem Handy – du kommst sofort zur passenden Seite auf meinjobbi.de.',
  },
  {
    question: 'Wie kann ich mehr über ein Unternehmen erfahren?',
    answer:
      'Wenn dich eine Ausbildungs- oder Praktikumsstelle interessiert, kannst du auf meinjobbi.de direkt Informationsmaterial anfordern. Das Unternehmen schickt dir dann weitere Infos zu – zum Beispiel zu Ausbildungsinhalten, Voraussetzungen oder dem Arbeitsalltag. So bekommst du ein besseres Bild, bevor du dich entscheidest, ob du dich bewerben oder das Unternehmen vielleicht sogar besuchen möchtest.',
  },
  {
    question: 'Kann ich über Jobbi ein Unternehmen kennenlernen?',
    answer:
      'Ja! Manche Unternehmen bieten an, dass du sie vor Ort besuchen kannst – zum Beispiel für einen kurzen Rundgang, einen Tag zum Reinschnuppern oder ein Gespräch mit Azubis. Wenn das möglich ist, findest du bei der Stelle den Button „Besuchstermin anfragen“. Du kannst dort einen Terminvorschlag schicken oder einfach dein Interesse an einem Besuch angeben. Das Unternehmen meldet sich dann bei dir mit einem passenden Termin. So lernst du Betriebe aus deiner Umgebung kennen und bekommst einen echten Eindruck vom Beruf und dem Arbeitsalltag.',
  },
];

export function FaqAccordion() {
  return (
    <Accordion chevron={<Image src="/svg/arrow-down-orange.svg" alt="" width={24} height={24} />}>
      {faqItems.map((item, index) => (
        <Accordion.Item key={index} value={`item-${index}`}>
          <Accordion.Control>{item.question}</Accordion.Control>
          <Accordion.Panel>{item.answer}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
