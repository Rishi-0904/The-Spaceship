'use client';

import { useState } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import { PORTFOLIO_DATA } from '@/lib/portfolio-data';
import RoomShell from './RoomShell';
import styles from './CommandRoom.module.css';

export default function CommandRoom() {
  const { navigateTo } = usePortfolioStore();
  const [calibrated, setCalibrated] = useState(false);
  const [sliders, setSliders] = useState({ lat: 28, lng: 81, alt: 420 });
  const TARGET = { lat: 25, lng: 82, alt: 360 }; // MNNIT Allahabad coordinates approx

  const isCalibrated =
    Math.abs(sliders.lat - TARGET.lat) < 5 &&
    Math.abs(sliders.lng - TARGET.lng) < 5 &&
    Math.abs(sliders.alt - TARGET.alt) < 60;

  const handleCalibrate = () => {
    if (isCalibrated || true) { // auto-complete for UX
      setCalibrated(true);
    }
  };

  const { name, title, education, links, areas } = PORTFOLIO_DATA;

  return (
    <RoomShell
      id="command-room"
      badge="COMMAND DECK"
      title="NAVIGATION SYSTEM"
      subtitle="Crew manifest and mission briefing"
      color="var(--cyan)"
    >
      <div className={styles.layout}>

        {/* Left — Task panel */}
        <div className={`${styles.taskPanel} glass-panel corner-deco`}>
          <div className={styles.taskHeader}>
            <span className={styles.taskIcon}>⊕</span>
            <div>
              <div className={styles.taskTitle}>CALIBRATE NAVIGATION SYSTEM</div>
              <div className={styles.taskDesc}>Align coordinates to MNNIT Allahabad to unlock crew profile.</div>
            </div>
          </div>

          {!calibrated ? (
            <div className={styles.calibration}>
              {([
                { key: 'lat', label: 'LATITUDE', min: 0, max: 50, unit: '°N' },
                { key: 'lng', label: 'LONGITUDE', min: 60, max: 100, unit: '°E' },
                { key: 'alt', label: 'ALTITUDE', min: 200, max: 600, unit: 'm' },
              ] as const).map(({ key, label, min, max, unit }) => (
                <div key={key} className={styles.sliderGroup}>
                  <div className={styles.sliderLabel}>
                    <span>{label}</span>
                    <span className={styles.sliderVal}>{sliders[key]}{unit}</span>
                  </div>
                  <input
                    type="range"
                    id={`slider-${key}`}
                    className={styles.slider}
                    min={min}
                    max={max}
                    value={sliders[key]}
                    onChange={(e) => setSliders((s) => ({ ...s, [key]: +e.target.value }))}
                    aria-label={label}
                  />
                  <div className={styles.sliderTrack}>
                    <div
                      className={styles.sliderFill}
                      style={{ width: `${((sliders[key] - min) / (max - min)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className={styles.lockStatus}>
                <span className={`status-dot ${isCalibrated ? 'green' : 'amber'}`} />
                {isCalibrated ? 'TARGET LOCKED — MNNIT ALLAHABAD' : 'SEARCHING…'}
              </div>

              <button
                id="btn-calibrate"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                onClick={handleCalibrate}
              >
                CONFIRM CALIBRATION
              </button>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.7rem' }}
                onClick={() => setCalibrated(true)}
              >
                Skip task — view profile directly
              </button>
            </div>
          ) : (
            <div className={styles.calibratedMsg}>
              <div className={styles.calibratedIcon}>✓</div>
              <div>Navigation locked to MNNIT Allahabad</div>
              <div className={styles.coords}>25.4925° N, 81.8677° E</div>
            </div>
          )}
        </div>

        {/* Right — Profile */}
        <div className={`${styles.profile} ${calibrated ? styles.profileVisible : ''}`}>
          {/* Avatar */}
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing} />
            <img
              src="/avatar.png"
              alt="Rishi Raj Jaiswal — AI/ML Engineer"
              className={styles.avatar}
              width={180}
              height={180}
            />
            <div className={styles.avatarGlow} />
          </div>

          {/* Info */}
          <div className={styles.info}>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.profileTitle}>{title}</p>
            <div className={styles.registration}>REGISTRATION NO: {PORTFOLIO_DATA.registrationNo}</div>
            
            {/* Areas */}
            <div className={styles.areas}>
              {areas.map((area) => (
                <span key={area} className="chip">{area}</span>
              ))}
            </div>

            {/* Bio */}
            <p className={styles.bio}>
              Building intelligent systems at the intersection of AI and engineering. Specializing in
              multi-agent architectures, retrieval-augmented generation, and production-grade full-stack systems.
              Passionate about Generative AI, Agentic AI, and LLM engineering.
            </p>

            {/* Academic History Timeline */}
            <div className={styles.eduHistory}>
              <div className={styles.eduHistoryTitle}>ACADEMIC TIMELINE</div>
              <div className={styles.eduTimeline}>
                {education.history.map((eduItem, idx) => (
                  <div key={idx} className={styles.eduTimelineItem}>
                    <div className={styles.eduTimelineDot} />
                    <div className={styles.eduTimelineContent}>
                      <div className={styles.eduTimelineHeader}>
                        <span className={styles.eduTimelineInst}>{eduItem.institution}</span>
                        <span className={styles.eduTimelineYear}>{eduItem.timeline}</span>
                      </div>
                      <div className={styles.eduTimelineSub}>
                        <span>{eduItem.degree}</span>
                        <span className={styles.eduTimelinePerf}>{eduItem.performance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className={styles.linksRow}>
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                id="btn-github"
                aria-label="GitHub profile"
              >
                ⬡ GitHub
              </a>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                id="btn-linkedin"
                aria-label="LinkedIn profile"
              >
                ◈ LinkedIn
              </a>
              <a
                href={links.resume}
                download
                className="btn btn-primary"
                id="btn-resume"
                target="_blank"
                rel="noopener noreferrer"
              >
                ↓ Resume
              </a>
              <button
                className="btn btn-ghost"
                id="btn-contact"
                onClick={() => navigateTo('system-core')}
              >
                ✉ Contact
              </button>
            </div>
          </div>
        </div>

      </div>
    </RoomShell>
  );
}
