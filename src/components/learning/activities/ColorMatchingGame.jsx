import React, { useState, useEffect } from 'react';
import './ColorMatchingGame.css';

const ColorMatchingGame = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [difficulty, setDifficulty] = useState('easy'); // easy, medium, hard
  const [level, setLevel] = useState(1);

  // Colors for the cards - more colors for higher difficulty
  const colors = {
    easy: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ],
    medium: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
      '#E74C3C', '#2ECC71', '#F1C40F', '#1ABC9C'
    ],
    hard: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
      '#E74C3C', '#2ECC71', '#F1C40F', '#1ABC9C',
      '#34495E', '#16A085', '#D35400', '#8E44AD'
    ]
  };

  // Time limits based on difficulty
  const timeLimits = {
    easy: 120,
    medium: 90,
    hard: 60
  };

  // Generate cards with pairs
  const generateCards = () => {
    const selectedColors = colors[difficulty];
    const cardPairs = [...selectedColors, ...selectedColors];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((color, index) => ({
        id: index,
        color,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
    setTimeLeft(timeLimits[difficulty]);
  };

  const startGame = () => {
    generateCards();
    setGameStarted(true);
    setIsActive(true);
    setMoves(0);
    setMatchedPairs([]);
    setFlippedCards([]);
  };

  // Timer effect with improved accuracy
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const newTimeLeft = timeLimits[difficulty] - elapsedTime;
        
        if (newTimeLeft <= 0) {
          setIsActive(false);
          handleGameComplete();
          clearInterval(timer);
        } else {
          setTimeLeft(newTimeLeft);
        }
      }, 100); // Update more frequently for smoother countdown
    }
    return () => clearInterval(timer);
  }, [isActive, difficulty]);

  const handleCardClick = (clickedCard) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(clickedCard.id) ||
      clickedCard.isMatched ||
      !isActive
    ) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards.map(id => 
        cards.find(card => card.id === id)
      );

      if (firstCard.color === secondCard.color) {
        setMatchedPairs(prev => [...prev, firstCard.color]);
        setCards(prev => prev.map(card =>
          card.color === firstCard.color ? { ...card, isMatched: true } : card
        ));
        setFlippedCards([]);

        // Check if all pairs are matched
        if (matchedPairs.length + 1 === colors[difficulty].length) {
          handleGameComplete();
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            newFlippedCards.includes(card.id) ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameComplete = () => {
    setIsActive(false);
    const score = (matchedPairs.length / colors[difficulty].length) * 100;
    const timeBonus = Math.max(0, timeLeft * 0.5);
    const finalScore = score + timeBonus;

    onComplete({
      score: finalScore,
      moves,
      timeSpent: timeLimits[difficulty] - timeLeft,
      pairsMatched: matchedPairs.length,
      difficulty,
      level
    });

    // Increase difficulty if score is good
    if (finalScore >= 80) {
      if (difficulty === 'easy') {
        setDifficulty('medium');
      } else if (difficulty === 'medium') {
        setDifficulty('hard');
      }
      setLevel(prev => prev + 1);
    }
  };

  if (!gameStarted) {
    return (
      <div className="color-matching-game">
        <h2>Color Matching Memory Game</h2>
        <div className="game-instructions">
          <p>Match pairs of colored cards by remembering their positions!</p>
          <p>Difficulty: {difficulty.toUpperCase()}</p>
          <p>Level: {level}</p>
          <p>Time: {timeLimits[difficulty]} seconds</p>
          <p>Cards: {colors[difficulty].length * 2}</p>
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="color-matching-game">
      <div className="game-header">
        <h2>Color Matching Memory Game</h2>
        <div className="game-stats">
          <div className="stat">Time: {timeLeft}s</div>
          <div className="stat">Moves: {moves}</div>
          <div className="stat">Pairs: {matchedPairs.length}/{colors[difficulty].length}</div>
          <div className="stat">Level: {level}</div>
          <div className="stat">Difficulty: {difficulty}</div>
        </div>
      </div>

      <div className="cards-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div 
                className="card-back"
                style={{ backgroundColor: card.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {!isActive && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Pairs Matched: {matchedPairs.length}/{colors[difficulty].length}</p>
          <p>Total Moves: {moves}</p>
          <p>Time Remaining: {timeLeft}s</p>
          <button className="play-again-button" onClick={startGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorMatchingGame; 