# Universal Trip Planner

AI-assisted India trip planner with live currency conversion, state → city selection, and curated itineraries served by an Express API.

## Features
- State-first search: choose a state, then a starting city scoped to that state to avoid cross-region results.
- Smart itinerary scoring: Express backend filters/scores by city, days, budget, and interests, returning the best matches.
- Live currency rates: frontend pulls `/api/rates` (cached 6h with fallback) so all prices and the converter reflect current FX.
- Rich UI: React + Vite frontend with itinerary cards, details modal, favorites, and a currency converter widget.
- Data-backed: 25+ itineraries across India with distances/times per supported city in `backend/data/itineraries.json`.

## Tech Stack
- Frontend: React 18 + TypeScript + Vite
- Backend: Express + TypeScript
- Tooling: tsx for dev, tsc for builds

## Getting Started
Prerequisites: Node.js 18+

Install dependencies (one-time):
- Backend: `npm install` inside `backend`
- Frontend: `npm install` inside `frontend`

Run in dev mode (two terminals):
1) Backend: `npm run dev` inside `backend` (serves on port 4000)
2) Frontend: `npm run dev` inside `frontend` (serves on port 5173)

Build:
- Backend: `npm run build` inside `backend`
- Frontend: `npm run build` inside `frontend`

## API
- `GET /api/itineraries?city=Jaipur&days=3&budgetAmount=15000&interests=heritage,food`
	- Filters/scores itineraries; returns up to 12 best matches.
- `GET /api/rates`
	- Returns live INR-based FX rates with cache/fallback metadata.

## Frontend Behavior
- State + City: city suggestions are limited to the selected state; submit is blocked if city/state mismatch.
- Currency: all displayed costs use the current user currency and live rates; converter shows correct “1 USD = ₹xx.xx”.

## Data
- Source file: `backend/data/itineraries.json`
- Each itinerary lists supported starting cities plus distance/time from each to keep results location-accurate.

## Notes
- Currency rates come from a public INR-base endpoint and are cached for 6 hours; fallback rates are bundled for offline resilience.