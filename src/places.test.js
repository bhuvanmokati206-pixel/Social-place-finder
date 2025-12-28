const request = require('supertest');
const express = require('express');
const placesRouter = require('./routes/places');

// Access the exported testPlaces from the router module
const { testPlaces } = placesRouter;

// Create a small app instance for testing
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/places', placesRouter);
  return app;
}

const app = createTestApp();

function expectTwoRestaurantsThreeParksForContext(places, context) {
  const byContext = places.filter((p) => p.context === context);
  const restaurants = byContext.filter((p) => p.category === 'restaurant');
  const parks = byContext.filter((p) => p.category === 'park');

  expect(restaurants).toHaveLength(2);
  expect(parks).toHaveLength(3);
}

describe('GET /api/places/nearby using testPlaces mock data', () => {
  test('friends context returns exactly 2 restaurants and 3 parks', async () => {
    const res = await request(app)
      .get('/api/places/nearby')
      .query({ context: 'friends' })
      .expect(200);

    const { places } = res.body;
    expectTwoRestaurantsThreeParksForContext(places, 'friends');
  });

  test('family context returns exactly 2 restaurants and 3 parks', async () => {
    const res = await request(app)
      .get('/api/places/nearby')
      .query({ context: 'family' })
      .expect(200);

    const { places } = res.body;
    expectTwoRestaurantsThreeParksForContext(places, 'family');
  });

  test('date context returns exactly 2 restaurants and 3 parks', async () => {
    const res = await request(app)
      .get('/api/places/nearby')
      .query({ context: 'date' })
      .expect(200);

    const { places } = res.body;
    expectTwoRestaurantsThreeParksForContext(places, 'date');
  });

  test('solo context returns exactly 2 restaurants and 3 parks', async () => {
    const res = await request(app)
      .get('/api/places/nearby')
      .query({ context: 'solo' })
      .expect(200);

    const { places } = res.body;
    expectTwoRestaurantsThreeParksForContext(places, 'solo');
  });

  test('colleagues context returns exactly 2 restaurants and 3 parks', async () => {
    const res = await request(app)
      .get('/api/places/nearby')
      .query({ context: 'colleagues' })
      .expect(200);

    const { places } = res.body;
    expectTwoRestaurantsThreeParksForContext(places, 'colleagues');
  });
});
