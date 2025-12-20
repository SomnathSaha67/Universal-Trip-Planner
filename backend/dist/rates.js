const DEFAULT_RATES = {
    USD: 83.12,
    EUR: 90.45,
    GBP: 104.32,
    JPY: 0.55,
    AUD: 54.23,
    CAD: 61.04,
    SGD: 61.89,
    THB: 2.35,
    INR: 1
};
let cachedRates = DEFAULT_RATES;
let cachedAt = 0;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
async function fetchLiveRates() {
    // Public free endpoint, base INR
    const res = await fetch('https://open.er-api.com/v6/latest/INR');
    if (!res.ok)
        throw new Error(`Rate fetch failed with status ${res.status}`);
    const json = (await res.json());
    if (json?.result !== 'success' || !json?.rates)
        throw new Error('Invalid rate payload');
    return json.rates;
}
export async function getRates() {
    const now = Date.now();
    const isFresh = now - cachedAt < CACHE_TTL_MS;
    if (isFresh && cachedRates) {
        return { rates: cachedRates, source: 'cache' };
    }
    try {
        const live = await fetchLiveRates();
        cachedRates = { ...cachedRates, ...live };
        cachedAt = now;
        return { rates: cachedRates, source: 'live' };
    }
    catch (err) {
        // Keep existing cached or default rates if live fetch fails
        if (!cachedRates || Object.keys(cachedRates).length === 0) {
            cachedRates = DEFAULT_RATES;
        }
        return { rates: cachedRates, source: 'fallback' };
    }
}
export const defaultRates = DEFAULT_RATES;
