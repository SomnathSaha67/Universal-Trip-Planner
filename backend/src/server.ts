import express from 'express';
import cors from 'cors';
import { loadItineraries } from './dataLoader.js';
import { filterAndScore } from './scoring.js';
import { getRates, defaultRates } from './rates.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/rates', async (_req, res) => {
  try {
    const { rates, source } = await getRates();
    res.json({ rates, source });
  } catch (err) {
    res.status(500).json({ rates: defaultRates, source: 'fallback', error: (err as Error).message });
  }
});

app.get('/api/itineraries', (req, res) => {
  const city = typeof req.query.city === 'string' ? req.query.city : undefined;
  const days = req.query.days ? Number(req.query.days) : undefined;
  const budgetAmount = req.query.budgetAmount ? Number(req.query.budgetAmount) : undefined;
  const interestsStr = typeof req.query.interests === 'string' ? req.query.interests : undefined;
  const interests = interestsStr ? interestsStr.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : [];

  const itineraries = loadItineraries();
  const scored = filterAndScore(itineraries, { city, days, budgetAmount, interests });
  const topResults = scored.slice(0, 12).map((s) => s.itinerary);
  res.json({ itineraries: topResults, total: scored.length });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✨ Backend listening on port ${PORT}`);
});
