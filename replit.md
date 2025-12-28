# Social Places Backend

## Overview
A location-based social restaurant and places discovery app. Users can find fun activities and places nearby based on who they're with (friends, family, partner, solo).

## Project Structure
- `src/` - Backend Express server
  - `server.js` - Main server entry point
  - `routes/places.js` - Places API routes
- `frontend/` - Static frontend files
  - `index.html` - Main landing page
  - `results.html` - Search results page
  - `place.html` - Place details page
  - `app.js` - Frontend JavaScript
  - `styles.css` - Styling

## Tech Stack
- **Backend**: Node.js with Express
- **Frontend**: Vanilla HTML/CSS/JavaScript (mobile-first design)
- **API**: RESTful API at `/api/places`

## Running the App
The server runs on port 5000, bound to 0.0.0.0 for Replit compatibility.

```bash
npm start
```

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/places/nearby` - Get nearby places with filters
- `GET /api/places/:id` - Get place details
- `GET /api/places/:id/reviews` - Get place reviews
- `GET /api/places/:id/notes` - Get user notes
- `POST /api/places/:id/notes` - Save user notes
