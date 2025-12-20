import React, { useMemo, useState } from 'react';

const STATE_CITIES: Record<string, string[]> = {
  'Andaman and Nicobar Islands': ['Port Blair'],
  'Assam': ['Guwahati', 'Silchar'],
  'Bihar': ['Patna'],
  'Chandigarh': ['Chandigarh'],
  'Delhi': ['Delhi'],
  'Goa': ['Goa'],
  'Gujarat': ['Ahmedabad', 'Rajkot', 'Vadodara'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
  'Jammu and Kashmir': ['Srinagar'],
  'Karnataka': ['Bangalore', 'Mangalore', 'Mysore'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Alappuzha', 'Thrissur', 'Munnar'],
  'Madhya Pradesh': ['Gwalior'],
  'Maharashtra': ['Mumbai', 'Pune'],
  'Meghalaya': ['Shillong'],
  'Odisha': ['Bhubaneswar', 'Cuttack'],
  'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Bikaner', 'Pushkar', 'Ajmer'],
  'Tamil Nadu': ['Chennai', 'Coimbatore'],
  'Telangana': ['Hyderabad'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Agra', 'Mathura', 'Allahabad', 'Bareilly', 'Jhansi', 'Kanpur'],
  'Uttarakhand': ['Nainital'],
  'West Bengal': ['Kolkata', 'Darjeeling', 'Siliguri']
};

const ALL_CITIES = Object.values(STATE_CITIES).flat();

const INTEREST_OPTIONS = [
  { label: 'Heritage & History', value: 'heritage' },
  { label: 'Spirituality', value: 'spirituality' },
  { label: 'Nature & Adventure', value: 'nature' },
  { label: 'Beaches', value: 'beaches' },
  { label: 'Food & Culture', value: 'food' },
  { label: 'Photography', value: 'photography' },
  { label: 'Monuments', value: 'monuments' },
  { label: 'Water Sports', value: 'water-sports' }
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'AUD': 'A$',
  'CAD': 'C$',
  'SGD': 'S$',
  'THB': '฿',
  'INR': '₹'
};

export function SearchForm({ onSearch, userCurrency = 'INR' }: { onSearch: (params: { city: string; days: number; budgetAmount: number; interests: string[] }) => void; userCurrency?: string }) {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [days, setDays] = useState<number>(3);
  const [budgetAmount, setBudgetAmount] = useState<number>(10000);
  const [interests, setInterests] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const currencySymbol = CURRENCY_SYMBOLS[userCurrency] || userCurrency;

  const suggestions = useMemo(() => {
    const q = city.trim().toLowerCase();
    const cityPool = state ? STATE_CITIES[state] || [] : ALL_CITIES;
    const filtered = q ? cityPool.filter(c => c.toLowerCase().includes(q)) : cityPool;
    return filtered.slice(0, 8);
  }, [city, state]);

  function toggleInterest(value: string) {
    setInterests(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }

  function handleStateChange(nextState: string) {
    setState(nextState);
    const cities = nextState ? (STATE_CITIES[nextState] || []) : ALL_CITIES;
    if (city && !cities.includes(city)) {
      setCity('');
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!state) return alert('Please select a state first');
    if (!city.trim()) return alert('Please enter a city in the selected state');
    if (state && !(STATE_CITIES[state] || []).includes(city)) return alert('Please choose a city from the selected state');
    if (!days || days < 1) return alert('Days must be at least 1');
    if (budgetAmount < 0) return alert('Budget must be >= 0');
    onSearch({ city: city.trim(), days, budgetAmount, interests });
    setShowSuggestions(false);
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem', color: '#1f2937', fontWeight: 700 }}>
        🇮🇳 Plan Your Perfect India Adventure
      </h2>
      
      <div className="field">
        <label>🗺️ Which state?</label>
        <select value={state} onChange={(e) => handleStateChange(e.target.value)}>
          <option value="">Select a state</option>
          {Object.keys(STATE_CITIES).sort().map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>📍 Where are you starting from?</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          placeholder="Type a city in your selected state"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={s} onMouseDown={() => { setCity(s); setShowSuggestions(false); }}>
                📍 {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="field-inline">
        <div className="field">
          <label>📅 How many days?</label>
          <input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))} placeholder="e.g., 3" />
        </div>
        <div className="field">
          <label>💰 Your budget ({currencySymbol})</label>
          <input type="number" min={0} value={budgetAmount} onChange={(e) => setBudgetAmount(Number(e.target.value))} placeholder="e.g., 15000" />
        </div>
      </div>

      <div className="field">
        <label>❤️ What interests you? (optional)</label>
        <div className="chips">
          {INTEREST_OPTIONS.map(opt => (
            <button type="button" key={opt.value} className={`chip ${interests.includes(opt.value) ? 'active' : ''}`} onClick={() => toggleInterest(opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
        <p className="hint">Select all that apply or leave blank to see all options</p>
      </div>

      <div className="actions">
        <button type="submit" className="primary">
          🚀 Find My Perfect Trip
        </button>
      </div>
    </form>
  );
}
