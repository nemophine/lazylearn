'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: { x: number; y: number };
  gameOver: boolean;
  score: number;
  highScore: number;
  isPaused: boolean;
}

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 7, y: 7 }],
    food: { x: 10, y: 10 },
    direction: { x: 1, y: 0 },
    gameOver: false,
    score: 0,
    highScore: 0,
    isPaused: false
  });

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snake_game_high_score');
    if (saved) {
      setGameState(prev => ({ ...prev, highScore: parseInt(saved) }));
    }
  }, []);

  // Generate random food position
  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: { x: 1, y: 0 },
      gameOver: false,
      score: 0,
      highScore: gameState.highScore,
      isPaused: false
    });
  }, [generateFood, gameState.highScore]);

  // Draw game on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        (segment.x + 1) * CELL_SIZE,
        (segment.y + 1) * CELL_SIZE
      );

      if (index === 0) {
        // Head
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(1, '#22c55e');
      } else {
        // Body
        gradient.addColorStop(0, '#86efac');
        gradient.addColorStop(1, '#4ade80');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
    });

    // Draw food
    const foodGradient = ctx.createRadialGradient(
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      0,
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );
    foodGradient.addColorStop(0, '#ef4444');
    foodGradient.addColorStop(1, '#dc2626');

    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw game over overlay
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

      ctx.font = '16px sans-serif';
      ctx.fillText(`Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 10);
    }

    // Draw pause overlay
    if (gameState.isPaused && !gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
  }, [gameState]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    setGameState(prevState => {
      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };

      // Move head
      head.x += prevState.direction.x;
      head.y += prevState.direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prevState, gameOver: true };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prevState, gameOver: true };
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        const newScore = prevState.score + 10;
        const newHighScore = Math.max(newScore, prevState.highScore);

        // Save high score
        localStorage.setItem('snake_game_high_score', newHighScore.toString());

        return {
          ...prevState,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
          highScore: newHighScore
        };
      } else {
        newSnake.pop();
      }

      return { ...prevState, snake: newSnake };
    });
  }, [gameState.gameOver, gameState.isPaused, generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (gameState.direction.y === 0) {
            setGameState(prev => ({ ...prev, direction: { x: 0, y: -1 } }));
          }
          break;
        case 'ArrowDown':
          if (gameState.direction.y === 0) {
            setGameState(prev => ({ ...prev, direction: { x: 0, y: 1 } }));
          }
          break;
        case 'ArrowLeft':
          if (gameState.direction.x === 0) {
            setGameState(prev => ({ ...prev, direction: { x: -1, y: 0 } }));
          }
          break;
        case 'ArrowRight':
          if (gameState.direction.x === 0) {
            setGameState(prev => ({ ...prev, direction: { x: 1, y: 0 } }));
          }
          break;
        case ' ':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.direction, gameState.gameOver]);

  // Start game loop
  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    if (!gameState.gameOver && !gameState.isPaused) {
      gameLoopRef.current = setInterval(gameLoop, INITIAL_SPEED);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.gameOver, gameState.isPaused]);

  // Draw whenever game state changes
  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.gameOver) return;

    switch (direction) {
      case 'up':
        if (gameState.direction.y === 0) {
          setGameState(prev => ({ ...prev, direction: { x: 0, y: -1 } }));
        }
        break;
      case 'down':
        if (gameState.direction.y === 0) {
          setGameState(prev => ({ ...prev, direction: { x: 0, y: 1 } }));
        }
        break;
      case 'left':
        if (gameState.direction.x === 0) {
          setGameState(prev => ({ ...prev, direction: { x: -1, y: 0 } }));
        }
        break;
      case 'right':
        if (gameState.direction.x === 0) {
          setGameState(prev => ({ ...prev, direction: { x: 1, y: 0 } }));
        }
        break;
    }
  };

  return (
    <div className="relative">
      {/* Polaroid Frame Container */}
      <div className="relative bg-white p-6 rounded-lg shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105 max-w-md mx-auto">
        {/* Photo Border with Aging Effects */}
        <div className="relative border-8 border-gray-100 rounded-lg shadow-inner overflow-hidden">
          {/* Photo Texture Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-gray-100/10 pointer-events-none"></div>
          {/* Film Grain Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`}}>
          </div>

          <Card className="overflow-hidden border-0 shadow-none relative">
            <CardContent className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 text-center relative">
              {/* Game Title */}
              <div className="mb-3">
                <h2 className="text-xl font-bold text-green-700 mb-1">🐍 SNAKE GAME</h2>
                <p className="text-sm text-gray-600">
                  {gameState.gameOver ? '💀 Game Over!' : gameState.isPaused ? '⏸️ Paused' : '🎮 Use arrow keys!'}
                </p>
              </div>

              {/* Score Board */}
              <div className="flex justify-around mb-3 text-xs">
                <div className="bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="font-bold text-yellow-700">Score: {gameState.score}</span>
                </div>
                <div className="bg-blue-100 px-3 py-1 rounded-full">
                  <span className="font-bold text-blue-700">High: {gameState.highScore}</span>
                </div>
              </div>

              {/* Game Canvas */}
              <div className="flex justify-center mb-3">
                <canvas
                  ref={canvasRef}
                  width={GRID_SIZE * CELL_SIZE}
                  height={GRID_SIZE * CELL_SIZE}
                  className="border-2 border-gray-300 rounded-lg shadow-inner"
                />
              </div>

              {/* Mobile Controls */}
              <div className="grid grid-cols-3 gap-1 max-w-xs mx-auto mb-3">
                <div></div>
                <Button
                  size="sm"
                  onClick={() => handleCanvasClick('up')}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
                >
                  ↑
                </Button>
                <div></div>
                <Button
                  size="sm"
                  onClick={() => handleCanvasClick('left')}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
                >
                  ←
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleCanvasClick('down')}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
                >
                  ↓
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleCanvasClick('right')}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
                >
                  →
                </Button>
              </div>

              {/* Game Controls */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-2 border-yellow-300 shadow-md"
                >
                  {gameState.isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </Button>
                <Button
                  onClick={initializeGame}
                  size="sm"
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white border-2 border-green-300 shadow-md"
                >
                  🔄 New Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Polaroid Bottom Label */}
        <div className="bg-white mt-2 p-2 text-center">
          <p className="text-xs font-serif text-gray-600 italic">Snake Adventure</p>
          <p className="text-xs text-gray-500">Classic game!</p>
        </div>
      </div>

      {/* Shadow Effect */}
      <div className="absolute inset-0 bg-black/10 blur-xl transform translate-y-2 translate-x-1 -z-10"></div>
    </div>
  );
}