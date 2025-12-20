import React, { useEffect, useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { ItineraryList } from './components/ItineraryList';
import { Itinerary } from './components/ItineraryCard';
import { LandingPage } from './components/LandingPage';

interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

const FALLBACK_RATES: Record<string, number> = {
  'USD': 83.12,
  'EUR': 90.45,
  'GBP': 104.32,
  'JPY': 0.55,
  'AUD': 54.23,
  'CAD': 61.04,
  'SGD': 61.89,
  'THB': 2.35,
  'INR': 1
};

function App() {
  const [userNationality, setUserNationality] = useState<Country | null>(() => {
    const saved = localStorage.getItem('trip-planner-nationality');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Itinerary[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [sortBy, setSortBy] = useState<'best-match' | 'cheapest' | 'shortest' | 'closest'>('best-match');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('trip-planner-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [currencyRates, setCurrencyRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch('/api/rates');
        if (!res.ok) throw new Error('Failed to fetch rates');
        const data = await res.json();
        if (data?.rates) {
          setCurrencyRates(data.rates);
          return;
        }
        setCurrencyRates(FALLBACK_RATES);
      } catch (err) {
        setCurrencyRates(FALLBACK_RATES);
        console.error('Using fallback currency rates', err);
      }
    }
    loadRates();
  }, []);

  const handleSelectNationality = (country: Country) => {
    setUserNationality(country);
    localStorage.setItem('trip-planner-nationality', JSON.stringify(country));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem('trip-planner-favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const getSortedResults = () => {
    const sorted = [...results];
    if (sortBy === 'cheapest') {
      sorted.sort((a, b) => a.approximateCostMin - b.approximateCostMin);
    } else if (sortBy === 'shortest') {
      sorted.sort((a, b) => (a.recommendedMinDays) - (b.recommendedMinDays));
    } else if (sortBy === 'closest') {
      const dist = (it: Itinerary) => it.distanceKmFromCity[selectedCity] || 999;
      sorted.sort((a, b) => dist(a) - dist(b));
    }
    return sorted;
  };

  async function onSearch(params: { city: string; days: number; budgetAmount: number; interests: string[] }) {
    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedCity(params.city);
    setSortBy('best-match');

    try {
      const interestsQuery = params.interests.length > 0 ? params.interests.join(',') : '';
      const url = `/api/itineraries?city=${encodeURIComponent(params.city)}&days=${params.days}&budgetAmount=${params.budgetAmount}&interests=${encodeURIComponent(interestsQuery)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch itineraries');
      
      const data = await response.json();
      setResults(data.itineraries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching itineraries');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!userNationality ? (
        <LandingPage onSelectNationality={handleSelectNationality} />
      ) : (
        <div className="container">
          <header>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h1>✨ Universal India Trip Planner</h1>
                <p>Your AI-powered trip planner for all of India · Personalized itineraries in seconds</p>
              </div>
              <button
                onClick={() => {
                  setUserNationality(null);
                  localStorage.removeItem('trip-planner-nationality');
                }}
                style={{
                  padding: '0.7rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                🌍 {userNationality.flag} Change Country
              </button>
            </div>
          </header>
          <main>
            <SearchForm onSearch={onSearch} userCurrency={userNationality.currency} />
            <section>
              {loading && (
                <div className="loading-spinner">
                  <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Finding perfect itineraries for you...</p>
                </div>
              )}
              {error && <p className="error">⚠️ {error}</p>}
              {!loading && !error && results.length === 0 && selectedCity && (
                <p className="info">🔍 No itineraries found. Try adjusting your filters or budget.</p>
              )}
              {!loading && !error && results.length > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <p className="info" style={{ margin: 0 }}>
                      ✅ Found {results.length} perfect {results.length === 1 ? 'itinerary' : 'itineraries'} for your trip from {selectedCity}
                    </p>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      style={{
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        background: 'white',
                        color: '#374151',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="best-match">🎯 Best Match</option>
                      <option value="cheapest">💰 Cheapest</option>
                      <option value="shortest">⏱️ Shortest</option>
                      <option value="closest">📍 Closest</option>
                    </select>
                  </div>
                  <ItineraryList 
                    itineraries={getSortedResults()} 
                    selectedCity={selectedCity} 
                    favorites={favorites} 
                    onToggleFavorite={toggleFavorite}
                    userCurrency={userNationality.currency}
                    currencyRates={currencyRates || FALLBACK_RATES}
                  />
                </>
              )}
            </section>
          </main>
          <footer style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem 0', color: 'rgba(255,255,255,0.8)' }}>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
              Powered by AI · Curated for India Tourism
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', opacity: 0.7 }}>
              © 2025 Universal India Trip Planner · Made with ❤️ for travelers
            </p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
