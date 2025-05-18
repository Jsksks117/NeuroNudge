import React, { useState, useEffect } from 'react';
import '../../../styles/main.css';

const FocusChallenge = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds challenge
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [targets, setTargets] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Generate random targets
  const generateTargets = () => {
    const newTargets = [];
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * 80 + 10, // Random position between 10% and 90%
        y: Math.random() * 80 + 10,
        clicked: false
      });
    }
    setTargets(newTargets);
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setIsActive(true);
    generateTargets();
  };

  // Handle target click
  const handleTargetClick = (targetId) => {
    if (!isActive) return;

    setTargets(prevTargets => 
      prevTargets.map(target => 
        target.id === targetId 
          ? { ...target, clicked: true }
          : target
      )
    );

    setScore(prevScore => prevScore + 10);

    // Generate new target if all are clicked
    if (targets.every(target => target.clicked)) {
      generateTargets();
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete({ score, timeSpent: 60 - timeLeft });
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, onComplete]);

  return (
    <div className="focus-challenge">
      {!gameStarted ? (
        <div className="game-intro">
          <h2>Focus Challenge</h2>
          <p>Click on the targets as they appear. Try to click as many as possible in 60 seconds!</p>
          <button className="btn-primary" onClick={startGame}>Start Challenge</button>
        </div>
      ) : (
        <div className="game-container">
          <div className="game-header">
            <div className="timer">Time: {timeLeft}s</div>
            <div className="score">Score: {score}</div>
          </div>
          <div className="game-area">
            {targets.map(target => (
              !target.clicked && (
                <div
                  key={target.id}
                  className="target"
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                  }}
                  onClick={() => handleTargetClick(target.id)}
                />
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusChallenge; 