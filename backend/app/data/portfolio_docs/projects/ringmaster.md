# The Ringmaster’s RoundTable — MCP-Powered Multi-Agent Travel Orchestrator

## Project Overview
The Ringmaster’s RoundTable is a full-stack, AI-driven travel planning and orchestration platform. It uses a LangGraph-powered conversational assistant to coordinate specialized travel planning agents via a message queuing architecture.

## Timeline
**Oct 2025 - June 2026**

## Key Contributions & Achievements
- **Collaborative Recommendation Engine**: Built a full-stack AI-driven travel planning platform using React.js, Node.js, Firebase, and external APIs (OpenWeather, OSM, Travelpayouts) to provide real-time weather, route, and flight/train recommendations.
- **MCP Conversational Assistant**: Developed a LangGraph-powered conversational assistant leveraging an Model Context Protocol (MCP) server (FastMCP, mcp-use) exposing 5+ travel tools for standardized AI tool calling and contextual trip planning.
- **RabbitMQ Message Broker**: Developed a RabbitMQ-based orchestration layer for sequential and parallel agent execution, enabling scalable request queuing and real-time progress streaming via Socket.io.
- **Docker Containerization**: Containerized the backend with Docker and PM2, deploying a production-ready system on Render, CloudAMQP, and Vercel while optimizing for resource-constrained environments.

## Technology Stack
- **AI & Agents**: LangGraph, FastMCP, mcp-use, Gemini API
- **Message Broker**: RabbitMQ (CloudAMQP)
- **Real-Time Streaming**: Socket.io, WebSockets
- **Backend Services**: Node.js, Express.js, PM2, Docker
- **Frontend**: React.js, TypeScript
- **Database & Auth**: Firebase
- **External APIs**: OpenWeather API, OpenStreetMap (OSM), Travelpayouts

## Key Challenges Solved
1. **Tool Calling Standardization**: Leveraged MCP (Model Context Protocol) to expose unified tools for mapping and flight calculations, abstracting API complexities.
2. **Concurrency & Scaling**: Used RabbitMQ exchange queues to process travel calculations concurrently, preventing system bottlenecks.
3. **Optimized Deployment**: Reduced memory footprint using PM2 and Docker to host the services efficiently on Render's free tier.
