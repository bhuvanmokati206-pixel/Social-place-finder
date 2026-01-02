const express = require('express');

const router = express.Router();

// In-memory mock data for now; replace with a real database or external API.
// For now we keep a rich set of mock places covering each context.

const testPlaces = [
  {
    "id": "hyd_f_01",
    "name": "Prost Brew Pub",
    "type": "Brew Pub",
    "rating": 4.5,
    "costRange": "$$$",
    "distanceKm": 1.2,
    "tags": ["friends", "lively", "craft beer"],
    "isOpen": true,
    "context": "friends",
    "category": "restaurant",
    "budget_for_two": 1800,
    "has_reels": true
  },
  {
    "id": "hyd_f_02",
    "name": "Broadway – The Brewery",
    "type": "Brewery",
    "rating": 4.6,
    "costRange": "$$$",
    "distanceKm": 2.5,
    "tags": ["friends", "spacious", "brewery"],
    "isOpen": true,
    "context": "friends",
    "category": "restaurant",
    "budget_for_two": 1700,
    "has_reels": true
  },
  {
    "id": "hyd_f_03",
    "name": "Over The Moon Brew Company",
    "type": "Brew Pub",
    "rating": 4.4,
    "costRange": "$$$",
    "distanceKm": 3.1,
    "tags": ["friends", "rooftop", "craft beer"],
    "isOpen": true,
    "context": "friends",
    "category": "restaurant",
    "budget_for_two": 1600,
    "has_reels": true
  },
  {
    "id": "hyd_f_04",
    "name": "36 Downtown Brew Pub",
    "type": "Brew Pub",
    "rating": 4.3,
    "costRange": "$$$",
    "distanceKm": 1.8,
    "tags": ["friends", "dance floor", "brewpub"],
    "isOpen": true,
    "context": "friends",
    "category": "restaurant",
    "budget_for_two": 1500,
    "has_reels": true
  },
  {
    "id": "hyd_f_05",
    "name": "Heart Cup Coffee",
    "type": "Cafe",
    "rating": 4.2,
    "costRange": "$$",
    "distanceKm": 0.8,
    "tags": ["friends", "casual", "coffee", "live music"],
    "isOpen": true,
    "context": "friends",
    "category": "restaurant",
    "budget_for_two": 600,
    "has_reels": false
  },
  {
    "id": "hyd_fam_01",
    "name": "Paradise Biryani",
    "type": "Biryani",
    "rating": 4.1,
    "costRange": "$$",
    "distanceKm": 5.2,
    "tags": ["family", "authentic", "biryani"],
    "isOpen": true,
    "context": "family",
    "category": "restaurant",
    "budget_for_two": 700,
    "has_reels": true
  },
  {
    "id": "hyd_fam_02",
    "name": "Bawarchi",
    "type": "Indian",
    "rating": 4.3,
    "costRange": "$$",
    "distanceKm": 4.5,
    "tags": ["family", "classic", "biryani"],
    "isOpen": true,
    "context": "family",
    "category": "restaurant",
    "budget_for_two": 800,
    "has_reels": true
  },
  {
    "id": "hyd_fam_03",
    "name": "Chutneys",
    "type": "South Indian",
    "rating": 4.4,
    "costRange": "$",
    "distanceKm": 1.5,
    "tags": ["family", "vegetarian", "breakfast"],
    "isOpen": true,
    "context": "family",
    "category": "restaurant",
    "budget_for_two": 500,
    "has_reels": false
  },
  {
    "id": "hyd_fam_04",
    "name": "Barbeque Nation",
    "type": "Buffet",
    "rating": 4.5,
    "costRange": "$$$",
    "distanceKm": 2.2,
    "tags": ["family", "buffet", "grill"],
    "isOpen": true,
    "context": "family",
    "category": "restaurant",
    "budget_for_two": 1600,
    "has_reels": true
  },
  {
    "id": "hyd_fam_05",
    "name": "Ohri’s Jiva Imperia",
    "type": "Multi-cuisine",
    "rating": 4.2,
    "costRange": "$$$",
    "distanceKm": 3.8,
    "tags": ["family", "vegetarian", "buffet"],
    "isOpen": true,
    "context": "family",
    "category": "restaurant",
    "budget_for_two": 1400,
    "has_reels": false
  },
  {
    "id": "hyd_d_01",
    "name": "Exotica",
    "type": "Rooftop Dining",
    "rating": 4.6,
    "costRange": "$$$",
    "distanceKm": 1.9,
    "tags": ["date", "romantic", "rooftop"],
    "isOpen": true,
    "context": "date",
    "category": "restaurant",
    "budget_for_two": 2000,
    "has_reels": true
  },
  {
    "id": "hyd_d_02",
    "name": "Olive Bistro",
    "type": "Mediterranean",
    "rating": 4.7,
    "costRange": "$$$",
    "distanceKm": 2.4,
    "tags": ["date", "romantic", "view"],
    "isOpen": true,
    "context": "date",
    "category": "restaurant",
    "budget_for_two": 2500,
    "has_reels": true
  },
  {
    "id": "hyd_d_03",
    "name": "Roastery Coffee House",
    "type": "Cafe",
    "rating": 4.8,
    "costRange": "$$",
    "distanceKm": 0.5,
    "tags": ["date", "cozy", "specialty coffee"],
    "isOpen": true,
    "context": "date",
    "category": "restaurant",
    "budget_for_two": 800,
    "has_reels": true
  },
  {
    "id": "hyd_d_04",
    "name": "Farzi Cafe",
    "type": "Modern Indian",
    "rating": 4.5,
    "costRange": "$$$",
    "distanceKm": 1.3,
    "tags": ["date", "experimental", "lively"],
    "isOpen": true,
    "context": "date",
    "category": "restaurant",
    "budget_for_two": 1800,
    "has_reels": true
  },
  {
    "id": "hyd_d_05",
    "name": "The Glass Onion",
    "type": "Fine Dining",
    "rating": 4.4,
    "costRange": "$$$",
    "distanceKm": 3.2,
    "tags": ["date", "elegant", "upscale"],
    "isOpen": true,
    "context": "date",
    "category": "restaurant",
    "budget_for_two": 2200,
    "has_reels": false
  },
  {
    "id": "hyd_s_01",
    "name": "Cafe Niloufer",
    "type": "Cafe",
    "rating": 4.8,
    "costRange": "$",
    "distanceKm": 0.5,
    "tags": ["solo", "authentic", "tea", "maska bun"],
    "isOpen": true,
    "context": "solo",
    "category": "restaurant",
    "budget_for_two": 300,
    "has_reels": true
  },
  {
    "id": "hyd_s_02",
    "name": "Third Wave Coffee",
    "type": "Cafe",
    "rating": 4.5,
    "costRange": "$",
    "distanceKm": 1.1,
    "tags": ["solo", "work friendly", "coffee"],
    "isOpen": true,
    "context": "solo",
    "category": "restaurant",
    "budget_for_two": 400,
    "has_reels": false
  },
  {
    "id": "hyd_s_03",
    "name": "Conçu",
    "type": "Bakery & Desserts",
    "rating": 4.7,
    "costRange": "$$",
    "distanceKm": 2.2,
    "tags": ["solo", "elegant", "desserts"],
    "isOpen": true,
    "context": "solo",
    "category": "restaurant",
    "budget_for_two": 700,
    "has_reels": true
  },
  {
    "id": "hyd_s_04",
    "name": "Taaza Kitchen",
    "type": "Healthy Food",
    "rating": 4.6,
    "costRange": "$",
    "distanceKm": 0.8,
    "tags": ["solo", "quick bite", "healthy"],
    "isOpen": true,
    "context": "solo",
    "category": "restaurant",
    "budget_for_two": 500,
    "has_reels": false
  },
  {
    "id": "hyd_s_05",
    "name": "Subbayya Gari Hotel",
    "type": "Andhra Meals",
    "rating": 4.4,
    "costRange": "$",
    "distanceKm": 1.5,
    "tags": ["solo", "traditional", "thali"],
    "isOpen": true,
    "context": "solo",
    "category": "restaurant",
    "budget_for_two": 450,
    "has_reels": true
  }
];

const publicReviews = {
  '1': [
    {
      id: 'r1',
      userId: 'u1',
      rating: 5,
      comment: 'Perfect date spot, amazing views and service.',
      createdAt: new Date().toISOString()
    }
  ],
  '2': []
};

// Private, per-user notes not visible to others.
const privateNotes = {
  // [placeId][userId] = { note, updatedAt }
};

// GET /api/places/nearby?lat=&lng=&context=&budget=&distanceKm=&mood=
router.get('/nearby', (req, res) => {
  const { context, budget, distanceKm, mood } = req.query;

  // Basic filtering on mock data; replace with real geo + ranking logic later.
  let results = [...testPlaces];

  if (context) {
    results = results.filter((p) => p.context === context);
  }

  if (budget) {
    // Match on costRange (used by our mock data) or budget field if present.
    results = results.filter(
      (p) => p.costRange === budget || p.budget === budget
    );
  }

  if (distanceKm) {
    const maxDist = parseFloat(distanceKm);
    if (!Number.isNaN(maxDist)) {
      results = results.filter(
        (p) => typeof p.distanceKm === 'number' && p.distanceKm <= maxDist
      );
    }
  }

  if (mood) {
    const moodLower = String(mood).toLowerCase();
    results = results.filter((p) =>
      (p.tags || []).some((t) => String(t).toLowerCase().includes(moodLower))
    );
  }

  res.json({ places: results });
});

// GET /api/places/:id
router.get('/:id', (req, res) => {
  const place = testPlaces.find((p) => p.id === req.params.id);
  if (!place) {
    return res.status(404).json({ error: 'Place not found' });
  }
  res.json({ place });
});

// GET /api/places/:id/reviews
router.get('/:id/reviews', (req, res) => {
  const reviews = publicReviews[req.params.id] || [];
  res.json({ reviews });
});

// POST /api/places/:id/reviews
router.post('/:id/reviews', (req, res) => {
  const { rating, comment, userId } = req.body;
  if (!rating || !userId) {
    return res.status(400).json({ error: 'rating and userId are required' });
  }

  const review = {
    id: `${Date.now()}`,
    userId,
    rating,
    comment: comment || '',
    createdAt: new Date().toISOString()
  };

  if (!publicReviews[req.params.id]) {
    publicReviews[req.params.id] = [];
  }
  publicReviews[req.params.id].push(review);

  res.status(201).json({ review });
});

// GET /api/places/:id/notes (private summaries for a given user)
router.get('/:id/notes', (req, res) => {
  const userId = req.header('x-user-id');
  if (!userId) {
    return res.status(400).json({ error: 'x-user-id header is required' });
  }

  const placeNotes = privateNotes[req.params.id] || {};
  const note = placeNotes[userId] || null;
  res.json({ note });
});

// POST /api/places/:id/notes
router.post('/:id/notes', (req, res) => {
  const userId = req.header('x-user-id');
  const { note } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'x-user-id header is required' });
  }

  if (!note) {
    return res.status(400).json({ error: 'note is required' });
  }

  if (!privateNotes[req.params.id]) {
    privateNotes[req.params.id] = {};
  }

  privateNotes[req.params.id][userId] = {
    note,
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({ note: privateNotes[req.params.id][userId] });
});

// Export router as the default export and also expose testPlaces for tests.
module.exports = router;
module.exports.testPlaces = testPlaces;
