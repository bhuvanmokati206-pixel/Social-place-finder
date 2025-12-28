const express = require('express');

const router = express.Router();

// In-memory mock data for now; replace with a real database or external API.
// For now we keep a rich set of mock places covering each context.

const testPlaces = [
  // Friends – restaurants (2)
  {
    id: 'place_friends_rest_1',
    name: 'Taproom Social',
    type: 'Restaurant & Bar',
    rating: 4.6,
    costRange: '$$',
    distanceKm: 1.2,
    tags: ['casual', 'lively', 'craft beer', 'shared plates'],
    isOpen: true,
    context: 'friends',
    category: 'restaurant'
  },
  {
    id: 'place_friends_rest_2',
    name: 'Noodle House 88',
    type: 'Ramen Restaurant',
    rating: 4.4,
    costRange: '$$',
    distanceKm: 0.8,
    tags: ['noodles', 'cozy', 'late night'],
    isOpen: true,
    context: 'friends',
    category: 'restaurant'
  },

  // Friends – parks (3)
  {
    id: 'place_friends_park_1',
    name: 'Riverside Skate Park',
    type: 'Park',
    rating: 4.7,
    costRange: '$',
    distanceKm: 2.3,
    tags: ['skate', 'urban', 'street art'],
    isOpen: true,
    context: 'friends',
    category: 'park'
  },
  {
    id: 'place_friends_park_2',
    name: 'Central Commons',
    type: 'City Park',
    rating: 4.5,
    costRange: '$',
    distanceKm: 1.5,
    tags: ['picnic', 'open lawns', 'music events'],
    isOpen: true,
    context: 'friends',
    category: 'park'
  },
  {
    id: 'place_friends_park_3',
    name: 'Summit View Overlook',
    type: 'Scenic Lookout',
    rating: 4.8,
    costRange: '$',
    distanceKm: 4.1,
    tags: ['sunset', 'viewpoint', 'hiking'],
    isOpen: false,
    context: 'friends',
    category: 'park'
  },

  // Family – restaurants (2)
  {
    id: 'place_family_rest_1',
    name: 'Family Table Diner',
    type: 'Family Restaurant',
    rating: 4.3,
    costRange: '$$',
    distanceKm: 0.9,
    tags: ['kids menu', 'high chairs', 'comfort food'],
    isOpen: true,
    context: 'family',
    category: 'restaurant'
  },
  {
    id: 'place_family_rest_2',
    name: 'Little Italy Trattoria',
    type: 'Italian Restaurant',
    rating: 4.6,
    costRange: '$$',
    distanceKm: 2.0,
    tags: ['pasta', 'pizza', 'family friendly'],
    isOpen: true,
    context: 'family',
    category: 'restaurant'
  },

  // Family – parks (3)
  {
    id: 'place_family_park_1',
    name: 'Maple Grove Playground',
    type: 'Playground',
    rating: 4.4,
    costRange: '$',
    distanceKm: 1.1,
    tags: ['playground', 'swings', 'slides'],
    isOpen: true,
    context: 'family',
    category: 'park'
  },
  {
    id: 'place_family_park_2',
    name: 'Discovery Nature Reserve',
    type: 'Nature Park',
    rating: 4.7,
    costRange: '$',
    distanceKm: 3.2,
    tags: ['walking trails', 'wildlife', 'picnic'],
    isOpen: true,
    context: 'family',
    category: 'park'
  },
  {
    id: 'place_family_park_3',
    name: 'City Splash Pad',
    type: 'Water Play Area',
    rating: 4.2,
    costRange: '$',
    distanceKm: 2.7,
    tags: ['water play', 'summer', 'kids'],
    isOpen: false,
    context: 'family',
    category: 'park'
  },

  // Date – restaurants (2)
  {
    id: 'place_date_rest_1',
    name: 'Candlelight Bistro',
    type: 'Romantic Restaurant',
    rating: 4.8,
    costRange: '$$$',
    distanceKm: 1.9,
    tags: ['romantic', 'wine', 'fine dining'],
    isOpen: true,
    context: 'date',
    category: 'restaurant'
  },
  {
    id: 'place_date_rest_2',
    name: 'Rooftop Garden Grill',
    type: 'Rooftop Restaurant',
    rating: 4.7,
    costRange: '$$$',
    distanceKm: 3.0,
    tags: ['rooftop', 'city view', 'grill'],
    isOpen: true,
    context: 'date',
    category: 'restaurant'
  },

  // Date – parks (3)
  {
    id: 'place_date_park_1',
    name: 'Lakeside Boardwalk',
    type: 'Park',
    rating: 4.6,
    costRange: '$',
    distanceKm: 2.4,
    tags: ['sunset walk', 'lake', 'benches'],
    isOpen: true,
    context: 'date',
    category: 'park'
  },
  {
    id: 'place_date_park_2',
    name: 'Rose Garden Park',
    type: 'Botanical Garden',
    rating: 4.9,
    costRange: '$$',
    distanceKm: 4.5,
    tags: ['flowers', 'quiet', 'photo spots'],
    isOpen: true,
    context: 'date',
    category: 'park'
  },
  {
    id: 'place_date_park_3',
    name: 'Starlight Amphitheater Lawn',
    type: 'Outdoor Venue',
    rating: 4.5,
    costRange: '$$',
    distanceKm: 5.0,
    tags: ['live music', 'blankets', 'nighttime'],
    isOpen: false,
    context: 'date',
    category: 'park'
  },

  // Solo – restaurants (2)
  {
    id: 'place_solo_rest_1',
    name: 'Corner Coffee Roasters',
    type: 'Cafe',
    rating: 4.6,
    costRange: '$$',
    distanceKm: 0.6,
    tags: ['coffee', 'wifi', 'laptop friendly'],
    isOpen: true,
    context: 'solo',
    category: 'restaurant'
  },
  {
    id: 'place_solo_rest_2',
    name: 'Veggie Bowl Express',
    type: 'Fast Casual',
    rating: 4.3,
    costRange: '$',
    distanceKm: 1.3,
    tags: ['healthy', 'quick bite', 'takeaway'],
    isOpen: true,
    context: 'solo',
    category: 'restaurant'
  },

  // Solo – parks (3)
  {
    id: 'place_solo_park_1',
    name: 'Quiet Reading Garden',
    type: 'Pocket Park',
    rating: 4.4,
    costRange: '$',
    distanceKm: 0.9,
    tags: ['quiet', 'benches', 'shade'],
    isOpen: true,
    context: 'solo',
    category: 'park'
  },
  {
    id: 'place_solo_park_2',
    name: 'Ridge Trail Loop',
    type: 'Hiking Area',
    rating: 4.7,
    costRange: '$',
    distanceKm: 4.0,
    tags: ['hiking', 'exercise', 'scenic'],
    isOpen: true,
    context: 'solo',
    category: 'park'
  },
  {
    id: 'place_solo_park_3',
    name: 'City Art Walk Park',
    type: 'Urban Park',
    rating: 4.5,
    costRange: '$',
    distanceKm: 1.8,
    tags: ['public art', 'urban walk', 'photography'],
    isOpen: false,
    context: 'solo',
    category: 'park'
  },

  // Colleagues – restaurants (2)
  {
    id: 'place_work_rest_1',
    name: 'Market Street Lunch Hall',
    type: 'Food Hall',
    rating: 4.4,
    costRange: '$$',
    distanceKm: 0.7,
    tags: ['group friendly', 'variety', 'quick lunch'],
    isOpen: true,
    context: 'colleagues',
    category: 'restaurant'
  },
  {
    id: 'place_work_rest_2',
    name: 'Business Bistro & Grill',
    type: 'Business Lunch Restaurant',
    rating: 4.5,
    costRange: '$$',
    distanceKm: 1.9,
    tags: ['reservations', 'quiet', 'meeting friendly'],
    isOpen: true,
    context: 'colleagues',
    category: 'restaurant'
  },

  // Colleagues – parks (3)
  {
    id: 'place_work_park_1',
    name: 'Office Plaza Green',
    type: 'City Plaza',
    rating: 4.1,
    costRange: '$',
    distanceKm: 0.4,
    tags: ['lunch break', 'benches', 'open space'],
    isOpen: true,
    context: 'colleagues',
    category: 'park'
  },
  {
    id: 'place_work_park_2',
    name: 'Innovation Park',
    type: 'Business District Park',
    rating: 4.3,
    costRange: '$',
    distanceKm: 2.2,
    tags: ['walking paths', 'outdoor seating', 'wifi'],
    isOpen: true,
    context: 'colleagues',
    category: 'park'
  },
  {
    id: 'place_work_park_3',
    name: 'Rooftop Terrace Garden',
    type: 'Rooftop Park',
    rating: 4.6,
    costRange: '$$',
    distanceKm: 3.3,
    tags: ['after work', 'views', 'casual hangout'],
    isOpen: false,
    context: 'colleagues',
    category: 'park'
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
