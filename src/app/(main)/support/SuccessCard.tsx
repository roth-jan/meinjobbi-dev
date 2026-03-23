'use client';

import Image from 'next/image';
import styles from './SuccessCard.module.css';

export function SuccessCard() {
  return (
    <div className={styles.card}>
      <Image src="/svg/jobbi_head.svg" alt="" width={66} height={66} className={styles.icon} />
      <h2 className={styles.title}>Vielen Dank für deine Nachricht!</h2>
      <p className={styles.text}>
        Wir haben dein Anliegen erhalten und werden uns schnellstmöglich bei dir melden.
      </p>
    </div>
  );
}
