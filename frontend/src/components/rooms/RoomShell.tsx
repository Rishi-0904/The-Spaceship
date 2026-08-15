'use client';

import styles from './RoomShell.module.css';
import { usePortfolioStore } from '@/store/portfolio';

interface RoomShellProps {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  color?: string;
  children: React.ReactNode;
}

export default function RoomShell({
  id, badge, title, subtitle, color = 'var(--cyan)', children,
}: RoomShellProps) {
  const { navigateTo } = usePortfolioStore();

  return (
    <section id={id} className={styles.shell} aria-labelledby={`${id}-title`}>
      {/* Room glow accent */}
      <div className={styles.accent} style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}18, transparent 70%)` }} />

      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbLink} onClick={() => navigateTo('ship-map')}>
            RISHI-01
          </button>
          <span className={styles.breadcrumbSep}>›</span>
          <span style={{ color }}>{badge}</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className="section-badge" style={{ borderColor: `${color}30`, color }}>
            {badge}
          </div>
          <h1 id={`${id}-title`} className={`section-title ${styles.title}`}>
            {title}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </section>
  );
}
