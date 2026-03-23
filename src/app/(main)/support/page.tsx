'use client';

import { BasicFooter } from '@/components';
import { ContactForm } from './ContactForm';
import styles from './page.module.css';

export default function SupportPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>Support & Kontakt</span>
          <h1 className={styles.title}>Hast du Fragen oder benötigst unsere Beratung?</h1>
          <h4 className={styles.description}>
            Hast du Fragen zu Jobbi, möchtest mehr über unsere Stellenbörse erfahren oder benötigst
            Unterstützung? Wir sind für dich da! Nimm gerne Kontakt mit uns auf – per Telefon,
            E-Mail oder über unser Formular.
          </h4>
        </div>

        <ContactForm />
      </div>

      <div className={styles.footerWrapper}>
        <BasicFooter />
      </div>
    </div>
  );
}
