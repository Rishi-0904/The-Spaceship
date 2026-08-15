'use client';

import { useEffect, useRef, useState } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import styles from './LandingScreen.module.css';

export default function LandingScreen() {
  const { navigateTo } = usePortfolioStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'boot' | 'welcome' | 'ready'>('boot');
  const [bootLines, setBootLines] = useState<string[]>([]);

  // Boot sequence text
  const BOOT_SEQUENCE = [
    '> RISHI-01 STARSHIP SYSTEMS ONLINE',
    '> LIFE SUPPORT: NOMINAL',
    '> NAVIGATION CORE: ACTIVE',
    '> AI SUBSYSTEMS: LOADED',
    '> CREW MANIFEST: 1 ENGINEER ABOARD',
    '> ALL SYSTEMS NOMINAL — READY FOR DEPARTURE',
  ];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        setBootLines((prev) => [...prev, BOOT_SEQUENCE[i]]);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setPhase('welcome'), 500);
        setTimeout(() => setPhase('ready'), 1200);
      }
    }, 350);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Particle starfield canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particles = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    // Occasional shooting stars
    const shootingStars: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        vx: 4 + Math.random() * 4,
        vy: 2 + Math.random() * 2,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      });
    };

    let shootTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      grad.addColorStop(0, 'rgba(10,15,40,1)');
      grad.addColorStop(0.5, 'rgba(5,10,25,1)');
      grad.addColorStop(1, 'rgba(3,7,18,1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula blobs
      const nebulaGrad = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.3, 0,
        canvas.width * 0.7, canvas.height * 0.3, 300
      );
      nebulaGrad.addColorStop(0, 'rgba(124,58,237,0.05)');
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebulaGrad2 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.7, 0,
        canvas.width * 0.2, canvas.height * 0.7, 250
      );
      nebulaGrad2.addColorStop(0, 'rgba(0,100,200,0.06)');
      nebulaGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      particles.forEach((p) => {
        p.twinkle += 0.02;
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;

        const opacity = p.opacity * (0.7 + 0.3 * Math.sin(p.twinkle));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${opacity})`;
        ctx.fill();
      });

      // Shooting stars
      shootTimer++;
      if (shootTimer > 120) {
        spawnShootingStar();
        shootTimer = 0;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        const progress = s.life / s.maxLife;
        const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
        const len = 40 * (1 - progress * 0.5);

        const grad = ctx.createLinearGradient(s.x - len, s.y - len * 0.5, s.x, s.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `rgba(0,212,255,${alpha * 0.8})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x - len, s.y - len * 0.5);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={styles.landing}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Boot sequence */}
      {phase === 'boot' && (
        <div className={styles.boot}>
          <div className={styles.bootTerminal}>
            <div className={styles.bootHeader}>
              <span className={styles.bootDot} style={{ background: '#ff4444' }} />
              <span className={styles.bootDot} style={{ background: '#f59e0b' }} />
              <span className={styles.bootDot} style={{ background: '#10b981' }} />
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(0,212,255,0.5)' }}>
                RISHI-01 BOOT TERMINAL
              </span>
            </div>
            <div className={styles.bootLines}>
              {bootLines.map((line, i) => (
                <div key={i} className={styles.bootLine}>{line}</div>
              ))}
              <div className={styles.bootCursor}>_</div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome screen */}
      {phase !== 'boot' && (
        <div className={`${styles.welcome} ${phase === 'ready' ? styles.welcomeReady : ''}`}>
          {/* Ship silhouette */}
          <div className={styles.shipSilhouette} aria-hidden="true">
            <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Main body */}
              <ellipse cx="200" cy="100" rx="160" ry="40" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.3)" strokeWidth="1"/>
              {/* Cockpit dome */}
              <ellipse cx="200" cy="80" rx="60" ry="30" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.4)" strokeWidth="1"/>
              {/* Wings */}
              <path d="M80 100 L20 130 L60 115 Z" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.25)" strokeWidth="1"/>
              <path d="M320 100 L380 130 L340 115 Z" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.25)" strokeWidth="1"/>
              {/* Engine glow */}
              <ellipse cx="130" cy="115" rx="12" ry="5" fill="rgba(124,58,237,0.4)"/>
              <ellipse cx="270" cy="115" rx="12" ry="5" fill="rgba(124,58,237,0.4)"/>
              {/* Hull lines */}
              <line x1="140" y1="90" x2="260" y2="90" stroke="rgba(0,212,255,0.15)" strokeWidth="1"/>
              <line x1="120" y1="100" x2="280" y2="100" stroke="rgba(0,212,255,0.1)" strokeWidth="1"/>
              {/* Designation */}
              <text x="200" y="104" textAnchor="middle" fontFamily="Orbitron, monospace" fontSize="8" fill="rgba(0,212,255,0.6)" letterSpacing="4">RISHI-01</text>
              {/* Scanning beam */}
              <line x1="200" y1="50" x2="200" y2="0" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" strokeDasharray="4 4"/>
            </svg>
          </div>

          <div className={styles.content}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              STARSHIP SYSTEMS NOMINAL
            </div>

            <h1 className={styles.title}>
              Welcome aboard
              <span className={styles.shipName}> RISHI-01</span>
            </h1>

            <p className={styles.subtitle}>
              Explore the ship. Complete the tasks. Discover the engineer.
            </p>

            <div className={styles.subtext}>
              Engineering portfolio of <strong>Rishi Raj Jaiswal</strong> — AI/ML Engineer & Full-Stack Developer
            </div>

            <div className={styles.ctas}>
              <button
                id="btn-enter-ship"
                className={`btn btn-primary ${styles.ctaPrimary}`}
                onClick={() => navigateTo('ship-map')}
              >
                <span>🚀</span>
                ENTER SHIP
              </button>
              <button
                id="btn-view-portfolio"
                className={`btn btn-outline`}
                onClick={() => {
                  navigateTo('command');
                  usePortfolioStore.getState().setViewMode('professional');
                }}
              >
                VIEW PORTFOLIO
              </button>
              <a
                id="btn-download-resume"
                href="/resume.pdf"
                download
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                ↓ DOWNLOAD RESUME
              </a>
            </div>

            <div className={styles.statusBar}>
              <span className={styles.statusItem}><span className="status-dot green" /> ONLINE</span>
              <span className={styles.statusItem}><span className="status-dot cyan" /> AI READY</span>
              <span className={styles.statusItem}><span className="status-dot amber" /> 7 ROOMS AVAILABLE</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll hint */}
      {phase === 'ready' && (
        <div className={styles.scrollHint} aria-label="Scroll down to explore">
          <div className={styles.scrollLine} />
          SCROLL TO EXPLORE
        </div>
      )}
    </div>
  );
}
