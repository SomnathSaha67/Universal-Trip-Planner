import React, { useState, useEffect } from 'react';
import { ItineraryCard, Itinerary } from './ItineraryCard';

export function ItineraryList({ 
  itineraries, 
  selectedCity,
  favorites,
  onToggleFavorite,
  userCurrency = 'INR',
  currencyRates
}: { 
  itineraries: Itinerary[]; 
  selectedCity: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userCurrency?: string;
  currencyRates?: Record<string, number>;
}) {
  const [convertFrom, setConvertFrom] = useState<string>(userCurrency);
  const [convertAmount, setConvertAmount] = useState<number>(10000);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // Update convertFrom when userCurrency changes
  useEffect(() => {
    setConvertFrom(userCurrency);
    setConvertedAmount(null);
    setExchangeRate(null);
  }, [userCurrency]);

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
  const activeRates = currencyRates || FALLBACK_RATES;

  const handleCurrencyConvert = () => {
    if (convertAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const rate = activeRates[convertFrom] || 1;
    if (rate <= 0) {
      alert('Exchange rate unavailable for this currency');
      return;
    }
    const inINR = convertAmount / rate; // rates are quoted as target per INR, so invert to get INR
    setExchangeRate(1 / rate);
    setConvertedAmount(inINR);
  };

  return (
    <>
      <div className="currency-widget">
        <h3>💱 Currency Converter for Budget Planning</h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Your selected currency: <strong>{userCurrency}</strong> - Convert to INR to plan your budget</p>
        
        <div className="currency-input-group">
          <div className="currency-input">
            <label>Your Currency</label>
            <select value={convertFrom} onChange={(e) => setConvertFrom(e.target.value)}>
              {Object.keys(activeRates).map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
          <div className="currency-input">
            <label>Amount</label>
            <input 
              type="number" 
              value={convertAmount} 
              onChange={(e) => setConvertAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
        </div>

        <button className="primary" onClick={handleCurrencyConvert} style={{ width: '100%' }}>
          Convert to INR
        </button>

        {convertedAmount !== null && (
          <div className="currency-result">
            <p>{convertAmount} {convertFrom} =</p>
            <p className="amount">₹{convertedAmount.toFixed(2)}</p>
            <p>Exchange Rate: 1 {convertFrom} = ₹{exchangeRate?.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="grid">
        {itineraries.map((it) => (
          <ItineraryCard 
            key={it.id} 
            itinerary={it} 
            selectedCity={selectedCity}
            isFavorite={favorites.includes(it.id)}
            onToggleFavorite={onToggleFavorite}
            userCurrency={userCurrency}
            currencyRates={activeRates}
          />
        ))}
      </div>
    </>
  );
}
