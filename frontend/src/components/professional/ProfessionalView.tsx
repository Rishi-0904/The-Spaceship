'use client';

import { useState } from 'react';
import { PORTFOLIO_DATA } from '@/lib/portfolio-data';
import { usePortfolioStore } from '@/store/portfolio';
import styles from './ProfessionalView.module.css';

export default function ProfessionalView() {
  const { navigateTo, setViewMode } = usePortfolioStore();
  const [activeSection, setActiveSection] = useState('about');

  const sections = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ];

  const switchToExplore = () => {
    setViewMode('explore');
    navigateTo('ship-map');
  };

  return (
    <div className={styles.view}>
      <div className="container">
        {/* Switch banner */}
        <div className={styles.switchBanner}>
          <span className={styles.switchText}>
            📋 Professional View — simplified layout for recruiters
          </span>
          <button className="btn btn-outline" onClick={switchToExplore} id="pro-switch-explore" style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}>
            🚀 Explore Ship Mode
          </button>
        </div>

        {/* Inline nav */}
        <nav className={styles.sectionNav} aria-label="Section navigation">
          {sections.map((s) => (
            <button
              key={s.id}
              id={`pro-nav-${s.id}`}
              className={`${styles.sectionNavBtn} ${activeSection === s.id ? styles.active : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* ── About ── */}
        {activeSection === 'about' && (
          <section id="pro-about" className={styles.section}>
            <div className={styles.aboutLayout}>
              <div className={styles.aboutAvatar}>
                <img src="/avatar.png" alt="Rishi Raj Jaiswal" className={styles.avatar} />
                <div className={styles.avatarStatus}>
                  <span className="status-dot green" />
                  Open to opportunities
                </div>
              </div>
              <div className={styles.aboutInfo}>
                <h1 className={styles.proName}>{PORTFOLIO_DATA.name}</h1>
                <p className={styles.proTitle}>{PORTFOLIO_DATA.title}</p>
                <div className={styles.proEdu}>
                  🎓 {PORTFOLIO_DATA.education.degree} — <strong>{PORTFOLIO_DATA.education.institution}</strong> ({PORTFOLIO_DATA.education.years})
                </div>
                <p className={styles.proBio}>
                  Building intelligent systems at the intersection of AI and engineering.
                  Specializing in multi-agent architectures, retrieval-augmented generation, and
                  production-grade full-stack systems. Passionate about Generative AI, Agentic AI, and LLM engineering.
                </p>
                <div className={styles.proAreas}>
                  {PORTFOLIO_DATA.areas.map((a) => (
                    <span key={a} className="chip">{a}</span>
                  ))}
                </div>
                <div className={styles.proLinks}>
                  <a href={PORTFOLIO_DATA.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline" id="pro-github">GitHub</a>
                  <a href={PORTFOLIO_DATA.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline" id="pro-linkedin">LinkedIn</a>
                  <a href={PORTFOLIO_DATA.links.resume} download className="btn btn-primary" id="pro-resume" target="_blank" rel="noopener noreferrer">Download Resume</a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Skills ── */}
        {activeSection === 'skills' && (
          <section id="pro-skills" className={styles.section}>
            <h2 className={`section-title ${styles.sectionTitle}`}>Technical Skills</h2>
            {Object.entries(PORTFOLIO_DATA.skills).map(([cat, skills]) => (
              <div key={cat} className={styles.skillCat}>
                <h3 className={styles.skillCatTitle}>{cat.replace('ai', 'AI / ML').replace('cp', 'Competitive Programming').replace('backend', 'Backend / DevOps').replace('frontend', 'Frontend')}</h3>
                <div className={styles.skillGrid}>
                  {skills.map((skill) => (
                    <div key={skill.name} className={`${styles.skillRow} glass-panel`}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <div className={styles.skillBar}>
                        <div className={styles.skillFill} style={{ width: `${skill.level}%` }} />
                      </div>
                      <span className={styles.skillPct}>{skill.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── Projects ── */}
        {activeSection === 'projects' && (
          <section id="pro-projects" className={styles.section}>
            <h2 className={`section-title ${styles.sectionTitle}`}>Featured Projects</h2>
            <div className={styles.projectGrid}>
              {PORTFOLIO_DATA.projects.map((p) => (
                <div key={p.id} className={`${styles.projectCard} glass-panel`}>
                  <div className={styles.projectStatus}>
                    <span className={`status-dot ${p.status === 'active' ? 'amber' : 'green'}`} />
                    {p.status === 'active' ? 'In Progress' : 'Completed'}
                  </div>
                  <h3 className={styles.projectName}>{p.name}</h3>
                  <p className={styles.projectTagline}>{p.tagline}</p>
                  <p className={styles.projectDesc}>{p.description}</p>
                  <div className={styles.projectTech}>
                    {p.tech.slice(0, 7).map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                  <div className={styles.projectLinks}>
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline" id={`pro-project-github-${p.id}`} style={{ fontSize: '0.75rem' }}>GitHub</a>
                    <button className="btn btn-ghost" onClick={() => { setViewMode('explore'); navigateTo('project-archive'); }} style={{ fontSize: '0.75rem' }}>
                      View Interactive Case Study →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Achievements ── */}
        {activeSection === 'achievements' && (
          <section id="pro-achievements" className={styles.section}>
            <h2 className={`section-title ${styles.sectionTitle}`}>Achievements</h2>
            <div className={styles.achievementList}>
              {PORTFOLIO_DATA.achievements.map((a) => (
                <div key={a.id} className={`${styles.achievementRow} glass-panel`}>
                  <span className={styles.achievementIcon}>{a.icon}</span>
                  <div className={styles.achievementBody}>
                    <div className={styles.achievementTitle}>{a.title}</div>
                    <div className={styles.achievementEvent}>{a.event} · {a.year}</div>
                    <div className={styles.achievementDesc}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Contact ── */}
        {activeSection === 'contact' && (
          <section id="pro-contact" className={styles.section}>
            <h2 className={`section-title ${styles.sectionTitle}`}>Get in Touch</h2>
            <div className={styles.contactGrid}>
              {[
                { label: 'Email', value: 'rishirajjaiswal0904@gmail.com', href: PORTFOLIO_DATA.links.email, id: 'pro-contact-email' },
                { label: 'LinkedIn', value: 'linkedin.com/in/rishi-raj-jaiswal', href: PORTFOLIO_DATA.links.linkedin, id: 'pro-contact-linkedin' },
                { label: 'GitHub', value: 'github.com/Rishi-0904', href: PORTFOLIO_DATA.links.github, id: 'pro-contact-github' },
                { label: 'LeetCode', value: 'leetcode.com/u/Rishi0904/', href: PORTFOLIO_DATA.links.leetcode, id: 'pro-contact-leetcode' },
                { label: 'Codeforces', value: 'codeforces.com/profile/Rishi0904', href: PORTFOLIO_DATA.links.codeforces, id: 'pro-contact-cf' },
              ].map((link) => (
                <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} glass-panel`} id={link.id}>
                  <div className={styles.contactLabel}>{link.label}</div>
                  <div className={styles.contactValue}>{link.value}</div>
                  <span className={styles.contactArrow}>→</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
