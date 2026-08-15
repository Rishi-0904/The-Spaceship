# TutorAI — Personalized Adaptive AI Tutoring System

## Project Overview
TutorAI is an adaptive AI tutoring platform designed to provide personalized learning experiences for JEE/NEET students. It leverages a LangGraph-based multi-agent architecture, RAG (Retrieval-Augmented Generation) for precise curriculum knowledge retrieval, and fine-tuned models to adapt dynamically to student needs.

## Timeline
**Mar 2026 - July 2026**

## Key Contributions & Achievements
- **Personalized JEE/NEET Learning**: Built TutorAI as an adaptive AI tutoring platform using React.js, FastAPI, LangGraph, Gemini, and Supabase.
- **Quantized SFT & RL Loop**: Orchestrated an end-to-end Supervised Fine-Tuning (SFT) using LoRA and GRPO reinforcement learning loop on a 4B parameter model within a strict 15GB VRAM limit using Unsloth and 4-bit quantization.
- **LangGraph Multi-Agent Architecture**: Designed a LangGraph-based multi-agent tutoring system with dynamic routing, parallel execution, feedback-driven self-correction, and Model Context Protocol (MCP) powered educational tool orchestration.
- **RAG & Learning Analytics**: Developed a RAG pipeline over student PDFs with pgvector semantic search, OCR (Gemini Vision/Qwen2.5-VL), mastery tracking, and real-time learning analytics.

## Technology Stack
- **AI & Orchestration**: LangGraph, LangChain, Unsloth, LoRA, GRPO (reinforcement learning), Gemini Vision, Qwen2.5-VL
- **Vector Search**: pgvector (PostgreSQL), text embeddings
- **Backend API**: FastAPI (Python), async connections
- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Database & Services**: Supabase (PostgreSQL), Docker containerization

## Key Challenges Solved
1. **Resource Constraints**: Orchestrated a 4B model fine-tuning loop under 15GB VRAM by leveraging Unsloth and 4-bit quantization.
2. **Mathematical Hallucinations**: Implemented a LangGraph Critic Agent that performs feedback-driven self-correction to verify calculations before rendering final answers.
3. **Complex Diagram Parsing**: Used vision-capable models (Qwen2.5-VL, Gemini Vision) to parse graphs, geometric diagrams, and mathematical symbols in students' uploaded syllabus PDFs.
