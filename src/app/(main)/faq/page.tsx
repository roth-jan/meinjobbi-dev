'use client';

import { FaqAccordion, FaqSection, BasicFooter } from '@/components';
import styles from './page.module.css';

export default function FAQPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>FAQ</h1>
          <h4 className={styles.description}>
            In unseren FAQ findest du Antworten auf die häufigsten Fragen zu deinem
            Bewerbungsprozess über Jobbi, zum Datenschutz und weiteren wichtigen Themen.
          </h4>
        </div>

        <FaqAccordion />
      </div>

      <FaqSection />

      <div className={styles.footerWrapper}>
        <BasicFooter />
      </div>
    </div>
  );
}
