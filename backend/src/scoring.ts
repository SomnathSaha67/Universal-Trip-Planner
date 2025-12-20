import { Itinerary, QueryInput } from './types.js';

function normalizeCity(city?: string) {
  return city?.trim().toLowerCase();
}

export function filterAndScore(itineraries: Itinerary[], query: QueryInput): { itinerary: Itinerary; score: number }[] {
  const cityNorm = normalizeCity(query.city);
  const interestsSet = new Set((query.interests || []).map((i) => i.trim().toLowerCase()));

  const results: { itinerary: Itinerary; score: number }[] = [];

  for (const it of itineraries) {
    let score = 0;

    // City preference - require an exact supported city match when a city is provided
    const supportedLower = it.supportedStartingCities.map((c) => c.toLowerCase());
    if (cityNorm) {
      if (!supportedLower.includes(cityNorm)) continue; // exclude itineraries that don't serve the selected city
      score += 5;
    }

    // Interests (optional, no failure if none match)
    if (interestsSet.size > 0) {
      const overlap = it.interests.filter((i) => interestsSet.has(i.toLowerCase()));
      score += overlap.length * 2; // reward matches, but never exclude
    }

    // Budget range (lenient: prefer within range, but always include)
    if (typeof query.budgetAmount === 'number' && query.budgetAmount > 0) {
      const within = query.budgetAmount >= it.approximateCostMin && query.budgetAmount <= it.approximateCostMax;
      if (within) {
        score += 4;
      } else if (query.budgetAmount > it.approximateCostMax) {
        // Over budget but not excessive
        const overage = query.budgetAmount - it.approximateCostMax;
        const maxCost = Math.max(...itineraries.map(x => x.approximateCostMax));
        if (overage < maxCost * 0.5) {
          score += 1; // slight fallback
        }
      } else {
        // Under budget (still good for traveler)
        score += 2;
      }
    }

    // Days range (lenient: prefer within range, but always include)
    if (typeof query.days === 'number' && query.days > 0) {
      const within = query.days >= it.recommendedMinDays && query.days <= it.recommendedMaxDays;
      if (within) {
        score += 3;
      } else {
        // Generous tolerance: ±2 days or 50% of recommended range
        const rangeMid = (it.recommendedMinDays + it.recommendedMaxDays) / 2;
        const rangeHalf = (it.recommendedMaxDays - it.recommendedMinDays) / 2;
        const distance = Math.abs(query.days - rangeMid);
        if (distance <= rangeHalf + 2) {
          score += 1; // near enough, still include
        }
        // else: far away but still include with 0 bonus
      }
    }

    results.push({ itinerary: it, score });
  }

  return results.sort((a, b) => b.score - a.score);
}
