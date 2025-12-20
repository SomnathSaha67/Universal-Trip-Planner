import fs from 'fs';
import path from 'path';
import { Itinerary } from './types.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cache: Itinerary[] | null = null;

export function loadItineraries(): Itinerary[] {
  if (cache) return cache;
  const dataPath = path.join(__dirname, '..', 'data', 'itineraries.json');
  const json = fs.readFileSync(dataPath, 'utf-8');
  cache = JSON.parse(json);
  return cache!;
}
