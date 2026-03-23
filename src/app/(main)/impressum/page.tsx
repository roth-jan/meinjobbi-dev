'use client';

import { BasicFooter } from '@/components';
import styles from './page.module.css';

export default function ImpressumPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Impressum</h1>
          <p className={styles.text}>
            NTConsult Software & Service GmbH
            <br />
            Lanterstrasse
            <br />9 46539 Dinslaken
            <br />
            <br />
            fon: +49 2064 4765-0
            <br />
            fax: +49 2064 4765-55
            <br />
            email: info@ntconsult.de
            <br />
            <br />
            NTConsult Software & Service GmbH wird vertreten durch die persönlich haftende
            Gesellschafterin:
            <br />
            Duisburg HRB 25465; diese wird vertreten durch:
            <br />
            Jan Hendrik Roth & Thorben Roth
            <br />
            <br />
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz (UStG):
            <br />
            DE288147422
            <br />
            <br />
            <br />
            Webdesign:
            <br />
            Agentur Roth
            <br />
            Lanterstraße 9<br />
            46539 Dinslaken
            <br />
            Germany
          </p>
        </div>
      </div>

      <div className={styles.footerWrapper}>
        <BasicFooter />
      </div>
    </div>
  );
}
