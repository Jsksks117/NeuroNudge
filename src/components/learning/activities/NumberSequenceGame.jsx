import React, { useState, useEffect } from 'react';
import './NumberSequenceGame.css';

const NumberSequenceGame = ({ onComplete }) => {
  const [numbers, setNumbers] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [gameState, setGameState] = useState('intro'); // intro, memorizing, input, result
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Generate random numbers between 0-9
  const generateNumbers = () => {
    const newNumbers = [];
    for (let i = 0; i < 10; i++) {
      newNumbers.push(Math.floor(Math.random() * 10));
    }
    return newNumbers;
  };

  const startGame = () => {
    setNumbers(generateNumbers());
    setGameState('memorizing');
    setTimeLeft(30);
    setUserInput('');
    setScore(0);
    setFeedback('');
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'memorizing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('input');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userNumbers = userInput.split('').map(num => parseInt(num));
    
    // Check if numbers match
    let correctCount = 0;
    for (let i = 0; i < numbers.length; i++) {
      if (userNumbers[i] === numbers[i]) {
        correctCount++;
      }
    }

    const accuracy = (correctCount / numbers.length) * 100;
    setScore(accuracy);
    
    // Generate feedback based on performance
    if (accuracy === 100) {
      setFeedback("Perfect! You remembered all the numbers correctly! 🌟");
    } else if (accuracy >= 80) {
      setFeedback("Great job! You remembered most of the numbers! 🎉");
    } else if (accuracy >= 60) {
      setFeedback("Good effort! Keep practicing to improve! 💪");
    } else {
      setFeedback("Don't worry! Memory gets better with practice! Keep trying! 🌈");
    }

    setGameState('result');
  };

  const handlePlayAgain = () => {
    startGame();
  };

  if (gameState === 'intro') {
    return (
      <div className="number-sequence-game">
        <h2>Number Memory Challenge</h2>
        <div className="game-instructions">
          <p>You will see 10 random numbers for 30 seconds.</p>
          <p>Try to remember them in order!</p>
          <p>After the time is up, enter the numbers you remember.</p>
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'memorizing') {
    return (
      <div className="number-sequence-game">
        <h2>Memorize These Numbers</h2>
        <div className="timer">Time Left: {timeLeft} seconds</div>
        <div className="numbers-display">
          {numbers.map((num, index) => (
            <span key={index} className="number-box">
              {num}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'input') {
    return (
      <div className="number-sequence-game">
        <h2>Enter the Numbers You Remember</h2>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
            placeholder="Enter 10 numbers"
            maxLength={10}
            className="number-input"
          />
          <button type="submit" className="submit-button">
            Check Answer
          </button>
        </form>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="number-sequence-game">
        <h2>Results</h2>
        <div className="results-container">
          <div className="score-display">
            <p>Your Score: {score.toFixed(1)}%</p>
            <p className="feedback">{feedback}</p>
          </div>
          <div className="comparison">
            <div className="sequence">
              <h3>Original Sequence:</h3>
              <div className="numbers-display">
                {numbers.map((num, index) => (
                  <span key={index} className="number-box">
                    {num}
                  </span>
                ))}
              </div>
            </div>
            <div className="sequence">
              <h3>Your Sequence:</h3>
              <div className="numbers-display">
                {userInput.split('').map((num, index) => (
                  <span 
                    key={index} 
                    className={`number-box ${parseInt(num) === numbers[index] ? 'correct' : 'incorrect'}`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button className="play-again-button" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    );
  }
};

export default NumberSequenceGame; 