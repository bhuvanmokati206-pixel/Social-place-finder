# Social Places Finder

## Overview
A location-based social restaurant and places discovery app. Users enter their name and email on the login page, then discover fun activities and places nearby based on who they're with (friends, family, partner, solo).

## Features
- **Login Page**: Users enter name and email (stored in browser localStorage)
- **Context-Based Discovery**: Find places based on who you're with (Friends, Family, Partner, Solo)
- **Filtering Options**: Filter by budget, distance, and mood/vibe
- **List & Map Views**: View nearby places in list format (map view coming soon)
- **Place Details**: View place information, public reviews, and add private notes
- **Persistent Notes**: Save personal notes about places (per user)

## Project Structure
- `src/` - Backend Express server
  - `server.js` - Main server entry point (runs on 0.0.0.0:5000)
  - `routes/places.js` - Places API routes
- `frontend/` - Static frontend files
  - `index.html` - Main landing page with login modal
  - `results.html` - Search results page
  - `place.html` - Place details page
  - `app.js` - Frontend JavaScript with login logic and API integration
  - `styles.css` - Styling (including login modal styles)

## Tech Stack
- **Backend**: Node.js with Express
- **Frontend**: Vanilla HTML/CSS/JavaScript (mobile-first design)
- **Storage**: Browser localStorage for user session data
- **API**: RESTful API at `/api/places`

## Running the App
```bash
npm start
```
The app will be available at `http://0.0.0.0:5000` with cache control headers to ensure fresh content in Replit environment.

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/places/nearby` - Get nearby places with filters (lat, lng, context, budget, distanceKm, mood)
- `GET /api/places/:id` - Get place details
- `GET /api/places/:id/reviews` - Get place reviews
- `GET /api/places/:id/notes` - Get user notes (requires x-user-id header)
- `POST /api/places/:id/notes` - Save user notes (requires x-user-id header)

## Recent Changes (Dec 28, 2025)
- Added login page with name and email fields
- Login data stored in browser localStorage
- Login modal hidden after successful login on subsequent visits
- Added cache control headers to prevent stale content
- Configured server to bind to 0.0.0.0 for Replit compatibility
