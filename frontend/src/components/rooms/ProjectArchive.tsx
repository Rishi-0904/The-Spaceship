'use client';

import { useState } from 'react';
import { PORTFOLIO_DATA, type Project } from '@/lib/portfolio-data';
import RoomShell from './RoomShell';
import ProjectModal from './ProjectModal';
import styles from './ProjectArchive.module.css';

export default function ProjectArchive() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <RoomShell
      id="project-archive"
      badge="PROJECT ARCHIVE"
      title="MISSION CASE STUDIES"
      subtitle="Explore detailed architectural breakdowns and interactive system diagrams"
      color="var(--blue)"
    >
      <div className={styles.grid}>
        {PORTFOLIO_DATA.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={() => setActiveProject(project)}
          />
        ))}
      </div>

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </RoomShell>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const isActive = project.status === 'active';

  return (
    <article
      id={`project-card-${project.id}`}
      className={`${styles.card} glass-panel corner-deco`}
    >
      {/* Status badge */}
      <div className={styles.cardTop}>
        <div className={`${styles.statusBadge} ${isActive ? styles.activeBadge : ''}`}>
          <span className={`status-dot ${isActive ? 'amber' : 'green'}`} />
          {isActive ? 'IN PROGRESS' : 'COMPLETED'}
        </div>
        <div className={styles.projectNum}>
          {PORTFOLIO_DATA.projects.indexOf(project) + 1 < 10
            ? `0${PORTFOLIO_DATA.projects.indexOf(project) + 1}`
            : PORTFOLIO_DATA.projects.indexOf(project) + 1}
        </div>
      </div>

      {/* Title */}
      <h2 className={styles.cardTitle}>{project.name}</h2>
      <p className={styles.cardTagline}>{project.tagline}</p>
      <p className={styles.cardDesc}>{project.description}</p>

      {/* Tech chips */}
      <div className={styles.techList}>
        {project.tech.slice(0, 6).map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
        {project.tech.length > 6 && (
          <span className="chip chip-purple">+{project.tech.length - 6} more</span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.cardActions}>
        <button
          id={`btn-case-study-${project.id}`}
          className="btn btn-primary"
          onClick={onOpen}
          aria-label={`View ${project.name} case study`}
        >
          ▣ CASE STUDY
        </button>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          id={`btn-github-${project.id}`}
          aria-label={`${project.name} GitHub repository`}
        >
          ⬡ GitHub
        </a>
        {project.demo !== '#' && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            id={`btn-demo-${project.id}`}
            aria-label={`${project.name} live demo`}
          >
            ↗ Demo
          </a>
        )}
      </div>
    </article>
  );
}
