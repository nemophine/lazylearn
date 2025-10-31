'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onGameComplete?: (score: number, moves: number) => void;
}

const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎲', '🎰'];

export default function MemoryGame({ onGameComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  // Initialize cards
  const initializeGame = useCallback(() => {
    const gameCards: Card[] = [];
    EMOJIS.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setSelectedCards([]);
    setMoves(0);
    setScore(0);
    setGameStarted(true);
    setGameWon(false);
    setCombo(0);
  }, []);

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('memory_game_best_score');
    if (saved) {
      setBestScore(parseInt(saved));
    }
    initializeGame();
  }, [initializeGame]);

  // Handle card click
  const handleCardClick = useCallback((cardId: number) => {
    if (selectedCards.length === 2) return;
    if (cards[cardId].isMatched) return;
    if (selectedCards.includes(cardId)) return;

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    // Flip cards
    setCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    // Check for match when two cards are selected
    if (newSelectedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newSelectedCards;

      setTimeout(() => {
        if (cards[first].emoji === cards[second].emoji) {
          // Match found
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          ));
          setCombo(prev => prev + 1);
          setScore(prev => prev + 100 * (combo + 1));
        } else {
          // No match
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setCombo(0);
        }
        setSelectedCards([]);
      }, 1000);
    }
  }, [selectedCards, cards, combo]);

  // Check for win
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched) && gameStarted) {
      setGameWon(true);
      const finalScore = score + Math.max(0, 1000 - moves * 10);
      setScore(finalScore);

      // Save best score
      if (!bestScore || finalScore > bestScore) {
        setBestScore(finalScore);
        localStorage.setItem('memory_game_best_score', finalScore.toString());
      }

      onGameComplete?.(finalScore, moves);
    }
  }, [cards, gameStarted, score, moves, bestScore, onGameComplete]);

  const getGameMessage = () => {
    if (!gameStarted) return "เริ่มเกมใหม่!";
    if (gameWon) return "🎉 คุณชนะแล้ว!";
    if (combo > 0) return `🔥 Combo x${combo}!`;
    return "🧠 จับคู่ไพล์!";
  };

  return (
    <div className="relative">
      {/* Polaroid Frame Container */}
      <div className="relative bg-white p-6 rounded-lg shadow-2xl transform -rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105 max-w-md mx-auto">
        {/* Photo Border with Aging Effects */}
        <div className="relative border-8 border-gray-100 rounded-lg shadow-inner overflow-hidden">
          {/* Photo Texture Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-gray-100/10 pointer-events-none"></div>
          {/* Film Grain Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`}}>
          </div>

          <Card className="overflow-hidden border-0 shadow-none relative">
            <CardContent className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 text-center relative">
              {/* Game Title */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-purple-700 mb-1">🧠 MEMORY GAME</h2>
                <p className="text-sm text-gray-600">{getGameMessage()}</p>
              </div>

              {/* Score Board */}
              <div className="flex justify-around mb-4 text-xs">
                <div className="bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="font-bold text-yellow-700">Moves: {moves}</span>
                </div>
                <div className="bg-blue-100 px-3 py-1 rounded-full">
                  <span className="font-bold text-blue-700">Score: {score}</span>
                </div>
                {bestScore && (
                  <div className="bg-purple-100 px-3 py-1 rounded-full">
                    <span className="font-bold text-purple-700">Best: {bestScore}</span>
                  </div>
                )}
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched}
                    className={`aspect-square rounded-lg text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                      card.isFlipped || card.isMatched
                        ? card.isMatched
                          ? 'bg-gradient-to-br from-green-400 to-green-500 text-white scale-95 opacity-80'
                          : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white rotate-3'
                        : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 hover:from-gray-400 hover:to-gray-500'
                    }`}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : '?'}
                  </button>
                ))}
              </div>

              {/* Combo Display */}
              {combo > 1 && (
                <div className="mb-3">
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1">
                    🔥 COMBO x{combo}!
                  </Badge>
                </div>
              )}

              {/* Game Controls */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={initializeGame}
                  size="sm"
                  className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white border-2 border-purple-300 shadow-md"
                >
                  🔄 เริ่มใหม่
                </Button>
                {gameWon && (
                  <div className="text-sm font-bold text-green-600">
                    🏆 คะแนน: {score}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Polaroid Bottom Label */}
        <div className="bg-white mt-2 p-2 text-center">
          <p className="text-xs font-serif text-gray-600 italic">Memory Challenge</p>
          <p className="text-xs text-gray-500">Find all pairs!</p>
        </div>
      </div>

      {/* Shadow Effect */}
      <div className="absolute inset-0 bg-black/10 blur-xl transform translate-y-2 translate-x-1 -z-10"></div>

      {/* Win Celebration */}
      {gameWon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-yellow-400 text-white px-6 py-3 rounded-lg shadow-2xl transform -rotate-2 animate-bounce">
            <p className="text-2xl font-bold">🎉 WIN! 🎉</p>
            <p className="text-sm">Score: {score}</p>
          </div>
        </div>
      )}
    </div>
  );
}