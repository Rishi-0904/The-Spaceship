'use client';

import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import styles from './FinaleSequence.module.css';

const SEQUENCE = [
  { text: 'WARNING', sub: 'ANOMALY DETECTED IN SHIP SYSTEMS', delay: 0, type: 'warning' },
  { text: 'UNKNOWN SIGNAL', sub: 'ORIGIN: UNKNOWN — SCANNING…', delay: 2000, type: 'scan' },
  { text: 'SYSTEM COMPROMISED', sub: 'ALL CREW REPORT TO COMMAND DECK', delay: 4000, type: 'critical' },
  { text: 'THE FINAL TASK REMAINS', sub: 'MAKE CONTACT WITH THE ENGINEER', delay: 6500, type: 'resolve' },
];

export default function FinaleSequence() {
  const { navigateTo } = usePortfolioStore();
  const [phase, setPhase] = useState(-1);
  const [done, setDone] = useState(false);
  const [flickerActive, setFlickerActive] = useState(false);

  useEffect(() => {
    SEQUENCE.forEach((step, i) => {
      setTimeout(() => {
        setPhase(i);
        setFlickerActive(true);
        setTimeout(() => setFlickerActive(false), 400);
      }, step.delay);
    });

    setTimeout(() => setDone(true), 8500);
  }, []);

  const handleContact = () => navigateTo('system-core');
  const handleSkip = () => navigateTo('system-core');

  const current = SEQUENCE[phase] || SEQUENCE[0];

  return (
    <div className={`${styles.finale} ${flickerActive ? styles.flicker : ''}`}>
      {/* Emergency lights */}
      <div className={styles.emergencyLeft} />
      <div className={styles.emergencyRight} />

      {/* Skip button */}
      <button className={styles.skipBtn} onClick={handleSkip} id="finale-skip">
        SKIP SEQUENCE →
      </button>

      {/* Content */}
      <div className={styles.center}>
        {phase >= 0 && (
          <>
            <div className={`${styles.alert} ${styles[current.type as keyof typeof styles] || ''}`}>
              ⚠ ALERT
            </div>
            <h1 className={styles.mainText}>{current.text}</h1>
            <p className={styles.subText}>{current.sub}</p>

            <div className={styles.scanLine} />
          </>
        )}

        {done && (
          <div className={styles.ctaGroup}>
            <p className={styles.finalPrompt}>This is your final task, Commander.</p>
            <button
              id="finale-contact"
              className="btn btn-primary"
              onClick={handleContact}
              style={{ fontSize: '1rem', padding: '1rem 3rem' }}
            >
              CONTACT RISHI
            </button>
          </div>
        )}
      </div>

      {/* Scan overlay */}
      <div className={styles.scanOverlay} aria-hidden="true" />
    </div>
  );
}
