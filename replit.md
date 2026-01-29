# AIyuv - AI-Powered Ayurvedic Diagnostic Tool

## Overview
AIyuv is a fullstack web application that combines ancient Ayurvedic wisdom with modern technology to help users understand their unique body constitution (Dosha) and receive personalized health recommendations.

## Features
- **Wellness Dashboard**: Personalized dashboard with wellness score, dosha balance, and daily plan
- **Dosha Assessment Quiz**: 10-question comprehensive quiz to determine user's primary dosha (Vata, Pitta, or Kapha)
- **Personalized Results**: Detailed analysis of dosha balance with recommendations for diet, lifestyle, exercise, and herbs
- **Symptom Checker**: AI-powered symptom analysis to identify dosha imbalances and provide targeted Ayurvedic remedies
- **Dark/Light Mode**: Full theme support with warm terracotta-inspired color palette
- **Mobile-First Design**: Bottom navigation bar and responsive layout

## Tech Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Validation**: Zod schemas for type-safe API validation

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── bottom-nav.tsx      # Mobile bottom navigation
│   │   │   ├── wellness-score.tsx  # Wellness score ring
│   │   │   ├── dosha-balance.tsx   # Dosha progress bars
│   │   │   ├── quick-actions.tsx   # Quick action buttons
│   │   │   ├── personalized-plan.tsx # Daily plan items
│   │   │   └── theme-toggle.tsx    # Dark/light mode toggle
│   │   ├── pages/          # Page components
│   │   │   ├── home.tsx    # Landing page + Dashboard
│   │   │   ├── quiz.tsx    # Dosha quiz
│   │   │   ├── results.tsx # Quiz results
│   │   │   └── symptoms.tsx # Symptom checker
│   │   ├── lib/            # Utilities and data re-exports
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API route handlers
│   └── storage.ts          # Storage interface
├── shared/                 # Shared code between frontend and backend
│   ├── schema.ts           # Zod schemas and TypeScript types
│   └── quiz-data.ts        # Quiz questions, symptoms, dosha descriptions
```

## API Endpoints
- `POST /api/quiz/submit` - Submit quiz answers, returns DoshaResult
- `POST /api/symptoms/analyze` - Analyze symptoms, returns SymptomAnalysis with remedies

## Design System
- **Primary**: Warm terracotta (representing earth and warmth)
- **Accent**: Orange (representing vitality)
- **Dosha Colors**: Blue (Vata), Red (Pitta), Green (Kapha)
- **Typography**: Plus Jakarta Sans, Playfair Display (serif headings)

## User Flow
1. **New Users**: See landing page with hero section and three doshas overview
2. **Take Quiz**: Complete 10-question dosha assessment
3. **View Results**: See primary dosha, balance chart, and recommendations
4. **Dashboard**: After quiz, homepage shows personalized wellness dashboard
5. **Symptom Check**: Analyze symptoms for targeted remedies

## Running the Application
The application runs via the "Start application" workflow which executes `npm run dev`.
Frontend and backend are served on port 5000.

## Recent Changes
- Redesigned UI with warm terracotta color scheme matching mockups
- Added wellness dashboard with score, quick actions, and personalized plan
- Implemented mobile bottom navigation bar
- Added smooth transitions and micro-interactions
- Enhanced dosha balance visualization with progress bars
- All pages now responsive with mobile-first approach
