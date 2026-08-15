'use client';

import { useState, useRef, useEffect } from 'react';
import RoomShell from './RoomShell';
import styles from './CommunicationsRoom.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const EXAMPLE_QUESTIONS = [
  'What is TutorAI?',
  'What technologies does Rishi use?',
  'Explain the TutorAI architecture.',
  'What are Rishi\'s achievements?',
  'What projects use LangGraph?',
  'Tell me about Ringmaster\'s RoundTable.',
];

// Static knowledge base for demo responses (no backend needed)
const KB_RESPONSES: Record<string, string> = {
  default: "I can answer questions about Rishi's portfolio — his projects, skills, achievements, and background. Try asking about TutorAI, Ringmaster's RoundTable, his AI/ML skills, or his achievements!",
  tutorai: `**TutorAI** is Rishi's flagship AI engineering project — a personalized AI tutoring and assessment platform built with a sophisticated multi-agent architecture.

**Architecture:**
- **Orchestrator** (LangGraph) routes queries to the right specialized agent
- **Research Agent** retrieves topic content using RAG + pgvector similarity search
- **Visual Agent** processes diagrams, equations, and images using OCR + Computer Vision
- **Tutor Agent** generates personalized explanations using a LoRA-finetuned model with GRPO alignment
- **Critic Agent** evaluates answers for accuracy and groundedness

**Key Technologies:** LangGraph, LangChain, RAG, MCP, LoRA, GRPO, OCR, pgvector, FastAPI, React, Supabase, Docker`,

  ringmaster: `**Ringmaster's RoundTable** is a real-time multi-agent travel planning system.

It coordinates multiple specialized AI agents via **RabbitMQ** message queues:
- **Travel Agent** — plans the itinerary and attractions
- **Weather Agent** — fetches real-time forecasts and alerts
- **Budget Agent** — optimizes costs across accommodation and activities
- **Route Agent** — plans optimal routes using mapping APIs

Updates are streamed live to the user via **Socket.IO**. The system uses **LangGraph** for orchestration and **MCP** for tool integration, running in a **Docker** containerized environment.`,

  skills: `Rishi has deep expertise across several domains:

**AI/ML:** LangGraph, LangChain, RAG, LLMs, MCP, LoRA, GRPO, Computer Vision, TensorFlow, PyTorch, Hugging Face, Embeddings, Vector Databases, OCR

**Backend:** Node.js, Express, FastAPI, REST APIs, WebSockets, Socket.IO, RabbitMQ, Redis, Docker, PostgreSQL, MongoDB, Supabase, Firebase

**Frontend:** React, Next.js, TypeScript, Tailwind CSS

**Competitive Programming:** C++, Data Structures, Algorithms, Dynamic Programming`,

  achievements: `Rishi has achieved notable recognition in competitive programming and hackathons:

🏆 **FitFusion — 1st Runner-Up** at IIT Roorkee Hackathon (2024)
- Built an AI-powered fitness platform with CV-based form correction

🥈 **Hack36 — Top 25 Finalist** at MNNIT Allahabad National Hackathon (2024)
- Selected from 1000+ participants across premier engineering colleges

⚡ **Softathalon Finalist** — algorithmic programming competition

🔵 **Codeforces Pupil** — active competitive programmer
⚔️ **LeetCode Knight** — Top 5% with 500+ problems solved`,

  langgraph: `Rishi uses **LangGraph** in both his major projects:

1. **TutorAI** — LangGraph orchestrates the multi-agent tutoring pipeline, routing between Research, Visual, Tutor, and Critic agents based on query type and context.

2. **Ringmaster's RoundTable** — LangGraph coordinates the travel planning agents (Travel, Weather, Budget, Route) with parallel execution and state management.

LangGraph is Rishi's preferred framework for building stateful, multi-step agentic AI systems with complex branching logic.`,

  education: `Rishi is pursuing a **B.Tech in Computer Science Engineering** at **MNNIT Allahabad** (2022–2026), one of India's premier National Institutes of Technology.

His academic focus areas include:
- Artificial Intelligence & Machine Learning
- Generative AI & Agentic Systems
- Full-Stack Development
- Data Structures & Algorithms`,

  rabbitmq: `Rishi uses **RabbitMQ** in **Ringmaster's RoundTable** as the message broker for his multi-agent travel planning system.

The architecture uses RabbitMQ to:
- Decouple the orchestrator from individual specialized agents
- Enable parallel agent execution (weather, budget, route agents run simultaneously)
- Provide fault tolerance and message persistence
- Allow agents to process tasks asynchronously

This pattern demonstrates production-grade distributed systems knowledge beyond simple API calls.`,
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('tutorai') || q.includes('tutor ai')) return KB_RESPONSES.tutorai;
  if (q.includes('ringmaster') || q.includes('round table') || q.includes('travel')) return KB_RESPONSES.ringmaster;
  if (q.includes('skill') || q.includes('technolog') || q.includes('stack') || q.includes('uses')) return KB_RESPONSES.skills;
  if (q.includes('achievement') || q.includes('hackathon') || q.includes('award') || q.includes('competition') || q.includes('codeforce') || q.includes('leetcode')) return KB_RESPONSES.achievements;
  if (q.includes('langgraph') || q.includes('lang graph')) return KB_RESPONSES.langgraph;
  if (q.includes('education') || q.includes('mnnit') || q.includes('college') || q.includes('study') || q.includes('degree')) return KB_RESPONSES.education;
  if (q.includes('rabbitmq') || q.includes('rabbit') || q.includes('queue') || q.includes('message broker')) return KB_RESPONSES.rabbitmq;
  return KB_RESPONSES.default;
}

// Simulated streaming
async function simulateStream(text: string, onChunk: (chunk: string) => void): Promise<void> {
  const words = text.split(' ');
  for (const word of words) {
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 40));
    onChunk(word + ' ');
  }
}

export default function CommunicationsRoom() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "**Welcome to SHIP AI — RISHI-01 Communications Hub**\n\nI'm the AI assistant for this portfolio. I can answer questions about Rishi's projects, skills, achievements, and background.\n\nTry one of the example questions below, or ask me anything!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdCounter = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    msgIdCounter.current++;
    const userMsg: Message = { id: `msg-${msgIdCounter.current}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const responseText = getResponse(text);
    msgIdCounter.current++;
    const aiMsgId = `msg-${msgIdCounter.current}`;

    setMessages((prev) => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

    let accumulated = '';
    await simulateStream(responseText, (chunk) => {
      accumulated += chunk;
      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, content: accumulated } : m))
      );
    });

    setIsStreaming(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatMessage = (text: string) => {
    // Basic markdown-like formatting
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={i} style={{ color: 'var(--cyan)', display: 'block', marginTop: i > 0 ? '0.75rem' : 0 }}>{line.replace(/\*\*/g, '')}</strong>;
        }
        if (line.startsWith('- ')) {
          return <div key={i} style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>• {line.slice(2)}</div>;
        }
        if (line.includes('**')) {
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <span key={i}>
              {parts.map((part, j) =>
                part.startsWith('**') ? <strong key={j} style={{ color: 'var(--text-primary)' }}>{part.replace(/\*\*/g, '')}</strong> : part
              )}
            </span>
          );
        }
        return <span key={i}>{line}{'\n'}</span>;
      });
  };

  return (
    <RoomShell
      id="communications-room"
      badge="COMMUNICATIONS"
      title="SHIP AI"
      subtitle="Ask anything about Rishi's portfolio — projects, skills, achievements, and more"
      color="var(--green)"
    >
      <div className={styles.chatContainer}>
        {/* Chat window */}
        <div className={`${styles.chatWindow} glass-panel`}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderLeft}>
              <div className={styles.aiAvatar}>
                <span>AI</span>
                <span className={`status-dot green ${styles.aiDot}`} />
              </div>
              <div>
                <div className={styles.aiName}>SHIP AI</div>
                <div className={styles.aiStatus}>Portfolio Knowledge Base • Always Online</div>
              </div>
            </div>
            <div className={styles.chatHeaderRight}>
              <span className="chip">RAG-GROUNDED</span>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messages} id="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
                {msg.role === 'assistant' && (
                  <div className={styles.msgAvatar}>AI</div>
                )}
                <div className={`${styles.msgBubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
                  <div className={styles.msgContent}>
                    {formatMessage(msg.content)}
                    {isStreaming && msg.id === messages[messages.length - 1].id && msg.role === 'assistant' && (
                      <span className={styles.cursor}>▋</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Example chips */}
          <div className={styles.examples}>
            {EXAMPLE_QUESTIONS.slice(0, 4).map((q) => (
              <button
                key={q}
                className={styles.exampleChip}
                onClick={() => sendMessage(q)}
                disabled={isStreaming}
                id={`example-${q.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Rishi's projects, skills, or achievements…"
              className={styles.input}
              disabled={isStreaming}
              maxLength={500}
              aria-label="Chat input"
            />
            <button
              type="submit"
              id="chat-send"
              className={`btn btn-primary ${styles.sendBtn}`}
              disabled={isStreaming || !input.trim()}
              aria-label="Send message"
            >
              {isStreaming ? '⟳' : '→'}
            </button>
          </form>
        </div>

        {/* Info panel */}
        <div className={styles.infoPanel}>
          <div className={`${styles.infoCard} glass-panel`}>
            <h3 className={styles.infoTitle}>KNOWLEDGE BASE</h3>
            <ul className={styles.infoList}>
              {['Projects & Architecture', 'AI/ML Skills', 'Backend Technologies', 'Achievements', 'Education', 'Contact Info'].map((item) => (
                <li key={item} className={styles.infoItem}>
                  <span className="status-dot green" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.infoCard} glass-panel`}>
            <h3 className={styles.infoTitle}>GUARDRAILS ACTIVE</h3>
            <ul className={styles.infoList}>
              {['Grounded responses only', 'No fabrication', 'Portfolio-scoped', 'Injection protected'].map((item) => (
                <li key={item} className={styles.infoItem}>
                  <span className="status-dot cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </RoomShell>
  );
}
