// Portfolio data — single source of truth for RISHI-01
export const PORTFOLIO_DATA = {
  name: 'Rishi Raj Jaiswal',
  title: 'AI/ML Engineer • Full-Stack Developer • Agentic AI Specialist',
  tagline: 'Building production-grade multi-agent architectures, GenAI systems, and full-stack platforms.',
  registrationNo: '20243237',
  education: {
    degree: 'Bachelor of Technology in Computer Science and Engineering',
    institution: 'Motilal Nehru National Institute of Technology (MNNIT) Allahabad',
    years: '2024 – Present',
    cpi: '8.62 (Till 4th Semester)',
    history: [
      {
        institution: 'Motilal Nehru National Institute of Technology, Allahabad',
        degree: 'Bachelor of Technology in Computer Science and Engineering',
        timeline: '2024 – Present',
        performance: 'CPI: 8.62 (Till 4th Semester)'
      },
      {
        institution: 'Deoria Senior Secondary School, Deoria, Uttar Pradesh',
        degree: 'Higher Secondary Education, CBSE',
        timeline: '2023',
        performance: 'Percentage: 93.8%'
      },
      {
        institution: 'Scholar’s Senior Secondary School, Deoria, Uttar Pradesh',
        degree: 'Secondary Education, CBSE',
        timeline: '2021',
        performance: 'Percentage: 89%'
      }
    ]
  },
  links: {
    github: 'https://github.com/Rishi-0904',
    linkedin: 'https://linkedin.com/in/rishi-raj-jaiswal',
    leetcode: 'https://leetcode.com/u/Rishi0904/',
    codeforces: 'https://codeforces.com/profile/Rishi0904',
    resume: '/resume.pdf',
    email: 'mailto:rishirajjaiswal2k28@gmail.com',
    phone: 'tel:+916392015764'
  },
  areas: [
    'Data Structures & Algorithms',
    'Web Development',
    'AI-ML',
    'Agentic AI',
    'Generative AI',
    'Full-Stack Development'
  ],
  skills: {
    languages: [
      { name: 'C++', level: 92 },
      { name: 'C', level: 85 },
      { name: 'SQL', level: 88 }
    ],
    frameworks: [
      { name: 'React.js', level: 90 },
      { name: 'Next.js', level: 88 },
      { name: 'FastAPI', level: 92 },
      { name: 'Express.js', level: 85 },
      { name: 'LangGraph', level: 92 },
      { name: 'LangChain', level: 90 },
      { name: 'Socket.io', level: 85 },
      { name: 'Scikit-Learn', level: 88 },
      { name: 'XGBoost', level: 82 },
      { name: 'Optuna', level: 80 },
      { name: 'TensorFlow', level: 82 },
      { name: 'FAISS', level: 85 }
    ],
    databases: [
      { name: 'Supabase (PostgreSQL)', level: 90 },
      { name: 'MongoDB', level: 85 },
      { name: 'Firebase', level: 80 }
    ],
    tools: [
      { name: 'Git', level: 90 },
      { name: 'GitHub Actions', level: 85 },
      { name: 'RabbitMQ', level: 85 },
      { name: 'Docker', level: 88 },
      { name: 'Redis', level: 80 },
      { name: 'MCP', level: 90 },
      { name: 'JWT', level: 85 }
    ]
  },
  projects: [
    {
      id: 'tutor-ai',
      name: 'TutorAI',
      tagline: 'Personalized Adaptive AI Tutoring System',
      status: 'completed',
      timeline: 'Mar 2026 - July 2026',
      description:
        'An adaptive AI tutoring platform designed for personalized JEE/NEET learning. Orchestrated an end-to-end Supervised Fine-Tuning (LoRA) and GRPO reinforcement learning loop on a 4B parameter model within a strict 15GB VRAM limit using Unsloth and 4-bit quantization.',
      bullets: [
        'Built TutorAI, an adaptive AI tutoring platform using React.js, FastAPI, LangGraph, Gemini, and Supabase for personalized JEE/NEET learning.',
        'Orchestrated an end-to-end Supervised Fine-Tuning (LoRA) and GRPO reinforcement learning loop on a 4B parameter model within a strict 15GB VRAM limit using Unsloth and 4-bit quantization.',
        'Designed a LangGraph-based multi-agent tutoring system with dynamic routing, parallel execution, feedback-driven self-correction, and MCP-powered educational tool orchestration.',
        'Developed a RAG pipeline over student PDFs with pgvector semantic search, OCR (Gemini Vision/Qwen2.5-VL), mastery tracking, and real-time learning analytics.'
      ],
      github: 'https://github.com/Rishi-0904',
      demo: '#',
      tech: [
        'React.js', 'FastAPI', 'LangGraph', 'Gemini', 'Supabase', 'Unsloth',
        'LoRA', 'GRPO', 'pgvector', 'OCR', 'Qwen2.5-VL', 'MCP', 'Docker'
      ],
      architecture: {
        nodes: [
          { id: 'user', label: 'User UI', desc: 'JEE/NEET students upload syllabus PDFs and ask doubts.' },
          { id: 'orchestrator', label: 'Orchestrator', desc: 'LangGraph state machine dynamically routes and coordinates educational sub-tasks.' },
          { id: 'research', label: 'RAG Retriever', desc: 'pgvector semantic search extracts exact textbook content and formulas.' },
          { id: 'visual', label: 'OCR Vision Agent', desc: 'Gemini Vision and Qwen2.5-VL parse diagrams, graphs, and complex equations.' },
          { id: 'tutor', label: 'Tutor Agent', desc: 'A 4B model fine-tuned using Unsloth + GRPO generates step-by-step personalized learning paths.' },
          { id: 'critic', label: 'Critic Agent', desc: 'Conducts feedback-driven self-correction to eliminate mathematical hallucinations.' },
          { id: 'answer', label: 'Student Dashboard', desc: 'Outputs verified interactive answers with mastery tracking and performance analytics.' }
        ],
        edges: [
          ['user', 'orchestrator'],
          ['orchestrator', 'research'],
          ['orchestrator', 'visual'],
          ['orchestrator', 'tutor'],
          ['research', 'critic'],
          ['visual', 'critic'],
          ['tutor', 'critic'],
          ['critic', 'answer']
        ]
      }
    },
    {
      id: 'ringmaster',
      name: "The Ringmaster's RoundTable",
      tagline: 'MCP-Powered Multi-Agent Travel Orchestrator',
      status: 'completed',
      timeline: 'Oct 2025 - June 2026',
      description:
        'A full-stack AI-driven travel planning platform using React.js, Node.js, Firebase, and external APIs. Developed a LangGraph-powered conversational assistant leveraging an MCP server (FastMCP, mcp-use) exposing 5+ travel tools.',
      bullets: [
        'Built a full-stack AI-driven travel planning platform using React.js, Node.js, Firebase, and external APIs (OpenWeather, OSM, Travelpayouts) to provide real-time weather, route, and flight/train recommendations.',
        'Developed a LangGraph-powered conversational assistant leveraging an MCP server (FastMCP, mcp-use) exposing 5+ travel tools for standardized AI tool calling and contextual trip planning.',
        'Developed a RabbitMQ-based orchestration layer for sequential and parallel agent execution, enabling scalable request queuing and real-time progress streaming via Socket.io.',
        'Containerized the backend with Docker and PM2, deploying a production-ready system on Render, CloudAMQP, and Vercel while optimizing for resource-constrained environments.'
      ],
      github: 'https://github.com/Rishi-0904',
      demo: '#',
      tech: [
        'React.js', 'Node.js', 'Firebase', 'FastMCP', 'mcp-use', 'LangGraph',
        'RabbitMQ', 'Socket.io', 'Docker', 'PM2', 'Render', 'CloudAMQP', 'Vercel'
      ],
      architecture: {
        nodes: [
          { id: 'user', label: 'User Interface', desc: 'React.js web interface allowing interactive real-time travel parameters.' },
          { id: 'orchestrator', label: 'LangGraph Orchestrator', desc: 'Coordinates the conversational state and manages travel agents.' },
          { id: 'rabbitmq', label: 'RabbitMQ Queue', desc: 'Handles request scheduling and coordinates sequential/parallel task routing.' },
          { id: 'travel', label: 'Travel Agent', desc: 'MCP-powered tool caller interacting with OSM and Travelpayouts APIs.' },
          { id: 'weather', label: 'Weather Agent', desc: 'Fetches real-time forecasts and weather alerts via OpenWeather API.' },
          { id: 'itinerary', label: 'Streaming Core', desc: 'Streams incremental trip calculations and final details to user via Socket.io.' }
        ],
        edges: [
          ['user', 'orchestrator'],
          ['orchestrator', 'rabbitmq'],
          ['rabbitmq', 'travel'],
          ['rabbitmq', 'weather'],
          ['travel', 'itinerary'],
          ['weather', 'itinerary']
        ]
      }
    },
    {
      id: 'autonomous-driving',
      name: 'Autonomous Driving Simulator',
      tagline: 'Self-Driving Vehicle Perception & Planning System',
      status: 'active',
      timeline: '2024 - Present',
      description:
        'An autonomous driving simulation system implementing full AV pipeline: multi-sensor fusion (Camera, LiDAR, GPS, IMU), real-time perception (object & lane detection), trajectory prediction, path planning with A*, and PID control.',
      bullets: [
        'Designed real-time perception module utilizing YOLOv8 for object classification and UNet for semantic lane segmentation.',
        'Integrated sensor data (LiDAR point clouds, Camera frames, GPS coordinates) to establish stable localization and environmental mapping.',
        'Coded A* and Dijkstra pathfinding models to plan dynamically safe trajectories avoiding obstacles.',
        'Implemented PID controllers to translates predicted paths to steering, throttle, and brake actuators.'
      ],
      github: 'https://github.com/Rishi-0904',
      demo: '#',
      tech: [
        'Computer Vision', 'Sensor Fusion', 'PyTorch', 'YOLOv8',
        'A* Algorithm', 'PID Control', 'Python', 'OpenCV'
      ],
      pipeline: [
        { id: 'camera', label: 'Camera Input', icon: '📷', desc: 'High-resolution RGB input for visual scene understanding.' },
        { id: 'lidar', label: 'LiDAR Mapping', icon: '🔴', desc: '3D point cloud data for precise depth and obstacle mapping.' },
        { id: 'gps', label: 'GPS / IMU Localization', icon: '🛰', desc: 'Global positioning and inertial tracking for vehicle state estimation.' },
        { id: 'perception', label: 'Perception Layer', icon: '👁', desc: 'Object detection (YOLOv8), lane detection, semantic segmentation, sensor fusion.' },
        { id: 'prediction', label: 'Prediction Engine', icon: '🔮', desc: 'Predicts future movements of other vehicles and pedestrians.' },
        { id: 'planning', label: 'Path Planning', icon: '🗺', desc: 'A* path planning with obstacle avoidance and route optimization.' },
        { id: 'control', label: 'Actuator Control', icon: '🎮', desc: 'PID controller translates plan to steering, throttle, and brake commands.' }
      ]
    }
  ],
  achievements: [
    {
      id: 'fitfusion',
      title: 'FitFusion — 1st Runner-Up',
      event: 'Cognizance, IIT Roorkee',
      year: 'Mar 2026',
      desc: 'Secured 2nd position among participants at IIT Roorkee\'s annual technical fest Cognizance. Built an AI-powered fitness platform with computer vision form correction.',
      icon: '🏆',
      color: 'var(--amber)'
    },
    {
      id: 'hack36',
      title: 'Hack36 — Top 25 Finalist',
      event: 'MNNIT Allahabad National Hackathon',
      year: 'Nov 2025',
      desc: 'Selected among top 25 teams out of 300+ teams. Built Cerberus, an AI-driven web attack defense system.',
      icon: '🥈',
      color: 'var(--cyan)'
    },
    {
      id: 'softathalon',
      title: 'Softathalon Finalist',
      event: 'Avishkar, MNNIT Allahabad',
      year: '2025',
      desc: 'Finalist among 400+ students in the college\'s flagship technical programming event, solving complex algorithmic problems.',
      icon: '⚡',
      color: 'var(--purple)'
    },
    {
      id: 'webster',
      title: 'Webster 2025 — Top Teams',
      event: 'Webster MNNIT Contest',
      year: '2025',
      desc: 'Team "Vanguard" developed The Ringmaster\'s RoundTable and ranked among the top teams in the Webster web development hackathon.',
      icon: '🕸️',
      color: 'var(--teal)'
    },
    {
      id: 'leetcode',
      title: 'LeetCode Knight (Rating: 1967)',
      event: 'Algorithm Contest Platform',
      year: 'Biweekly Contest 174',
      desc: 'Achieved Knight rank (Rating: 1967) with Best Rank: 1190 in Biweekly Contest 174. Solved 500+ algorithmic problems.',
      icon: '⚔️',
      color: 'var(--amber)'
    },
    {
      id: 'codeforces',
      title: 'Codeforces Pupil (Rating: 1252)',
      event: 'Competitive Programming',
      year: 'Codeforces Round 1049 (Div 2)',
      desc: 'Achieved Pupil rank (Rating: 1252) with Best Rank: 4395 in Codeforces Round 1049 (Div 2).',
      icon: '🔵',
      color: 'var(--blue)'
    }
  ]
} as const;

export type Project = typeof PORTFOLIO_DATA.projects[number];
export type Achievement = typeof PORTFOLIO_DATA.achievements[number];
export type Skill = { name: string; level: number };
