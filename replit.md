# AIyuv - AI-Powered Ayurvedic Diagnostic Tool

## Overview
AIyuv is a fullstack web application that combines ancient Ayurvedic wisdom with modern technology to help users understand their unique body constitution (Dosha) and receive personalized health recommendations.

## Features
- **Wellness Dashboard**: Personalized dashboard with wellness score, dosha balance, and daily plan
- **Daily Preventive Care**: Personalized daily preventive health tips based on Prakriti and wellness score
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
│   │   │   ├── daily-preventive-care.tsx # Daily preventive tips
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
│   ├── quiz-data.ts        # Quiz questions, symptoms, dosha descriptions
│   └── preventive-tips.ts  # Preventive healthcare tips database
```

## API Endpoints
- `POST /api/quiz/submit` - Submit quiz answers, returns DoshaResult
- `POST /api/symptoms/analyze` - Analyze symptoms, returns SymptomAnalysis with remedies
- `POST /api/preventive-care/daily` - Get daily preventive tips based on dosha and wellness score

## Daily Preventive Care Feature
Provides personalized daily preventive health suggestions based on:
- **Prakriti (Dosha Type)**: Vata, Pitta, or Kapha
- **Wellness Score Range**: Low (<50), Medium (50-74), High (75+)

### Tip Categories
1. Lifestyle - Daily routines and habits
2. Food & Diet - Nutrition recommendations
3. Hydration - Drinking habits and beverages
4. Sleep - Rest and recovery practices
5. Activity - Exercise and movement
6. Mental Wellness - Mindfulness and emotional health

### Features
- Notification-style header with personalized greeting
- Focus area based on dosha and wellness score
- Progress tracking with completion checkboxes
- Streak tracking foundation (stored in localStorage)
- Expandable tip cards showing benefits and prevention info

## Design System
- **Primary**: Warm terracotta (representing earth and warmth)
- **Accent**: Orange (representing vitality)
- **Dosha Colors**: Blue (Vata), Red (Pitta), Green (Kapha)
- **Typography**: Plus Jakarta Sans, Playfair Display (serif headings)

## User Flow
1. **New Users**: See landing page with hero section and three doshas overview
2. **Take Quiz**: Complete 10-question dosha assessment
3. **View Results**: See primary dosha, balance chart, and recommendations
4. **Dashboard**: After quiz, homepage shows personalized wellness dashboard with daily preventive tips
5. **Symptom Check**: Analyze symptoms for targeted remedies

## Future Expansion
The preventive care feature is designed for easy expansion:
- Weekly insights and summaries
- Streak tracking with rewards
- Progress history and analytics
- Push notifications for daily reminders

## Running the Application
The application runs via the "Start application" workflow which executes `npm run dev`.
Frontend and backend are served on port 5000.

## Recent Changes
- Added Daily Preventive Care feature with personalized tips
- Created comprehensive preventive tip database (50+ tips)
- Implemented completion tracking with localStorage
- Added streak tracking foundation for future gamification
- Tips personalized by dosha type and wellness score range
