import React, { useState, useEffect } from 'react';
import '../../../styles/main.css';

const MemoryGame = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isActive, setIsActive] = useState(false);

  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  const generateCards = () => {
    const cardPairs = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(cardPairs);
  };

  const startGame = () => {
    setGameStarted(true);
    setIsActive(true);
    generateCards();
    setMoves(0);
    setMatchedPairs([]);
    setFlippedCards([]);
  };

  const handleCardClick = (clickedCard) => {
    if (
      !isActive ||
      flippedCards.length === 2 ||
      flippedCards.includes(clickedCard.id) ||
      matchedPairs.includes(clickedCard.id)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards.map(id =>
        cards.find(card => card.id === id)
      );

      if (firstCard.emoji === secondCard.emoji) {
        setMatchedPairs(prev => [...prev, firstCard.id, secondCard.id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              newFlippedCards.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 || matchedPairs.length === cards.length) {
      setIsActive(false);
      onComplete({
        moves,
        pairsMatched: matchedPairs.length / 2,
        timeSpent: 120 - timeLeft
      });
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, moves, matchedPairs.length, cards.length, onComplete]);

  return (
    <div className="memory-game">
      {!gameStarted ? (
        <div className="game-intro">
          <h2>Memory Game</h2>
          <p>Match the pairs of cards. Find all pairs before time runs out!</p>
          <button className="btn-primary" onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div className="game-container">
          <div className="game-header">
            <div className="timer">Time: {timeLeft}s</div>
            <div className="moves">Moves: {moves}</div>
            <div className="pairs">Pairs: {matchedPairs.length / 2}</div>
          </div>
          <div className="cards-grid">
            {cards.map(card => (
              <div
                key={card.id}
                className={`card ${card.isFlipped ? 'flipped' : ''} ${
                  matchedPairs.includes(card.id) ? 'matched' : ''
                }`}
                onClick={() => handleCardClick(card)}
              >
                <div className="card-inner">
                  <div className="card-front">?</div>
                  <div className="card-back">{card.emoji}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame; 