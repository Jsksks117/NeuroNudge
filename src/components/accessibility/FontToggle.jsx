import React, { useState, useEffect } from 'react';
import '@fontsource/opendyslexic';

const FontToggle = () => {
  const [isDyslexic, setIsDyslexic] = useState(
    localStorage.getItem('dyslexicFont') === 'true'
  );

  useEffect(() => {
    if (isDyslexic) {
      document.body.style.fontFamily = '"OpenDyslexic", sans-serif';
      document.body.classList.add('dyslexic-mode');
    } else {
      document.body.style.fontFamily = 'inherit';
      document.body.classList.remove('dyslexic-mode');
    }
    localStorage.setItem('dyslexicFont', isDyslexic);
  }, [isDyslexic]);

  return (
    <button 
      onClick={() => setIsDyslexic(!isDyslexic)}
      className="font-toggle"
    >
      {isDyslexic ? 'Standard Font' : 'Dyslexia Font'}
    </button>
  );
};

export default FontToggle;