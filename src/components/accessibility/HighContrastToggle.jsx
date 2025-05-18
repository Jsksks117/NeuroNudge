import React, { useState, useEffect } from 'react';

const HighContrastToggle = () => {
  const [isHighContrast, setIsHighContrast] = useState(
    localStorage.getItem('highContrast') === 'true'
  );

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  return (
    <button
      onClick={() => setIsHighContrast(!isHighContrast)}
      className="contrast-toggle"
    >
      {isHighContrast ? 'Normal Mode' : 'High Contrast'}
    </button>
  );
};

export default HighContrastToggle;