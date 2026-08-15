'use client';

import { usePortfolioStore, type Room, type ViewMode } from '@/store/portfolio';
import styles from './TopNav.module.css';

const NAV_ITEMS: { label: string; room: Room }[] = [
  { label: 'About', room: 'command' },
  { label: 'AI/ML', room: 'ai-lab' },
  { label: 'Projects', room: 'project-archive' },
  { label: 'Engineering', room: 'engineering' },
  { label: 'Achievements', room: 'achievement' },
  { label: 'AI Assistant', room: 'communications' },
  { label: 'Contact', room: 'system-core' },
];

export default function TopNav() {
  const { currentRoom, viewMode, navigateTo, setViewMode } = usePortfolioStore();

  const toggleMode = () => {
    const newMode: ViewMode = viewMode === 'explore' ? 'professional' : 'explore';
    setViewMode(newMode);
    if (newMode === 'explore' && currentRoom === 'landing') {
      navigateTo('ship-map');
    }
  };

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <button
        className={styles.logo}
        onClick={() => navigateTo('ship-map')}
        id="nav-home"
        aria-label="Navigate to ship map"
      >
        <span className={styles.logoIcon}>◈</span>
        <span className={styles.logoText}>RISHI-01</span>
      </button>

      {/* Nav links */}
      <ul className={styles.links} role="list">
        {NAV_ITEMS.map((item) => (
          <li key={item.room}>
            <button
              id={`nav-${item.room}`}
              className={`${styles.link} ${currentRoom === item.room ? styles.active : ''}`}
              onClick={() => navigateTo(item.room)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Right controls */}
      <div className={styles.controls}>
        <a
          href="/resume.pdf"
          download
          className={`btn btn-outline ${styles.resumeBtn}`}
          id="nav-resume"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>

        <button
          id="nav-mode-toggle"
          className={styles.modeToggle}
          onClick={toggleMode}
          aria-label={`Switch to ${viewMode === 'explore' ? 'professional' : 'explore'} mode`}
          title={viewMode === 'explore' ? 'Switch to Professional View' : 'Switch to Explore Mode'}
        >
          {viewMode === 'explore' ? (
            <>
              <span>👔</span>
              <span className={styles.modeLabel}>PRO VIEW</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span className={styles.modeLabel}>EXPLORE</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile hamburger — hidden on desktop, nav collapses */}
      <button className={styles.hamburger} aria-label="Toggle mobile menu" id="nav-mobile-toggle">
        <span /><span /><span />
      </button>
    </nav>
  );
}
