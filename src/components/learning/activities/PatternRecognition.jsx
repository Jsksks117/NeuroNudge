import React, { useState, useEffect } from 'react';
import '../../../styles/main.css';

const PatternRecognition = ({ onComplete }) => {
  const [patterns, setPatterns] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);

  const generatePattern = () => {
    const patternTypes = [
      {
        sequence: [2, 4, 6, 8, 10],
        answer: 12,
        description: "Add 2 to each number"
      },
      {
        sequence: [1, 3, 6, 10, 15],
        answer: 21,
        description: "Add increasing numbers (1, 2, 3, 4, 5)"
      },
      {
        sequence: [3, 6, 12, 24, 48],
        answer: 96,
        description: "Multiply by 2"
      },
      {
        sequence: [1, 4, 9, 16, 25],
        answer: 36,
        description: "Square numbers (1², 2², 3², 4², 5²)"
      },
      {
        sequence: [2, 3, 5, 8, 13],
        answer: 21,
        description: "Fibonacci sequence"
      }
    ];

    return patternTypes[Math.floor(Math.random() * patternTypes.length)];
  };

  const startGame = () => {
    setGameStarted(true);
    setIsActive(true);
    const newPatterns = Array(5).fill(null).map(() => generatePattern());
    setPatterns(newPatterns);
    setCurrentPattern(0);
    setScore(0);
  };

  const checkAnswer = () => {
    if (parseInt(userAnswer) === patterns[currentPattern].answer) {
      setScore(prev => prev + 20);
    }

    if (currentPattern < patterns.length - 1) {
      setCurrentPattern(prev => prev + 1);
      setUserAnswer('');
    } else {
      setIsActive(false);
      onComplete({ score, patternsCompleted: currentPattern + 1 });
    }
  };

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete({ score, patternsCompleted: currentPattern });
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, currentPattern, onComplete]);

  return (
    <div className="pattern-recognition">
      {!gameStarted ? (
        <div className="game-intro">
          <h2>Pattern Recognition</h2>
          <p>Find the pattern and enter the next number in the sequence. You have 60 seconds!</p>
          <button className="btn-primary" onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div className="game-container">
          <div className="game-header">
            <div className="timer">Time: {timeLeft}s</div>
            <div className="score">Score: {score}</div>
            <div className="progress">Pattern {currentPattern + 1} of {patterns.length}</div>
          </div>
          <div className="pattern-display">
            <div className="sequence">
              {patterns[currentPattern].sequence.join(', ')}
            </div>
            <div className="description">
              Hint: {patterns[currentPattern].description}
            </div>
            <div className="answer-input">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter the next number"
                disabled={!isActive}
              />
              <button 
                className="btn-primary"
                onClick={checkAnswer}
                disabled={!isActive || !userAnswer}
              >
                Check Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternRecognition; 