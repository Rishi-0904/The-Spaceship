'use client';

import { useState, useEffect } from 'react';
import { type Project } from '@/lib/portfolio-data';
import styles from './ProjectModal.module.css';

interface ArchNode { readonly id: string; readonly label: string; readonly desc: string; readonly icon?: string; }

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeNode, setActiveNode] = useState<ArchNode | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'tech'>('overview');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Determine architecture nodes
  const archNodes: readonly ArchNode[] = 'architecture' in project
    ? (project as unknown as { architecture: { nodes: readonly ArchNode[] } }).architecture.nodes
    : 'pipeline' in project
    ? (project as unknown as { pipeline: readonly ArchNode[] }).pipeline
    : [];

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={`${project.name} case study`}>
      <div className={styles.modal}>
        {/* Modal header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleWrap}>
            <div className={styles.modalBadge}>
              <span className={`status-dot ${project.status === 'active' ? 'amber' : 'green'}`} />
              {project.status === 'active' ? 'IN PROGRESS' : 'COMPLETED'}
            </div>
            <h2 className={styles.modalTitle}>{project.name}</h2>
            <p className={styles.modalTagline}>{project.tagline}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal" id="modal-close">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          {(['overview', 'architecture', 'tech'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
              id={`tab-${tab}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.modalBody}>
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Problem Statement</h3>
                <p className={styles.sectionText}>{project.description}</p>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Key Technologies</h3>
                <div className={styles.techChips}>
                  {project.tech.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.links}>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline" id={`modal-github-${project.id}`}>
                  ⬡ GitHub Repository
                </a>
                {project.demo !== '#' && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary" id={`modal-demo-${project.id}`}>
                    ↗ Live Demo
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className={styles.architecture}>
              <p className={styles.archInstr}>Click any component to learn more about it.</p>

              <div className={styles.archDiagram}>
                {archNodes.map((node, i) => (
                  <div key={node.id} className={styles.archRow}>
                    {i > 0 && (
                      <div className={styles.archArrow}>
                        <div className={styles.archArrowLine} />
                        <div className={styles.archArrowHead}>▼</div>
                      </div>
                    )}
                    <button
                      id={`arch-node-${node.id}`}
                      className={`${styles.archNode} ${activeNode?.id === node.id ? styles.archNodeActive : ''}`}
                      onClick={() => setActiveNode(activeNode?.id === node.id ? null : node)}
                    >
                      {'icon' in node && <span className={styles.archIcon}>{(node as { icon: string }).icon}</span>}
                      <span className={styles.archNodeLabel}>{node.label}</span>
                    </button>
                    {activeNode?.id === node.id && (
                      <div className={styles.archNodeDesc}>{node.desc}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className={styles.techDeep}>
              <h3 className={styles.sectionTitle}>Full Technology Stack</h3>
              <div className={styles.techGrid}>
                {project.tech.map((t) => (
                  <div key={t} className={`${styles.techItem} glass-panel`}>
                    <span className={styles.techItemName}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
