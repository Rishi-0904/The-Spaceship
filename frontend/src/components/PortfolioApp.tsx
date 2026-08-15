'use client';

import { useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import LandingScreen from './landing/LandingScreen';
import ShipMap from './ship/ShipMap';
import TopNav from './ui/TopNav';
import CommandRoom from './rooms/CommandRoom';
import AILabRoom from './rooms/AILabRoom';
import ProjectArchive from './rooms/ProjectArchive';
import EngineeringRoom from './rooms/EngineeringRoom';
import AchievementRoom from './rooms/AchievementRoom';
import CommunicationsRoom from './rooms/CommunicationsRoom';
import SystemCore from './rooms/SystemCore';
import ProfessionalView from './professional/ProfessionalView';
import FinaleSequence from './ui/FinaleSequence';
import styles from './PortfolioApp.module.css';

export default function PortfolioApp() {
  const { currentRoom, viewMode, finaleTriggered } = usePortfolioStore();

  // Prevent body scroll when needed
  useEffect(() => {
    document.body.style.overflow = currentRoom === 'landing' ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [currentRoom]);

  if (finaleTriggered) return <FinaleSequence />;

  return (
    <div className={styles.app}>
      {/* Background always rendered */}
      <div className={styles.stars} aria-hidden="true">
        {Array.from({ length: 80 }).map((_, i) => (
          <span key={i} className={styles.star} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 4}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.3 + Math.random() * 0.7,
          }} />
        ))}
      </div>

      {/* Landing */}
      {currentRoom === 'landing' && <LandingScreen />}

      {/* Main experience */}
      {currentRoom !== 'landing' && (
        <>
          <TopNav />
          {viewMode === 'professional' ? (
            <ProfessionalView />
          ) : (
            <div className={styles.experience}>
              {currentRoom === 'ship-map' && <ShipMap />}
              {currentRoom === 'command' && <CommandRoom />}
              {currentRoom === 'ai-lab' && <AILabRoom />}
              {currentRoom === 'project-archive' && <ProjectArchive />}
              {currentRoom === 'engineering' && <EngineeringRoom />}
              {currentRoom === 'achievement' && <AchievementRoom />}
              {currentRoom === 'communications' && <CommunicationsRoom />}
              {currentRoom === 'system-core' && <SystemCore />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
