const express = require('express');
const cors = require('cors');
const path = require('path');

const placesRouter = require('./routes/places');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve the mobile-first web frontend as static files
const frontendPath = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

// API routes
app.use('/api/places', placesRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Social places API listening on http://localhost:${PORT}`);
});
