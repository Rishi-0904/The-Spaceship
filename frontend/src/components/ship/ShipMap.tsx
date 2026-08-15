'use client';

import { usePortfolioStore, type Room } from '@/store/portfolio';
import styles from './ShipMap.module.css';

interface RoomDef {
  id: Room;
  label: string;
  sublabel: string;
  icon: string;
  status: 'available' | 'active' | 'locked';
  x: number; // percentage
  y: number;
  width: number;
  height: number;
  color: string;
}

const ROOMS: RoomDef[] = [
  {
    id: 'command',
    label: 'COMMAND',
    sublabel: 'About Rishi',
    icon: '◉',
    status: 'available',
    x: 36, y: 10, width: 28, height: 20,
    color: 'var(--cyan)',
  },
  {
    id: 'ai-lab',
    label: 'AI LAB',
    sublabel: 'Neural Systems',
    icon: '⬡',
    status: 'available',
    x: 5, y: 38, width: 26, height: 20,
    color: 'var(--purple)',
  },
  {
    id: 'engineering',
    label: 'ENGINEERING',
    sublabel: 'Backend Core',
    icon: '⚙',
    status: 'available',
    x: 69, y: 38, width: 26, height: 20,
    color: 'var(--teal)',
  },
  {
    id: 'project-archive',
    label: 'PROJECT ARCHIVE',
    sublabel: 'Case Studies',
    icon: '▣',
    status: 'available',
    x: 36, y: 40, width: 28, height: 18,
    color: 'var(--blue)',
  },
  {
    id: 'achievement',
    label: 'ACHIEVEMENT',
    sublabel: 'Trophy Room',
    icon: '★',
    status: 'available',
    x: 5, y: 68, width: 26, height: 20,
    color: 'var(--amber)',
  },
  {
    id: 'communications',
    label: 'COMMS',
    sublabel: 'AI Assistant',
    icon: '◈',
    status: 'available',
    x: 69, y: 68, width: 26, height: 20,
    color: 'var(--green)',
  },
  {
    id: 'system-core',
    label: 'SYSTEM CORE',
    sublabel: 'Contact',
    icon: '◎',
    status: 'available',
    x: 36, y: 70, width: 28, height: 18,
    color: 'var(--warning)',
  },
];

export default function ShipMap() {
  const { navigateTo, exploredRooms } = usePortfolioStore();

  return (
    <div className={styles.shipMap}>
      <div className="container">
        <div className={styles.header}>
          <div className="section-badge">🚀 SHIP NAVIGATION</div>
          <h1 className={`section-title ${styles.title}`}>RISHI-01 DECK MAP</h1>
          <p className={styles.subtitle}>
            Select a room to begin exploration. Each section contains interactive tasks and portfolio information.
          </p>
        </div>

        {/* Ship schematic */}
        <div className={styles.schematic}>
          {/* Corridor connections */}
          <div className={styles.corridors} aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.corridorSvg}>
              {/* Vertical main corridor */}
              <line x1="50" y1="20" x2="50" y2="80" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5"/>
              {/* Horizontal mid corridor */}
              <line x1="18" y1="48" x2="82" y2="48" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5"/>
              {/* Horizontal lower corridor */}
              <line x1="18" y1="78" x2="82" y2="78" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5"/>
              {/* Data pulse animation */}
              <circle r="0.8" fill="rgba(0,212,255,0.6)">
                <animateMotion dur="4s" repeatCount="indefinite" path="M 50 20 L 50 80 L 18 80 L 18 48 L 82 48 Z" />
              </circle>
            </svg>
          </div>

          {/* Room buttons */}
          {ROOMS.map((room) => {
            const explored = exploredRooms.has(room.id);
            return (
              <button
                key={room.id}
                id={`room-${room.id}`}
                className={`${styles.room} ${explored ? styles.explored : ''}`}
                style={{
                  left: `${room.x}%`,
                  top: `${room.y}%`,
                  width: `${room.width}%`,
                  minHeight: '90px',
                  '--room-color': room.color,
                } as React.CSSProperties}
                onClick={() => navigateTo(room.id)}
                aria-label={`Enter ${room.label} — ${room.sublabel}`}
              >
                <span className={styles.roomIcon} style={{ color: room.color }}>{room.icon}</span>
                <span className={styles.roomLabel}>{room.label}</span>
                <span className={styles.roomSub}>{room.sublabel}</span>
                {explored && <span className={styles.exploredBadge}>✓ EXPLORED</span>}
                <div className={styles.roomGlow} style={{ background: `radial-gradient(circle, ${room.color}20, transparent)` }} />
              </button>
            );
          })}

          {/* Ship designation */}
          <div className={styles.designation} aria-hidden="true">
            <span>RISHI-01</span>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className="status-dot cyan" />
            Available
          </div>
          <div className={styles.legendItem}>
            <span className="status-dot green" />
            Explored
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendKey}>CLICK</span>
            Enter room
          </div>
        </div>
      </div>
    </div>
  );
}
