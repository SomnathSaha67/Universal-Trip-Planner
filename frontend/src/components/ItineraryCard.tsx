import React, { useState } from 'react';

const CURRENCY_RATES: Record<string, number> = {
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

export interface Place { name: string; description: string; day: number }
export interface Itinerary {
  id: string;
  title: string;
  shortDescription: string;
  supportedStartingCities: string[];
  recommendedMinDays: number;
  recommendedMaxDays: number;
  approximateCostMin: number;
  approximateCostMax: number;
  interests: string[];
  distanceKmFromCity: Record<string, number>;
  timeHoursFromCity: Record<string, number>;
  places: Place[];
}

export function ItineraryCard({ 
  itinerary, 
  selectedCity,
  isFavorite = false,
  onToggleFavorite = () => {},
  userCurrency = 'INR',
  currencyRates
}: { 
  itinerary: Itinerary; 
  selectedCity: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  userCurrency?: string;
  currencyRates?: Record<string, number>;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const dist = itinerary.distanceKmFromCity[selectedCity];
  const time = itinerary.timeHoursFromCity[selectedCity];
  
  // Convert INR to user's currency
  const rateFromINR = (currencyRates?.[userCurrency] ?? CURRENCY_RATES[userCurrency]) || 1;
  const convertedMin = Math.round(itinerary.approximateCostMin * rateFromINR);
  const convertedMax = Math.round(itinerary.approximateCostMax * rateFromINR);
  const currencySymbol = CURRENCY_SYMBOLS[userCurrency] || userCurrency;
  
  return (
    <>
      <div className="card">
        <div className="itinerary-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h3>{itinerary.title}</h3>
              <p className="muted">{itinerary.shortDescription}</p>
            </div>
            <button 
              className={`btn-favorite ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(itinerary.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
          <div className="itinerary-tags">
            {itinerary.interests.map((interest) => (
              <span key={interest} className="itinerary-tag">
                {interest.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
        
        <div className="itinerary-stats">
          <div className="stat-item">
            <div className="stat-label">Duration</div>
            <div className="stat-value">{itinerary.recommendedMinDays}-{itinerary.recommendedMaxDays} days</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Budget</div>
            <div className="stat-value">{currencySymbol}{(convertedMin / 1000).toFixed(0)}K-{(convertedMax / 1000).toFixed(0)}K</div>
          </div>
          {dist !== undefined && (
            <div className="stat-item">
              <div className="stat-label">Distance</div>
              <div className="stat-value">{dist} km</div>
            </div>
          )}
          {time !== undefined && (
            <div className="stat-item">
              <div className="stat-label">Travel Time</div>
              <div className="stat-value">{time}h</div>
            </div>
          )}
        </div>

        <div>
          <strong style={{ color: '#374151', fontSize: '1.05rem' }}>📍 Places to Visit:</strong>
          <ul className="places">
            {itinerary.places.slice(0, 3).map((p, idx) => (
              <li key={idx}><strong>Day {p.day}:</strong> {p.name}</li>
            ))}
            {itinerary.places.length > 3 && (
              <li><em>+ {itinerary.places.length - 3} more places...</em></li>
            )}
          </ul>
        </div>

        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => {
            const message = `Check out ${itinerary.title}: ${itinerary.shortDescription}`;
            navigator.clipboard.writeText(message).then(() => alert('Copied to clipboard!'));
          }}>
            🔗 Share
          </button>
          <button className="btn-secondary" onClick={() => setShowDetails(true)}>
            📋 View Details
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content advanced-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{itinerary.title}</h2>
              <button className="modal-close" onClick={() => setShowDetails(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '1.05rem', color: '#555', marginBottom: '1.5rem' }}>{itinerary.shortDescription}</p>
              
              {/* Trip Overview */}
              <div className="modal-section">
                <h4>📊 Trip Overview</h4>
                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="overview-label">Duration</span>
                    <span className="overview-value">{itinerary.recommendedMinDays}-{itinerary.recommendedMaxDays} days</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Budget Range</span>
                    <span className="overview-value">{currencySymbol}{convertedMin.toLocaleString()} - {currencySymbol}{convertedMax.toLocaleString()}</span>
                  </div>
                  {dist !== undefined && (
                    <div className="overview-item">
                      <span className="overview-label">Distance</span>
                      <span className="overview-value">{dist} km</span>
                    </div>
                  )}
                  {time !== undefined && (
                    <div className="overview-item">
                      <span className="overview-label">Travel Time</span>
                      <span className="overview-value">~{Math.ceil(time)}h</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Best Time to Visit */}
              <div className="modal-section">
                <h4>🌤️ Best Time to Visit</h4>
                <p>October to March is ideal - pleasant weather, festivals, and perfect for outdoor activities. Avoid monsoon season (June-September) in most regions.</p>
                <div className="season-info">
                  <div className="season-badge good">✅ Best: Oct-Mar</div>
                  <div className="season-badge moderate">⚠️ Moderate: Apr-May</div>
                  <div className="season-badge poor">❌ Avoid: Jun-Sep</div>
                </div>
              </div>

              {/* Day-by-Day Itinerary */}
              <div className="modal-section">
                <h4>📅 Day-by-Day Itinerary</h4>
                <div className="daily-schedule-advanced">
                  {itinerary.places.map((place, idx) => (
                    <div key={idx} className="daily-item-advanced">
                      <div className="daily-header">
                        <span className="day-badge">Day {place.day}</span>
                        <span className="place-name">{place.name}</span>
                      </div>
                      <p className="place-description">{place.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-Person Cost Breakdown */}
              <div className="modal-section">
                <h4>💰 Per-Person Cost Breakdown</h4>
                <div className="cost-breakdown">
                  <div className="cost-item">
                    <span>🏨 Accommodation</span>
                    <span>{currencySymbol}{Math.floor(((convertedMax - convertedMin) * 0.4 / itinerary.recommendedMaxDays)).toLocaleString()}/day</span>
                  </div>
                  <div className="cost-item">
                    <span>🍽️ Food & Dining</span>
                    <span>{currencySymbol}{Math.floor(((convertedMax - convertedMin) * 0.3 / itinerary.recommendedMaxDays)).toLocaleString()}/day</span>
                  </div>
                  <div className="cost-item">
                    <span>🚌 Transportation</span>
                    <span>{currencySymbol}{Math.floor(((convertedMax - convertedMin) * 0.2 / itinerary.recommendedMaxDays)).toLocaleString()}/day</span>
                  </div>
                  <div className="cost-item">
                    <span>🎟️ Activities & Entry</span>
                    <span>{currencySymbol}{Math.floor(((convertedMax - convertedMin) * 0.1 / itinerary.recommendedMaxDays)).toLocaleString()}/day</span>
                  </div>
                </div>
              </div>

              {/* Nearby Attractions */}
              <div className="modal-section">
                <h4>🗺️ Nearby Attractions</h4>
                <p>This itinerary includes access to:</p>
                <div className="attractions-list">
                  {itinerary.places.map((place, idx) => (
                    <div key={idx} className="attraction-item">
                      <span>📍 {place.name}</span>
                      <span className="attraction-type">{place.description.split(' ').slice(0, 3).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Pack */}
              <div className="modal-section">
                <h4>🎒 What to Pack</h4>
                <div className="packing-list">
                  <div className="packing-item">☀️ Sunscreen & sunglasses</div>
                  <div className="packing-item">👞 Comfortable walking shoes</div>
                  <div className="packing-item">🧢 Light clothing for hot weather</div>
                  <div className="packing-item">💊 Basic medications & first aid</div>
                  <div className="packing-item">🪪 Passport & travel documents</div>
                  <div className="packing-item">📱 Portable charger for phone</div>
                </div>
              </div>

              {/* Interests Matched */}
              <div className="modal-section">
                <h4>✨ Perfect For</h4>
                <div className="interests-grid">
                  {itinerary.interests.map((interest) => (
                    <div key={interest} className="interest-badge">
                      {interest === 'heritage' && '🏛️'}
                      {interest === 'adventure' && '🧗'}
                      {interest === 'nature' && '🌿'}
                      {interest === 'culture' && '🎭'}
                      {interest === 'food' && '🍜'}
                      {interest === 'temples' && '🛕'}
                      {interest === 'beaches' && '🏖️'}
                      {interest === 'trekking' && '⛰️'}
                      {interest === 'spirituality' && '🧘'}
                      {interest === 'water-sports' && '🏄'}
                      {interest === 'photography' && '📸'}
                      {interest === 'spices' && '🌶️'}
                      {interest === 'festival' && '🎉'}
                      {interest === 'tea' && '🍵'}
                      {interest === 'sculpture' && '🗿'}
                      {interest === 'history' && '📚'}
                      {' ' + interest.replace('-', ' ')}
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Warnings & Tips */}
              <div className="modal-section info-box">
                <h4>💡 Smart Travel Tips</h4>
                <ul>
                  <li>✅ Book accommodations & activities in advance during peak season</li>
                  <li>✅ Check visa requirements before traveling to India</li>
                  <li>✅ Get travel insurance covering medical emergencies</li>
                  <li>✅ Use the currency converter above for real-time exchange rates</li>
                  <li>✅ Download offline maps for areas with limited connectivity</li>
                  <li>✅ Learn basic phrases in local languages</li>
                  <li>✅ Carry both credit cards and cash</li>
                  <li>✅ Inform your bank about travel dates to avoid card blocks</li>
                </ul>
              </div>

              {/* Booking Information */}
              <div className="modal-section booking-info">
                <h4>📞 Booking Information</h4>
                <p>To book this itinerary, you can:</p>
                <ul>
                  <li>📧 Contact local tour operators for customized packages</li>
                  <li>🌐 Use travel platforms like Airbnb, Booking.com, MakeMyTrip</li>
                  <li>✈️ Book flights separately and arrange ground transportation</li>
                  <li>🏨 Reserve hotels directly for better rates</li>
                  <li>🎫 Pre-book popular attractions online to skip queues</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="primary" onClick={() => setShowDetails(false)}>
                  ✓ Close Details
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    const message = `Check out ${itinerary.title}: ${itinerary.shortDescription}\n\nBudget: ${currencySymbol}${convertedMin}-${convertedMax}\nDuration: ${itinerary.recommendedMinDays}-${itinerary.recommendedMaxDays} days`;
                    navigator.clipboard.writeText(message);
                    alert('Itinerary details copied to clipboard!');
                  }}
                >
                  📋 Copy Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
