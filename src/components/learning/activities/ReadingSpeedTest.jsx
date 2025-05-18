import React, { useState, useEffect } from 'react';
import '../../../styles/main.css';

const ReadingSpeedTest = ({ onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.",
    "Learning to read quickly and accurately is an important skill. Practice makes perfect!",
    "Reading helps us learn new things and understand the world better. Keep practicing!",
    "The more you read, the better you become. Don't give up, keep trying!",
    "Reading is fun and helps your brain grow. Let's practice together!"
  ];

  const startGame = () => {
    setGameStarted(true);
    setIsActive(true);
    setCurrentText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    setUserInput('');
  };

  const calculateWPM = (text, timeInSeconds) => {
    const words = text.trim().split(/\s+/).length;
    return Math.round((words / timeInSeconds) * 60);
  };

  const calculateAccuracy = (original, input) => {
    const originalWords = original.trim().split(/\s+/);
    const inputWords = input.trim().split(/\s+/);
    let correctWords = 0;

    for (let i = 0; i < Math.min(originalWords.length, inputWords.length); i++) {
      if (originalWords[i] === inputWords[i]) {
        correctWords++;
      }
    }

    return Math.round((correctWords / originalWords.length) * 100);
  };

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const finalWpm = calculateWPM(userInput, 60);
      const finalAccuracy = calculateAccuracy(currentText, userInput);
      setWpm(finalWpm);
      setAccuracy(finalAccuracy);
      onComplete({ wpm: finalWpm, accuracy: finalAccuracy });
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, userInput, currentText, onComplete]);

  return (
    <div className="reading-speed-test">
      {!gameStarted ? (
        <div className="game-intro">
          <h2>Reading Speed Test</h2>
          <p>Type the text you see as quickly and accurately as possible. You have 60 seconds!</p>
          <button className="btn-primary" onClick={startGame}>Start Test</button>
        </div>
      ) : (
        <div className="game-container">
          <div className="game-header">
            <div className="timer">Time: {timeLeft}s</div>
            <div className="stats">
              <span>WPM: {wpm}</span>
              <span>Accuracy: {accuracy}%</span>
            </div>
          </div>
          <div className="text-display">
            <p>{currentText}</p>
          </div>
          <textarea
            className="text-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Start typing here..."
            disabled={!isActive}
          />
        </div>
      )}
    </div>
  );
};

export default ReadingSpeedTest; 