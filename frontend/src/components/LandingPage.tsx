import React, { useState } from 'react';
import '../styles/landing.css';

interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { code: 'EU', name: 'Europe', currency: 'EUR', flag: '🇪🇺' },
  { code: 'JP', name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', currency: 'THB', flag: '🇹🇭' },
  { code: 'IN', name: 'India', currency: 'INR', flag: '🇮🇳' },
  { code: 'DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', currency: 'EUR', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', currency: 'EUR', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', flag: '🇳🇱' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', flag: '🇰🇷' },
  { code: 'CN', name: 'China', currency: 'CNY', flag: '🇨🇳' },
  { code: 'SG', name: 'Malaysia', currency: 'MYR', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', currency: 'VND', flag: '🇻🇳' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', flag: '🇳🇿' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', flag: '🇧🇷' },
  { code: 'AE', name: 'UAE', currency: 'AED', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', flag: '🇸🇦' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
];

interface LandingPageProps {
  onSelectNationality: (country: Country) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectNationality }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [proceedClicked, setProceedClicked] = useState(false);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleProceed = () => {
    if (selectedCountry) {
      setProceedClicked(true);
      setTimeout(() => {
        onSelectNationality(selectedCountry);
      }, 1200);
    }
  };

  return (
    <div className="landing-container">
      {/* Animated background gradient */}
      <div className="landing-bg-gradient"></div>

      {/* Content */}
      <div className="landing-content">
        {/* Header with animation */}
        <div className={`landing-header ${selectedCountry && !proceedClicked ? 'shrink' : ''} ${proceedClicked ? 'fade-out' : ''}`}>
          <h1 className="landing-title">
            <span className="title-word">Discover</span>
            <span className="title-word">India</span>
            <span className="title-word">Like</span>
            <span className="title-word">Never</span>
            <span className="title-word">Before</span>
          </h1>
          <p className="landing-subtitle">
            Plan your perfect Indian adventure with personalized itineraries
          </p>
        </div>

        {/* Nationality Selection Section */}
        <div className={`nationality-section ${selectedCountry && !proceedClicked ? 'shrink' : ''} ${proceedClicked ? 'fade-out' : ''}`}>
          <div className="nationality-prompt">
            <p className="prompt-text">Where are you traveling from?</p>
            <p className="prompt-subtext">Select your country to see prices in your currency</p>
          </div>

          <div className="countries-grid">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                className={`country-card ${selectedCountry?.code === country.code ? 'selected' : ''} ${
                  hoveredCode === country.code ? 'hovered' : ''
                }`}
                onClick={() => handleSelectCountry(country)}
                onMouseEnter={() => setHoveredCode(country.code)}
                onMouseLeave={() => setHoveredCode(null)}
                disabled={selectedCountry !== null && selectedCountry?.code !== country.code}
              >
                <div className="country-info">
                  <span className="country-name">{country.name}</span>
                  <span className="country-currency">{country.currency}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Greeting screen with Proceed button */}
        {selectedCountry && !proceedClicked && (
          <div className="greeting-overlay fade-in">
            <div className="greeting-content slide-up">
              <div className="greeting-flag-large pulse">{selectedCountry.currency}</div>
              <h2 className="greeting-title">Welcome to India, {selectedCountry.name}! 🎉</h2>
              <p className="greeting-subtitle">
                We're thrilled to help you plan your Indian adventure. All prices will be shown in <span className="currency-highlight">{selectedCountry.currency}</span> for your convenience.
              </p>
              
              <div className="greeting-features">
                <div className="greeting-feature-item">
                  <span className="feature-number">25+</span>
                  <span className="feature-label">Destinations</span>
                </div>
                <div className="greeting-feature-item">
                  <span className="feature-number">✈️</span>
                  <span className="feature-label">Smart Matching</span>
                </div>
                <div className="greeting-feature-item">
                  <span className="feature-number">💰</span>
                  <span className="feature-label">Your Currency</span>
                </div>
              </div>

              <button className="proceed-button" onClick={handleProceed}>
                <span className="button-text">Start Exploring</span>
                <span className="button-arrow">→</span>
              </button>

              <p className="greeting-hint">You can always change your country later</p>
            </div>
          </div>
        )}

        {/* Final loading state */}
        {proceedClicked && (
          <div className="final-transition fade-in">
            <div className="transition-content">
              <div className="transition-flag bounce">{selectedCountry?.currency}</div>
              <p className="transition-text">Loading your personalized experience...</p>
              <div className="transition-loader"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
