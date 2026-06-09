# MindCare AI

MindCare AI is a mental wellness companion app that combines a React frontend with a FastAPI backend. It provides supportive AI chat, mood tracking, journaling, face and voice emotion detection, and self-care guidance in a single web experience.

## Features

- AI-powered empathetic chat
- Mood tracker with history visualization
- Personal journal logging
- Face emotion detection
- Voice emotion detection
- Self-care guidance and wellness tools

## Run Locally

1. Start the backend:

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. Start the frontend:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open `http://127.0.0.1:5173` in your browser.

## About

This project is designed to help users track their emotional health and receive compassionate AI support in one easy-to-use application.