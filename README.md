# MindCare AI

MindCare AI is a mental wellness companion application built to help users understand their emotions, preserve their mental health records, and access supportive guidance anytime.

The app integrates a modern React frontend with a Python FastAPI backend, delivering a responsive web experience for conversation, journaling, mood tracking, and emotion detection.

## Features

- AI-powered empathetic chat to provide calming, supportive responses
- Mood tracker with daily entry logging and historical trends
- Personal journal entry creation and review
- Face emotion detection using the webcam
- Voice emotion analysis through microphone input
- Self-care guidance, habits, and wellness recommendations

## Technology Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, Uvicorn
- AI: Transformer-based conversational model
- Data: Local JSON-backed storage for journals and mood entries
- Deployment: Docker Compose support for local development

## Why This Project

MindCare AI is designed for users who want a simple, privacy-conscious self-care tool that combines:

- instant AI companionship,
- structured mood journaling,
- visual emotion detection,
- voice-based emotional awareness,
- and a calm dashboard for monitoring mental wellness over time.

It is intended as a learning and wellness prototype, not a replacement for professional care.

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

## Notes

- The backend uses a local data store for persistence.
- The AI companion is built for supportive conversation and mood awareness.
- You can extend this project with authentication, data encryption, or cloud hosting.
