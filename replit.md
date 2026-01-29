# AIyuv - AI-Powered Ayurvedic Diagnostic Tool

## Overview
AIyuv is a fullstack web application that combines ancient Ayurvedic wisdom with modern technology to help users understand their unique body constitution (Dosha) and receive personalized health recommendations.

## Features
- **Dosha Assessment Quiz**: 10-question comprehensive quiz to determine user's primary dosha (Vata, Pitta, or Kapha)
- **Personalized Results**: Detailed analysis of dosha balance with recommendations for diet, lifestyle, exercise, and herbs
- **Symptom Checker**: AI-powered symptom analysis to identify dosha imbalances and provide targeted Ayurvedic remedies
- **Dark/Light Mode**: Full theme support with Ayurvedic-inspired earthy color palette

## Tech Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Validation**: Zod schemas for type-safe API validation

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (home, quiz, results, symptoms)
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
- Earthy, calming color palette inspired by Ayurvedic traditions
- Primary: Green tones (representing nature and healing)
- Accent: Warm amber/orange (representing vitality)
- Dosha colors: Blue (Vata), Red (Pitta), Green (Kapha)

## Running the Application
The application runs via the "Start application" workflow which executes `npm run dev`.
Frontend and backend are served on port 5000.

## Recent Changes
- Initial implementation with complete MVP features
- Moved shared data to `shared/` directory for proper separation
- Added Zod validation to all API endpoints
- Fixed hover interactions to comply with UI guidelines
