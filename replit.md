# AIyuv - AI-Powered Preventive Ayurvedic Health Platform

## Overview
AIyuv is a fullstack web application that combines ancient Ayurvedic wisdom with modern AI to provide early health insights and preventive guidance. The platform follows a safety-first, doctor-in-the-loop design with no auto-prescription.

## Core Features
- **Self Health Check**: Complete health assessment with context collection, symptom input, and AI-powered diagnosis
- **Wellness Dashboard**: Personalized dashboard with wellness score, dosha balance, and daily plan
- **Daily Preventive Care**: Personalized daily preventive health tips based on Prakriti and wellness score
- **Dosha Assessment Quiz**: 10-question comprehensive quiz to determine user's primary dosha
- **Symptom Checker**: AI-powered symptom analysis to identify dosha imbalances
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
│   │   │   ├── health-check.tsx    # Health check flow (context + symptoms)
│   │   │   ├── health-check-results.tsx # Diagnosis results
│   │   │   ├── quiz.tsx    # Dosha quiz
│   │   │   ├── results.tsx # Quiz results
│   │   │   └── symptoms.tsx # Symptom checker
│   │   ├── lib/            # Utilities and data re-exports
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API route handlers (including diagnosis engine)
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
- `POST /api/health-check/create` - Create health check case with diagnosis and guidance

## Health Check Flow
The main preventive health assessment flow:

### 1. User Context Collection (7 steps)
- Age range: 18-25, 26-35, 36-45, 46-55, 56-65, 65+
- Gender: male, female, other, prefer_not_to_say (optional)
- City tier: tier1, tier2, tier3, rural
- Sleep quality: poor, fair, good, excellent
- Stress level: low, moderate, high, very_high
- Activity level: sedentary, light, moderate, active
- Primary goal: prevention, current_discomfort, long_term_wellness

### 2. Symptom Input
- Grouped checklist of 22 symptoms (Vata, Pitta, Kapha)
- Free-text input for additional details

### 3. Dual Diagnosis Engine
**Ayurvedic Intelligence (Rule-Based):**
- Dosha imbalance detection
- Prakriti vs Vikriti mapping
- Pattern consistency checks

**Medical Intelligence (AI Stub):**
- Symptom clustering
- Confidence scoring
- Red-flag detection
- Risk stratification: Low → Medium → High

### 4. Diagnostic Confirmation Gate
Triggered when:
- Symptoms match multiple conditions
- AI confidence is low (<60%)
- Current discomfort is primary goal

Required advanced inputs:
- Skin issues → Skin image upload
- Digestive issues → Tongue image
- Systemic/unclear → Doctor consultation

### 5. Output
- Health snapshot with Prakriti/Vikriti
- Dosha balance visualization
- Preventive guidance (habits, food, sleep, stress tips)
- Next steps options:
  - Lifestyle & Prevention (default)
  - Get Medicines (disabled if advanced inputs needed)
  - Consult Practitioner

## Safety Design Principles
1. **No Auto-Prescription**: Medicine recommendations require doctor verification
2. **Conditional Advanced Inputs**: Low confidence triggers additional requirements
3. **Clear Disclaimers**: "This is not a medical diagnosis" displayed prominently
4. **Gated Medicine Access**: Disabled when required inputs are missing
5. **Red Flag Detection**: Alerts for symptoms requiring professional attention

## Design System
- **Primary**: Warm terracotta (representing earth and warmth)
- **Accent**: Orange (representing vitality)
- **Dosha Colors**: Blue (Vata), Red (Pitta), Green (Kapha)
- **Typography**: Plus Jakarta Sans, Playfair Display (serif headings)

## User Flow
1. **Landing Page**: New CTAs - Self Health Check, Learn Body Type, Consult Practitioner
2. **Health Check**: 7-step context → Symptom selection → Get Analysis
3. **Results**: Health snapshot → Preventive guidance → Next steps
4. **Dashboard**: After assessment, personalized wellness dashboard

## Future Expansion
- Doctor confirmation flow for medicine prescriptions
- Medicine fulfillment after doctor approval
- Feedback loop for continuous improvement
- Admin/founder dashboard with metrics
- Image upload for advanced inputs (skin, tongue, face)
- Push notifications for daily reminders

## Running the Application
The application runs via the "Start application" workflow which executes `npm run dev`.
Frontend and backend are served on port 5000.

## Recent Changes
- Implemented complete Self Health Check flow with 7-step context collection
- Added dual diagnosis engine with Ayurvedic rules + AI stub
- Created diagnostic confirmation gate for safety
- Built results page with health snapshot and preventive guidance
- Updated landing page with new CTAs matching specification
- Added Daily Preventive Care feature with 50+ personalized tips
