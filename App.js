import React, { useState, useEffect } from "react";
import "./App.css";

const cardsArray = [
  { id: 1, value: "🍎" },
  { id: 2, value: "🍌" },
  { id: 3, value: "🍇" },
  { id: 4, value: "🍓" },
  { id: 5, value: "🍍" },
  { id: 6, value: "🥝" },
];

// Duplicate and shuffle cards
function generateCards() {
  const doubleCards = [...cardsArray, ...cardsArray];
  for (let i = doubleCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubleCards[i], doubleCards[j]] = [doubleCards[j], doubleCards[i]];
  }
  return doubleCards.map((card, idx) => ({
    ...card,
    uniqueId: idx,
    flipped: false,
    matched: false,
  }));
}

function App() {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (flippedIndexes.length === 2) {
      setIsChecking(true);
      const [firstIdx, secondIdx] = flippedIndexes;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...card, matched: true }
                : card
            )
          );
          setFlippedIndexes([]);
          setIsChecking(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedIndexes([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedIndexes, cards]);

  const handleFlip = (idx) => {
    if (isChecking || cards[idx].flipped || cards[idx].matched) return;
    if (flippedIndexes.length === 2) return;

    setCards((prevCards) =>
      prevCards.map((card, i) =>
        i === idx ? { ...card, flipped: true } : card
      )
    );
    setFlippedIndexes((prev) => [...prev, idx]);
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedIndexes([]);
    setIsChecking(false);
  };

  const isGameWon = cards.every((card) => card.matched);

  return (
    <div className="app">
      <h1>Flip Cards Memory Game</h1>
      <div className="grid">
        {cards.map((card, idx) => (
          <div
            className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
            key={card.uniqueId}
            onClick={() => handleFlip(idx)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.value}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={resetGame} className="reset-btn">
        Reset Game
      </button>
      {isGameWon && <div className="message">🎉 You Won! 🎉</div>}
    </div>
  );
}

export default App;
