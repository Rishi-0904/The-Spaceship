'use client';

import { useState } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import { PORTFOLIO_DATA } from '@/lib/portfolio-data';
import RoomShell from './RoomShell';
import styles from './SystemCore.module.css';

export default function SystemCore() {
  const { triggerFinale } = usePortfolioStore();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required.');
      return;
    }
    // Simulate send
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
  };

  return (
    <RoomShell
      id="system-core"
      badge="SYSTEM CORE"
      title="CONTACT STATION"
      subtitle="Send a transmission to Rishi — collaboration, opportunities, or just say hello"
      color="var(--warning)"
    >
      <div className={styles.layout}>
        {/* Contact form */}
        <div className={`${styles.formPanel} glass-panel corner-deco`}>
          <div className={styles.formHeader}>
            <span className={styles.formIcon} style={{ color: 'var(--warning)' }}>✉</span>
            <div>
              <div className={styles.formTitle}>SEND TRANSMISSION</div>
              <div className={styles.formDesc}>Messages are delivered directly to Rishi.</div>
            </div>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="contact-name" className={styles.label}>YOUR NAME</label>
                <input
                  id="contact-name"
                  type="text"
                  className={styles.input}
                  placeholder="Commander…"
                  value={formData.name}
                  onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                  maxLength={80}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contact-email" className={styles.label}>EMAIL ADDRESS</label>
                <input
                  id="contact-email"
                  type="email"
                  className={styles.input}
                  placeholder="commander@starfleet.io"
                  value={formData.email}
                  onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contact-message" className={styles.label}>MESSAGE</label>
                <textarea
                  id="contact-message"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="I'd like to discuss…"
                  value={formData.message}
                  onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                  rows={5}
                  maxLength={1000}
                  required
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" id="contact-submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                TRANSMIT MESSAGE
              </button>
            </form>
          ) : (
            <div className={styles.sentMsg}>
              <div className={styles.sentIcon}>✓</div>
              <h3>Transmission Received!</h3>
              <p>Thank you, {formData.name}. Rishi will get back to you soon.</p>
            </div>
          )}
        </div>

        {/* Quick links + finale trigger */}
        <div className={styles.sidebar}>
          <div className={`${styles.quickLinks} glass-panel`}>
            <h3 className={styles.qlTitle}>DIRECT CHANNELS</h3>
            <div className={styles.qlList}>
              <a href={PORTFOLIO_DATA.links.email} className="btn btn-outline" id="contact-email-link" style={{ justifyContent: 'center' }}>
                ✉ Email Rishi
              </a>
              <a href={PORTFOLIO_DATA.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline" id="contact-linkedin">
                ◈ LinkedIn
              </a>
              <a href={PORTFOLIO_DATA.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" id="contact-github">
                ⬡ GitHub
              </a>
              <a href={PORTFOLIO_DATA.links.resume} download className="btn btn-ghost" id="contact-resume" target="_blank" rel="noopener noreferrer">
                ↓ Resume PDF
              </a>
            </div>
          </div>

          {/* Finale trigger */}
          <div className={`${styles.finaleCard} glass-panel`}>
            <div className={styles.finaleTitle}>
              <span className="status-dot red" />
              CLASSIFIED SEQUENCE
            </div>
            <p className={styles.finaleDesc}>
              You've explored the ship. There's one final sequence remaining…
            </p>
            <button
              id="btn-trigger-finale"
              className="btn btn-danger"
              onClick={triggerFinale}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              ⚠ INITIATE FINAL SEQUENCE
            </button>
          </div>
        </div>
      </div>
    </RoomShell>
  );
}
