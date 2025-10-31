'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  destroyed: boolean;
}

interface GameState {
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[];
  score: number;
  lives: number;
  gameOver: boolean;
  isPaused: boolean;
  level: number;
  highScore: number;
}

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 400;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 35;
const BRICK_HEIGHT = 15;
const BRICK_PADDING = 2;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = 15;

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>({
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 60, dx: 3, dy: -3, radius: 8 },
    paddle: { x: CANVAS_WIDTH / 2 - 40, y: CANVAS_HEIGHT - 20, width: 80, height: 10 },
    bricks: [],
    score: 0,
    lives: 3,
    gameOver: false,
    isPaused: false,
    level: 1,
    highScore: 0
  });

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('breakout_game_high_score');
    if (saved) {
      setGameState(prev => ({ ...prev, highScore: parseInt(saved) }));
    }
  }, []);

  // Initialize bricks
  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: COLORS[row],
          destroyed: false
        });
      }
    }
    return newBricks;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    setGameState(prev => ({
      ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 60, dx: 3, dy: -3, radius: 8 },
      paddle: { x: CANVAS_WIDTH / 2 - 40, y: CANVAS_HEIGHT - 20, width: 80, height: 10 },
      bricks: initializeBricks(),
      score: 0,
      lives: 3,
      gameOver: false,
      isPaused: false,
      level: 1,
      highScore: prev.highScore
    }));
  }, [initializeBricks]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameState.gameOver || gameState.isPaused) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const paddleX = Math.max(0, Math.min(CANVAS_WIDTH - gameState.paddle.width, mouseX - gameState.paddle.width / 2));

      setGameState(prev => ({
        ...prev,
        paddle: { ...prev.paddle, x: paddleX }
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameState.gameOver, gameState.isPaused, gameState.paddle.width]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    setGameState(prevState => {
      const newState = { ...prevState };
      const { ball, paddle, bricks } = newState;

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with walls
      if (ball.x + ball.radius > CANVAS_WIDTH || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // Ball collision with paddle
      if (
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        ball.dy = -ball.dy;
        // Add some spin based on where the ball hits the paddle
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = 8 * (hitPos - 0.5);
      }

      // Ball collision with bricks
      let hitBrick = false;
      bricks.forEach((brick, index) => {
        if (!brick.destroyed &&
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height) {
          brick.destroyed = true;
          ball.dy = -ball.dy;
          hitBrick = true;

          // Update score
          newState.score += 10 * newState.level;

          // Check if all bricks are destroyed
          if (bricks.every(b => b.destroyed)) {
            // Level up
            newState.level++;
            ball.dx *= 1.2;
            ball.dy *= 1.2;
            // Reset bricks for next level
            initializeBricks().forEach((newBrick, i) => {
              if (bricks[i]) {
                bricks[i] = newBrick;
              }
            });
          }
        }
      });

      // Ball out of bounds (lost life)
      if (ball.y - ball.radius > CANVAS_HEIGHT) {
        newState.lives--;
        if (newState.lives <= 0) {
          newState.gameOver = true;
          const newHighScore = Math.max(newState.score, newState.highScore);
          newState.highScore = newHighScore;
          localStorage.setItem('breakout_game_high_score', newHighScore.toString());
        } else {
          // Reset ball position
          ball.x = CANVAS_WIDTH / 2;
          ball.y = CANVAS_HEIGHT - 60;
          ball.dx = 3;
          ball.dy = -3;
        }
      }

      return newState;
    });
  }, [gameState.gameOver, gameState.isPaused, initializeBricks]);

  // Draw game on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    gameState.bricks.forEach(brick => {
      if (!brick.destroyed) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

        // Add brick highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(brick.x, brick.y, brick.width, 2);
      }
    });

    // Draw paddle
    const gradient = ctx.createLinearGradient(
      gameState.paddle.x,
      gameState.paddle.y,
      gameState.paddle.x,
      gameState.paddle.y + gameState.paddle.height
    );
    gradient.addColorStop(0, '#60a5fa');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(gameState.paddle.x, gameState.paddle.y, gameState.paddle.width, gameState.paddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw game over overlay
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

      ctx.font = '16px sans-serif';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
    }

    // Draw pause overlay
    if (gameState.isPaused && !gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }, [gameState]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      gameLoop();
      draw();
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop, draw]);

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
            <CardContent className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 text-center relative">
              {/* Game Title */}
              <div className="mb-3">
                <h2 className="text-xl font-bold text-blue-700 mb-1">🎮 BREAKOUT</h2>
                <p className="text-sm text-gray-600">
                  {gameState.gameOver ? '💀 Game Over!' : gameState.isPaused ? '⏸️ Paused' : '🎯 Move mouse to control!'}
                </p>
              </div>

              {/* Score Board */}
              <div className="flex justify-around mb-3 text-xs">
                <div className="bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="font-bold text-yellow-700">Score: {gameState.score}</span>
                </div>
                <div className="bg-red-100 px-3 py-1 rounded-full">
                  <span className="font-bold text-red-700">Lives: {gameState.lives}</span>
                </div>
                <div className="bg-purple-100 px-3 py-1 rounded-full">
                  <span className="font-bold text-purple-700">Level: {gameState.level}</span>
                </div>
                {gameState.highScore > 0 && (
                  <div className="bg-green-100 px-3 py-1 rounded-full">
                    <span className="font-bold text-green-700">Best: {gameState.highScore}</span>
                  </div>
                )}
              </div>

              {/* Game Canvas */}
              <div className="flex justify-center mb-3">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="border-2 border-gray-300 rounded-lg shadow-inner cursor-none"
                />
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

              <div className="mt-2 text-xs text-gray-500">
                Move mouse to control paddle • Space to pause
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Polaroid Bottom Label */}
        <div className="bg-white mt-2 p-2 text-center">
          <p className="text-xs font-serif text-gray-600 italic">Arcade Classic</p>
          <p className="text-xs text-gray-500">Break all bricks!</p>
        </div>
      </div>

      {/* Shadow Effect */}
      <div className="absolute inset-0 bg-black/10 blur-xl transform translate-y-2 translate-x-1 -z-10"></div>
    </div>
  );
}