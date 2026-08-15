'use client';

import { useState } from 'react';
import { PORTFOLIO_DATA } from '@/lib/portfolio-data';
import RoomShell from './RoomShell';
import styles from './EngineeringRoom.module.css';

const PIPE_SEGMENTS = [
  { id: 'frontend', label: 'Frontend', icon: '⬡', desc: 'React / Next.js interfaces', connected: false },
  { id: 'api', label: 'API Layer', icon: '⊕', desc: 'FastAPI / Express / REST', connected: false },
  { id: 'queue', label: 'Message Queue', icon: '◈', desc: 'RabbitMQ / Redis Pub-Sub', connected: false },
  { id: 'workers', label: 'Workers', icon: '⚙', desc: 'Async background processors', connected: false },
  { id: 'database', label: 'Database', icon: '◎', desc: 'PostgreSQL / MongoDB / Supabase', connected: false },
];

export default function EngineeringRoom() {
  const [connected, setConnected] = useState<string[]>([]);
  const [repaired, setRepaired] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    if (!connected.includes(id)) {
      const updated = [...connected, id];
      setConnected(updated);
      if (updated.length === PIPE_SEGMENTS.length) {
        setTimeout(() => setRepaired(true), 400);
      }
    }
    setActiveSegment(id);
  };

  return (
    <RoomShell
      id="engineering-room"
      badge="ENGINEERING BAY"
      title="SERVICE CORE"
      subtitle="Reconnect the distributed service pipeline to restore full system functionality"
      color="var(--teal)"
    >
      <div className={styles.layout}>
        {/* Pipe repair task */}
        <div className={`${styles.taskPanel} glass-panel`}>
          <div className={styles.taskHeader}>
            <span className={styles.taskIcon} style={{ color: 'var(--teal)' }}>⚙</span>
            <div>
              <div className={styles.taskTitle}>REPAIR THE SERVICE CORE</div>
              <div className={styles.taskDesc}>Activate each service node to reconnect the distributed pipeline.</div>
            </div>
          </div>

          <div className={styles.pipeline}>
            {PIPE_SEGMENTS.map((seg, i) => {
              const isConnected = connected.includes(seg.id);
              const isActive = activeSegment === seg.id;

              return (
                <div key={seg.id} className={styles.pipeRow}>
                  {i > 0 && (
                    <div className={`${styles.pipe} ${isConnected && connected.includes(PIPE_SEGMENTS[i - 1].id) ? styles.pipeActive : ''}`}>
                      <div className={styles.pipeFlow} />
                    </div>
                  )}
                  <button
                    id={`pipe-${seg.id}`}
                    className={`${styles.segment} ${isConnected ? styles.segmentConnected : ''} ${isActive ? styles.segmentActive : ''}`}
                    onClick={() => handleConnect(seg.id)}
                    aria-label={`Activate ${seg.label}`}
                    disabled={repaired}
                  >
                    <span className={styles.segIcon}>{seg.icon}</span>
                    <div className={styles.segInfo}>
                      <span className={styles.segLabel}>{seg.label}</span>
                      {isActive && <span className={styles.segDesc}>{seg.desc}</span>}
                    </div>
                    {isConnected && <span className={styles.segCheck}>●</span>}
                  </button>
                </div>
              );
            })}
          </div>

          {repaired ? (
            <div className={styles.repairedMsg}>
              ✓ PIPELINE RESTORED — ALL SERVICES ONLINE
            </div>
          ) : (
            <button
              className="btn btn-ghost"
              style={{ marginTop: '0.75rem', fontSize: '0.7rem', width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setConnected(PIPE_SEGMENTS.map(s => s.id));
                setTimeout(() => setRepaired(true), 400);
              }}
            >
              Skip task — view skills directly
            </button>
          )}
        </div>

        {/* Skills */}
        <div className={`${styles.skills} ${repaired ? styles.skillsVisible : ''}`}>
          <div className={styles.skillSection}>
            <h3 className={styles.skillSectionTitle} style={{ color: 'var(--teal)' }}>BACKEND & INFRASTRUCTURE</h3>
            <div className={styles.chipCloud}>
              {PORTFOLIO_DATA.skills.backend.map((skill) => (
                <div key={skill.name} className={`${styles.skillChip} glass-panel`}>
                  <span className={styles.chipName}>{skill.name}</span>
                  <div className={styles.chipBar}>
                    <div className={styles.chipFill} style={{ width: repaired ? `${skill.level}%` : '0%', background: 'linear-gradient(90deg, var(--teal), var(--cyan))' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.skillSection}>
            <h3 className={styles.skillSectionTitle} style={{ color: 'var(--cyan)' }}>FRONTEND</h3>
            <div className={styles.chipCloud}>
              {PORTFOLIO_DATA.skills.frontend.map((skill) => (
                <div key={skill.name} className={`${styles.skillChip} glass-panel`}>
                  <span className={styles.chipName}>{skill.name}</span>
                  <div className={styles.chipBar}>
                    <div className={styles.chipFill} style={{ width: repaired ? `${skill.level}%` : '0%', background: 'linear-gradient(90deg, var(--cyan), var(--blue))' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.skillSection}>
            <h3 className={styles.skillSectionTitle} style={{ color: 'var(--amber)' }}>COMPETITIVE PROGRAMMING</h3>
            <div className={styles.chipCloud}>
              {PORTFOLIO_DATA.skills.cp.map((skill) => (
                <div key={skill.name} className={`${styles.skillChip} glass-panel`}>
                  <span className={styles.chipName}>{skill.name}</span>
                  <div className={styles.chipBar}>
                    <div className={styles.chipFill} style={{ width: repaired ? `${skill.level}%` : '0%', background: 'linear-gradient(90deg, var(--amber), var(--warning))' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoomShell>
  );
}
