# AIyuv - AI-Powered Preventive Ayurvedic Health Platform

## Overview
AIyuv is a fullstack web application that combines ancient Ayurvedic wisdom with modern AI to provide early health insights and preventive guidance. The platform follows a safety-first, doctor-in-the-loop design with no auto-prescription.

## Core Product Goal
Provide early health insights using:
- User context collection
- Symptom inputs
- Ayurvedic logic (dosha analysis)
- AI-assisted medical screening

Safety constraints:
- No auto-prescription
- Doctor confirmation for medicines
- Conditional advanced input requirements

## High-Level User Flow
User → Context Collection → Symptom Input → Confirmation Gate →
(If needed) Required Advanced Input →
AI + Ayurveda Analysis →
Preventive Guidance →
Optional Doctor Verification →
Feedback Loop

## Tech Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Storage**: In-memory (MemStorage)
- **Validation**: Zod schemas for type-safe API validation

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── theme-toggle.tsx    # Dark/light mode toggle
│   │   │   └── ui/                 # Shadcn UI components
│   │   ├── pages/          # Page components
│   │   │   ├── home.tsx            # Landing page (Section 1)
│   │   │   ├── health-check.tsx    # Context + Symptoms (Sections 2-3)
│   │   │   ├── health-check-results.tsx # Results + Next Steps (Sections 7-8)
│   │   │   ├── body-type.tsx       # Dosha education
│   │   │   ├── admin.tsx           # Admin dashboard (Section 12)
│   │   │   └── not-found.tsx       # 404 page
│   │   ├── lib/            # Utilities
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API route handlers
│   │   - Dual Diagnosis Engine (Section 5)
│   │   - Confirmation Gate (Section 4)
│   │   - Feedback Loop (Section 11)
│   │   - Admin Stats (Section 12)
│   └── storage.ts          # In-memory storage interface
├── shared/                 # Shared code between frontend and backend
│   ├── schema.ts           # Zod schemas and TypeScript types
│   ├── symptoms-data.ts    # Symptom database
│   └── guidance-data.ts    # Preventive guidance per dosha
```

## API Endpoints

### Health Check Flow
- `POST /api/case/create` - Create case with user context (Section 2)
- `POST /api/case/:caseId/symptoms` - Submit symptoms, run diagnosis (Sections 3-5)
- `POST /api/case/:caseId/advanced-inputs` - Submit advanced inputs (Section 4)
- `GET /api/case/:caseId` - Get case details
- `POST /api/case/:caseId/feedback` - Submit feedback (Section 11)

### Other
- `GET /api/symptoms` - Get symptom list
- `GET /api/admin/stats` - Admin dashboard stats (Section 12)

## Key Features by Spec Section

### Section 1: Landing Page
- Headline: "Understand your health early — prevent before it becomes disease."
- 3 CTAs: Self Health Check, Learn Body Type, Consult Practitioner (coming soon)
- No login required

### Section 2: User Context Collection
- Age range, Gender (optional), City tier
- Lifestyle: Sleep quality, Stress level, Activity level
- Primary goal: Prevention, Current discomfort, Long-term wellness

### Section 3: Symptom Input Layer
- Checklist of 24 symptoms grouped by category
- Free-text additional input
- Symptoms mapped to doshas (Vata/Pitta/Kapha)

### Section 4: Diagnostic Confirmation Gate (CRITICAL)
Triggers when:
- Symptoms match multiple conditions
- AI confidence < 60%
- Overlapping illness patterns
- Current discomfort is primary goal

Required advanced inputs by symptom category:
- Skin issues → Skin image upload
- Digestive/metabolic → Tongue image
- Systemic/unclear → Doctor consultation

If triggered and inputs not provided:
- Diagnosis NOT finalized
- Medicines DISABLED
- Only lifestyle guidance shown

### Section 5: Dual Diagnosis Engine

**A. Ayurvedic Intelligence (Rule-Based)**
- Prakriti vs Vikriti mapping
- Dosha imbalance detection
- Pattern consistency checks

**B. Medical Intelligence (AI Stub)**
- Symptom clustering
- Confidence scoring (0-100)
- Red-flag detection
- Risk stratification: Low → Medium → High

### Section 7: Output to User
1. Health Snapshot - Plain language summary, dosha visualization
2. Preventive Guidance - Habits, food preferences (NOT prescriptions), sleep & stress tips
3. Medical Awareness - Escalation advice, warning signs

Always shows disclaimer: "This is not a medical diagnosis."

### Section 8: Next Steps Options
A. Lifestyle & Prevention Only (always enabled)
B. Get Medicines - DISABLED if advanced inputs not provided
C. Consult Doctor First

### Section 11: Feedback Loop
- Was this helpful? (Yes/No)
- Stores feedback for improvement

### Section 12: Admin Dashboard
- User count
- Dosha patterns distribution
- Common symptoms
- Drop-off points analysis
- Advanced input triggers count
- Safety flags count

## Safety Design Principles
1. **No Auto-Prescription**: Medicine recommendations require doctor verification
2. **Conditional Advanced Inputs**: Low confidence triggers additional requirements
3. **Clear Disclaimers**: "This is not a medical diagnosis" shown prominently
4. **Gated Medicine Access**: Disabled when required inputs are missing
5. **Red Flag Detection**: Alerts for symptoms requiring professional attention

## Running the Application
The application runs via the "Start application" workflow which executes `npm run dev`.
Frontend and backend are served on port 5000.

## Rebuild Notes (Feb 2026)
- Completely rebuilt from specification file
- Clean modular architecture with clear separation of concerns
- All spec sections implemented with stubs for future AI models
- Safety-first design with confirmation gate
- In-memory storage (ready for database migration)

## UI/UX Design System (Updated Feb 2026)
- **Theme**: Modern whiteish-green Ayurvedic aesthetic
- **Color Palette**:
  - Background: #FBFDF9 (near-white with green tint)
  - Cards/Panels: #F1F8F0 (soft green)
  - Accent surfaces: #D9EFE0 (mid green)
  - Primary brand: #2E8B5A (main green CTA)
  - Headlines: #114D33 (deep green)
  - Muted text: #3E5A4C (secondary text)
- **Typography**: Serif for headlines (hierarchy), sans-serif for body text
- **Design Principles**: Clear visual hierarchy, consistent spacing, sufficient contrast, responsive layouts
