'use client';

import { useState, useRef, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import styles from './AIChatBubble.module.css';

interface Source {
  title: string;
  chunk_preview?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

const QUICK_PROMPTS = [
  'What are Rishi\'s top skills?',
  'Tell me about TutorAI',
  'Ringmaster\'s RoundTable?',
  'Rishi\'s achievements?',
];

const LOCAL_RESPONSES: Record<string, string> = {
  default: "I'm Rishi's AI assistant. I can tell you all about his projects (TutorAI, Ringmaster's RoundTable), AI/ML & full-stack skills, and achievements!",
  tutorai: "**TutorAI** is Rishi's flagship project — an adaptive AI tutoring platform built with LangGraph, RAG, pgvector, and LoRA/GRPO fine-tuned models.",
  ringmaster: "**Ringmaster's RoundTable** is a multi-agent travel orchestrator using RabbitMQ, Socket.IO, LangGraph, and Docker.",
  skills: "Rishi specializes in **AI/ML** (LangGraph, RAG, PyTorch, LoRA), **Backend** (FastAPI, PostgreSQL, Redis, RabbitMQ, Docker), and **Frontend** (React, Next.js, TypeScript).",
  achievements: "Rishi won **1st Runner-Up at IIT Roorkee Hackathon**, **Top 25 Finalist at Hack36**, and is a **LeetCode Knight** (Top 5%).",
};

function getLocalFallback(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('tutorai') || q.includes('tutor')) return LOCAL_RESPONSES.tutorai;
  if (q.includes('ringmaster') || q.includes('travel')) return LOCAL_RESPONSES.ringmaster;
  if (q.includes('skill') || q.includes('stack') || q.includes('technolog')) return LOCAL_RESPONSES.skills;
  if (q.includes('achievement') || q.includes('award') || q.includes('hackathon') || q.includes('leetcode')) return LOCAL_RESPONSES.achievements;
  return LOCAL_RESPONSES.default;
}

async function simulateStream(text: string, onChunk: (chunk: string) => void): Promise<void> {
  const words = text.split(' ');
  for (const word of words) {
    await new Promise((r) => setTimeout(r, 15 + Math.random() * 30));
    onChunk(word + ' ');
  }
}

export default function AIChatBubble() {
  const { chatOpen, toggleChat } = usePortfolioStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! 👋 I'm **Rishi AI**. Ask me anything about Rishi's background, skills, or projects!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdCounter = useRef(0);

  useEffect(() => {
    if (chatOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatOpen, messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    msgIdCounter.current++;
    const userMsg: Message = { id: `user-${msgIdCounter.current}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    msgIdCounter.current++;
    const aiMsgId = `ai-${msgIdCounter.current}`;
    setMessages((prev) => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

    let responseText = '';
    let sources: Source[] = [];

    try {
      const historyPayload = messages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) throw new Error('API Request Failed');
      const data = await res.json();
      responseText = data.answer;
      sources = data.sources || [];
    } catch (err) {
      console.warn('RAG backend offline or loading, fallback response:', err);
      responseText = getLocalFallback(text);
    }

    let accumulated = '';
    await simulateStream(responseText, (chunk) => {
      accumulated += chunk;
      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, content: accumulated, sources } : m))
      );
    });

    setIsStreaming(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--cyan, #00f0ff)', display: 'block', marginTop: i > 0 ? '0.4rem' : 0 }}>{line.replace(/\*\*/g, '')}</strong>;
      }
      if (line.includes('**')) {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              part.startsWith('**') ? <strong key={j} style={{ color: '#ffffff' }}>{part.replace(/\*\*/g, '')}</strong> : part
            )}
          </span>
        );
      }
      return <span key={i}>{line}{'\n'}</span>;
    });
  };

  return (
    <div className={styles.container}>
      {/* Floating Chat Modal */}
      {chatOpen && (
        <div className={styles.modal} id="ai-chat-modal">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.avatar}>AI</div>
              <div>
                <div className={styles.headerTitle}>Rishi AI Assistant</div>
                <div className={styles.headerSub}>
                  <span className="status-dot green" style={{ width: 6, height: 6 }} /> RAG Knowledge Base
                </div>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={toggleChat}
              aria-label="Close AI Chat"
              id="ai-chat-close"
            >
              ✕
            </button>
          </div>

          {/* Messages Log */}
          <div className={styles.messages} id="ai-chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : styles.messageRowAI}`}
              >
                {msg.role === 'assistant' && <div className={styles.msgAvatar}>AI</div>}
                <div
                  className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}
                >
                  {formatMessageText(msg.content)}
                  {isStreaming && msg.id === messages[messages.length - 1].id && msg.role === 'assistant' && (
                    <span className={styles.cursor}>▋</span>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className={styles.sourcesList}>
                      {msg.sources.map((src, idx) => (
                        <span key={idx} className={styles.sourceBadge}>
                          📄 {src.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className={styles.quickPrompts}>
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                className={styles.promptChip}
                onClick={() => handleSendMessage(q)}
                disabled={isStreaming}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className={styles.footer}>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <input
                id="ai-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Rishi AI..."
                className={styles.input}
                disabled={isStreaming}
                maxLength={400}
                aria-label="Ask AI Assistant"
              />
              <button
                type="submit"
                id="ai-chat-send"
                className={styles.sendBtn}
                disabled={isStreaming || !input.trim()}
                aria-label="Send"
              >
                {isStreaming ? '...' : '➔'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        id="ai-chat-bubble-toggle"
        className={styles.triggerBtn}
        onClick={toggleChat}
        aria-label={chatOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        title="Chat with Rishi AI Assistant"
      >
        <div className={styles.iconWrapper}>
          <span>🤖</span>
          {hasUnread && !chatOpen && <span className={styles.badgeDot} />}
        </div>
        <span className={styles.btnText}>Ask AI</span>
      </button>
    </div>
  );
}
