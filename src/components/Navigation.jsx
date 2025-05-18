import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';

const Navigation = ({ accessibilityMode = { highContrast: false, dyslexiaFriendly: false }, toggleAccessibility = () => {}, changeFontSize = () => {} }) => {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Learning Platform</Link>
        </div>
        
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/activities">Activities</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/parentprogress">Child Progress</Link></li>
          <li><Link to="/auth">Login</Link></li>
        </ul>

        <div className="nav-actions">
          <button 
            onClick={() => toggleAccessibility('highContrast')}
            className={`accessibility-btn ${accessibilityMode?.highContrast ? 'active' : ''}`}
            aria-label="Toggle high contrast mode"
          >
            {accessibilityMode?.highContrast ? '🌙' : '☀️'}
          </button>
          
          <button 
            onClick={() => toggleAccessibility('dyslexiaFriendly')}
            className={`accessibility-btn ${accessibilityMode?.dyslexiaFriendly ? 'active' : ''}`}
            aria-label="Toggle dyslexia-friendly font"
          >
            {accessibilityMode?.dyslexiaFriendly ? '📖' : '📚'}
          </button>
          
          <div className="font-size-controls">
            <button onClick={() => changeFontSize('small')} aria-label="Small font">A</button>
            <button onClick={() => changeFontSize('medium')} aria-label="Medium font">A</button>
            <button onClick={() => changeFontSize('large')} aria-label="Large font">A</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 