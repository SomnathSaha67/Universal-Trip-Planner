import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let cache = null;
export function loadItineraries() {
    if (cache)
        return cache;
    const dataPath = path.join(__dirname, '..', 'data', 'itineraries.json');
    const json = fs.readFileSync(dataPath, 'utf-8');
    cache = JSON.parse(json);
    return cache;
}
