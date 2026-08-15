'use client';

import { useState } from 'react';
import { PORTFOLIO_DATA, type Achievement } from '@/lib/portfolio-data';
import RoomShell from './RoomShell';
import styles from './AchievementRoom.module.css';

export default function AchievementRoom() {
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);

  return (
    <RoomShell
      id="achievement-room"
      badge="ACHIEVEMENT VAULT"
      title="MISSION RECORDS"
      subtitle="A chronicle of competitions, rankings, and milestones"
      color="var(--amber)"
    >
      {/* Timeline */}
      <div className={styles.timeline}>
        {PORTFOLIO_DATA.achievements.map((achievement, i) => (
          <div key={achievement.id} className={`${styles.timelineItem} ${i % 2 === 0 ? styles.left : styles.right}`}>
            <div className={styles.timelineDot} style={{ borderColor: achievement.color, boxShadow: `0 0 15px ${achievement.color}40` }}>
              <span className={styles.timelineIcon}>{achievement.icon}</span>
            </div>

            <button
              id={`achievement-${achievement.id}`}
              className={`${styles.achievementCard} glass-panel corner-deco`}
              onClick={() => setActiveAchievement(activeAchievement?.id === achievement.id ? null : achievement)}
              style={{ '--ach-color': achievement.color } as React.CSSProperties}
              aria-expanded={activeAchievement?.id === achievement.id}
              aria-label={`View ${achievement.title} details`}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardYear}>{achievement.year}</span>
                <span className={styles.cardIcon}>{achievement.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{achievement.title}</h3>
              <p className={styles.cardEvent}>{achievement.event}</p>

              {activeAchievement?.id === achievement.id && (
                <p className={styles.cardDesc}>{achievement.desc}</p>
              )}

              <div className={styles.expandHint}>
                {activeAchievement?.id === achievement.id ? '▲ collapse' : '▼ details'}
              </div>
            </button>
          </div>
        ))}

        {/* Timeline line */}
        <div className={styles.timelineLine}>
          <div className={styles.timelineLineInner} />
        </div>
      </div>

      {/* CP profiles */}
      <div className={styles.cpSection}>
        <div className={`${styles.cpCard} glass-panel`}>
          <div className={styles.cpPlatform}>
            <span className={styles.cpIcon}>🔵</span>
            <span className={styles.cpName}>Codeforces</span>
          </div>
          <div className={styles.cpRank} style={{ color: 'var(--blue)' }}>PUPIL</div>
          <a
            href={PORTFOLIO_DATA.links.codeforces}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            id="btn-codeforces"
            style={{ fontSize: '0.7rem', padding: '0.4rem 1rem' }}
          >
            View Profile →
          </a>
        </div>

        <div className={`${styles.cpCard} glass-panel`}>
          <div className={styles.cpPlatform}>
            <span className={styles.cpIcon}>⚔️</span>
            <span className={styles.cpName}>LeetCode</span>
          </div>
          <div className={styles.cpRank} style={{ color: 'var(--amber)' }}>KNIGHT</div>
          <a
            href={PORTFOLIO_DATA.links.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            id="btn-leetcode"
            style={{ fontSize: '0.7rem', padding: '0.4rem 1rem' }}
          >
            View Profile →
          </a>
        </div>
      </div>
    </RoomShell>
  );
}
