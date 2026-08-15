'use client';

import { useState, useEffect, useRef } from 'react';
import { PORTFOLIO_DATA } from '@/lib/portfolio-data';
import RoomShell from './RoomShell';
import styles from './AILabRoom.module.css';

const NODES = [
  { id: 'llm', label: 'LLMs', x: 50, y: 10, desc: 'Large Language Models — foundation of the system. Gemini, GPT-4, Claude.' },
  { id: 'rag', label: 'RAG', x: 50, y: 30, desc: 'Retrieval-Augmented Generation — grounds LLM responses in real knowledge.' },
  { id: 'agents', label: 'Agents', x: 50, y: 50, desc: 'Autonomous agents orchestrated by LangGraph for multi-step reasoning.' },
  { id: 'tools', label: 'Tools', x: 50, y: 70, desc: 'Tool calling — web search, code execution, database queries, API calls.' },
  { id: 'eval', label: 'Evaluation', x: 50, y: 90, desc: 'Automated evaluation — faithfulness, relevance, and hallucination detection.' },
];

const REQUIRED_ORDER = ['llm', 'rag', 'agents', 'tools', 'eval'];

export default function AILabRoom() {
  const [connectedNodes, setConnectedNodes] = useState<string[]>([]);
  const [stabilized, setStabilized] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleNodeClick = (nodeId: string) => {
    const nextExpected = REQUIRED_ORDER[connectedNodes.length];
    if (nodeId === nextExpected && !connectedNodes.includes(nodeId)) {
      const updated = [...connectedNodes, nodeId];
      setConnectedNodes(updated);
      setActiveNode(nodeId);

      if (updated.length === REQUIRED_ORDER.length) {
        setTimeout(() => setStabilized(true), 600);
      }
    }
    setActiveNode(nodeId);
  };

  // Neural animation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Background particles
      if (Math.random() < 0.3) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 0,
          maxLife: 60 + Math.random() * 60,
        });
      }

      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life++;
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${alpha})`;
        ctx.fill();
        if (p.life >= p.maxLife) particles.splice(i, 1);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const skills = [
    { name: 'LangGraph', level: 92 },
    { name: 'LangChain', level: 90 },
    { name: 'RAG Pipeline', level: 90 },
    { name: 'Agentic AI', level: 92 },
    { name: 'Fine-Tuning (LoRA/GRPO)', level: 80 },
    { name: 'Computer Vision', level: 85 },
    { name: 'FAISS / Vector DBs', level: 85 },
    { name: 'TensorFlow', level: 82 },
  ];

  return (
    <RoomShell
      id="ai-lab-room"
      badge="AI LABORATORY"
      title="NEURAL SYSTEMS"
      subtitle="Stabilize the neural core by connecting the AI pipeline in sequence"
      color="var(--purple)"
    >
      <div className={styles.layout}>

        {/* Neural network task */}
        <div className={`${styles.networkPanel} glass-panel`}>
          <canvas ref={canvasRef} className={styles.networkCanvas} aria-hidden="true" />

          <div className={styles.networkContent}>
            <div className={styles.networkTitle}>
              <span className="section-badge" style={{ borderColor: 'rgba(124,58,237,0.3)', color: 'var(--violet)' }}>
                NEURAL CORE
              </span>
              {!stabilized ? (
                <p className={styles.networkInstr}>
                  Click nodes in sequence: LLMs → RAG → Agents → Tools → Evaluation
                </p>
              ) : (
                <p className={styles.stabilizedMsg}>⚡ NEURAL CORE STABILIZED</p>
              )}
            </div>

            {/* Nodes */}
            <div className={styles.nodesContainer}>
              {NODES.map((node, idx) => {
                const isConnected = connectedNodes.includes(node.id);
                const isNext = REQUIRED_ORDER[connectedNodes.length] === node.id;
                const isActive = activeNode === node.id;

                return (
                  <div key={node.id} className={styles.nodeRow}>
                    {/* Connection line above */}
                    {idx > 0 && (
                      <div className={`${styles.connector} ${isConnected ? styles.connectorActive : ''}`} />
                    )}

                    <button
                      id={`neural-node-${node.id}`}
                      className={`${styles.node} ${isConnected ? styles.nodeConnected : ''} ${isNext && !stabilized ? styles.nodeNext : ''} ${isActive ? styles.nodeActive : ''}`}
                      onClick={() => handleNodeClick(node.id)}
                      aria-label={`Connect ${node.label} node`}
                      disabled={stabilized && isConnected}
                    >
                      <span className={styles.nodeLabel}>{node.label}</span>
                      {isConnected && <span className={styles.nodeCheck}>✓</span>}
                    </button>

                    {/* Node description */}
                    {isActive && (
                      <div className={styles.nodeDesc}>{node.desc}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {!stabilized && (
              <button
                className="btn btn-ghost"
                style={{ marginTop: '1rem', fontSize: '0.7rem' }}
                onClick={() => {
                  setConnectedNodes(REQUIRED_ORDER);
                  setTimeout(() => setStabilized(true), 400);
                }}
              >
                Skip task — view skills directly
              </button>
            )}
          </div>
        </div>

        {/* Skills reveal */}
        <div className={`${styles.skillsPanel} ${stabilized ? styles.skillsVisible : ''}`}>
          <div className={styles.skillsTitle}>
            <h3>AI / ML CAPABILITIES</h3>
            <span className={`status-dot ${stabilized ? 'green' : 'amber'}`} />
          </div>

          <div className={styles.skillsGrid}>
            {skills.map((skill, i) => (
              <div
                key={skill.name}
                className={`${styles.skillCard} glass-panel`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={styles.skillName}>{skill.name}</div>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillFill}
                    style={{ width: stabilized ? `${skill.level}%` : '0%' }}
                  />
                </div>
                <div className={styles.skillLevel}>{skill.level}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </RoomShell>
  );
}
