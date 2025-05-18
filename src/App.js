import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Activities from './components/learning/LearningActivities';
import Dashboard from './components/dashboard/Dashboard';
import Auth from './pages/Auth';
import ParentProgress from './components/parent/ParentProgress';
import './styles/main.css';

const App = () => {
  const [accessibilityMode, setAccessibilityMode] = useState({
    highContrast: false,
    dyslexiaFriendly: false,
    fontSize: 'medium'
  });

  const toggleAccessibility = (mode) => {
    setAccessibilityMode(prev => ({
      ...prev,
      [mode]: !prev[mode]
    }));
  };

  const changeFontSize = (size) => {
    setAccessibilityMode(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  const handleAuthSuccess = (role) => {
    console.log('Auth successful, user role:', role);
    // Add any additional logic needed after successful authentication
  };

  return (
    <Router>
      <div className={`App ${accessibilityMode.highContrast ? 'high-contrast' : ''} 
                    ${accessibilityMode.dyslexiaFriendly ? 'dyslexia-friendly' : ''} 
                    font-size-${accessibilityMode.fontSize}`}>
        <Navigation 
          accessibilityMode={accessibilityMode}
          toggleAccessibility={toggleAccessibility}
          changeFontSize={changeFontSize}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/parentprogress" element={<ParentProgress />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;