'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface TamagotchiState {
  name: string;
  petType: 'cat' | 'dog' | 'owl' | 'panda';
  hunger: number;
  happiness: number;
  cleanliness: number;
  energy: number;
  health: number;
  age: number;
  weight: number;
  discipline: number;
  coins: number;
  isAsleep: boolean;
  isSick: boolean;
  isAlive: boolean;
  lastUpdate: number;
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'excited' | 'sleeping';
  currentActivity: 'idle' | 'eating' | 'playing' | 'sleeping' | 'bathing' | 'sick';
}

interface TamagotchiProps {
  isFocusActive?: boolean;
  focusTime?: number;
  onStatsUpdate?: (stats: Partial<TamagotchiState>) => void;
}

const STORAGE_KEY = 'tamagotchi_state';

const clamp = (n: number): number => Math.max(0, Math.min(100, n));

export default function Tamagotchi({
  isFocusActive = false,
  focusTime = 0,
  onStatsUpdate
}: TamagotchiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const [state, setState] = useState<TamagotchiState>({
    name: 'MOCHI',
    petType: 'cat',
    hunger: 70,
    happiness: 80,
    cleanliness: 75,
    energy: 85,
    health: 90,
    age: 0,
    weight: 45,
    discipline: 50,
    coins: 100,
    isAsleep: false,
    isSick: false,
    isAlive: true,
    lastUpdate: Date.now(),
    mood: 'happy',
    currentActivity: 'idle'
  });

  const [showShop, setShowShop] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [poopCount, setPoopCount] = useState(0);
  const [showMessage, setShowMessage] = useState('');
  const [petPosition, setPetPosition] = useState({ x: 150, y: 100 });
  const [isJumping, setIsJumping] = useState(false);

  // Memory game state
  const [memoryCards, setMemoryCards] = useState<Array<{id: number, emoji: string, isFlipped: boolean, isMatched: boolean}>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gameSize, setGameSize] = useState(4);

  // Load saved state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch (e) {
      console.error('Failed to load tamagotchi state:', e);
    }
  }, []);

  // Save state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save tamagotchi state:', e);
    }
    onStatsUpdate?.(state);
  }, [state, onStatsUpdate]);

  // Real-time stat decay
  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isAlive || state.isAsleep) return;

      setState(prev => {
        const newState = { ...prev };
        newState.hunger = clamp(prev.hunger - 2);
        newState.happiness = clamp(prev.happiness - 1);
        newState.cleanliness = clamp(prev.cleanliness - 1);
        newState.energy = clamp(prev.energy - 1);

        // Age increases
        newState.age += 1;

        // Update mood based on stats
        if (newState.hunger < 30 || newState.happiness < 30 || newState.cleanliness < 30) {
          newState.mood = 'sad';
          newState.currentActivity = 'sick';
        } else if (newState.happiness > 80 && newState.energy > 80) {
          newState.mood = 'excited';
        } else if (newState.energy < 30) {
          newState.mood = 'sleeping';
          newState.currentActivity = 'sleeping';
        } else {
          newState.mood = 'happy';
          newState.currentActivity = 'idle';
        }

        // Health affected by other stats
        const avgStats = (newState.hunger + newState.happiness + newState.cleanliness + newState.energy) / 4;
        if (avgStats < 30) {
          newState.health = clamp(prev.health - 3);
          newState.isSick = true;
        } else {
          newState.health = clamp(prev.health + 1);
          newState.isSick = false;
        }

        // Check if dead
        if (newState.health <= 0) {
          newState.isAlive = false;
          newState.mood = 'sad';
        }

        // Generate poop randomly
        if (Math.random() < 0.05 && newState.hunger > 50) {
          setPoopCount(prev => Math.min(prev + 1, 5));
        }

        return newState;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Draw different pet types
  const drawCat = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    const bounce = Math.sin(time / 200) * 2;
    const catY = y + bounce;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.ellipse(x, catY + 30, 20, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = state.isSick ? '#D3D3D3' : '#FFA500';
    ctx.beginPath();
    ctx.ellipse(x, catY, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(x, catY - 15, 15, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(x - 12, catY - 25);
    ctx.lineTo(x - 8, catY - 35);
    ctx.lineTo(x - 4, catY - 25);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 4, catY - 25);
    ctx.lineTo(x + 8, catY - 35);
    ctx.lineTo(x + 12, catY - 25);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    if (state.isAsleep) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 8, catY - 15);
      ctx.lineTo(x - 4, catY - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 4, catY - 15);
      ctx.lineTo(x + 8, catY - 15);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x - 6, catY - 15, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 6, catY - 15, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(x, catY - 10);
    ctx.lineTo(x - 2, catY - 8);
    ctx.lineTo(x + 2, catY - 8);
    ctx.closePath();
    ctx.fill();

    // Tail
    ctx.strokeStyle = state.isSick ? '#D3D3D3' : '#FFA500';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const tailWave = Math.sin(time / 300) * 10;
    ctx.moveTo(x + 20, catY);
    ctx.quadraticCurveTo(x + 35, catY - 10 + tailWave, x + 30, catY - 20);
    ctx.stroke();
  };

  const drawDog = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    const bounce = Math.sin(time / 200) * 2;
    const dogY = y + bounce;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.ellipse(x, dogY + 30, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = state.isSick ? '#D3D3D3' : '#8B4513';
    ctx.beginPath();
    ctx.ellipse(x, dogY, 28, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(x, dogY - 18, 18, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#D2691E';
    ctx.beginPath();
    ctx.ellipse(x, dogY - 10, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears (floppy)
    ctx.fillStyle = state.isSick ? '#D3D3D3' : '#8B4513';
    ctx.beginPath();
    ctx.ellipse(x - 15, dogY - 25, 8, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 15, dogY - 25, 8, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    if (state.isAsleep) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x - 8, dogY - 18, 4, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 8, dogY - 18, 4, 0, Math.PI);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x - 7, dogY - 18, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 7, dogY - 18, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, dogY - 10, 2, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (state.mood === 'happy' || state.mood === 'excited') {
      ctx.arc(x, dogY - 8, 6, 0, Math.PI);
    } else {
      ctx.moveTo(x - 3, dogY - 5);
      ctx.lineTo(x + 3, dogY - 5);
    }
    ctx.stroke();

    // Tail (wagging)
    ctx.strokeStyle = state.isSick ? '#D3D3D3' : '#8B4513';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const tailWag = Math.sin(time / 150) * 20;
    ctx.moveTo(x + 25, dogY);
    ctx.quadraticCurveTo(x + 40, dogY - 10 + tailWag, x + 35, dogY - 25 + tailWag/2);
    ctx.stroke();
  };

  // Draw pixel art pet
  const drawPet = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw room background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

    // Draw floor
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);

    // Draw pet based on type
    const petY = petPosition.y + (isJumping ? -20 : 0);

    switch (state.petType) {
      case 'cat':
        drawCat(ctx, petPosition.x, petY, time);
        break;
      case 'dog':
        drawDog(ctx, petPosition.x, petY, time);
        break;
      case 'owl':
        // TODO: Implement owl drawing
        drawCat(ctx, petPosition.x, petY, time); // Using cat as placeholder
        break;
      case 'panda':
        // TODO: Implement panda drawing
        drawCat(ctx, petPosition.x, petY, time); // Using cat as placeholder
        break;
    }

    // Draw poop if any
    for (let i = 0; i < poopCount; i++) {
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(50 + i * 30, canvas.height - 50, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Z's if sleeping
    if (state.isAsleep) {
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('Z', petPosition.x + 35, petPosition.y - 30 + Math.sin(time / 300) * 5);
      if (time % 600 < 300) {
        ctx.fillText('Z', petPosition.x + 50, petPosition.y - 45 + Math.sin(time / 300) * 5);
      }
    }

    // Draw sick indicator
    if (state.isSick) {
      ctx.fillStyle = '#FF0000';
      ctx.font = '16px Arial';
      ctx.fillText('😷', petPosition.x + 30, petPosition.y - 35);
    }
  }, [state, petPosition, isJumping, poopCount]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (time: number) => {
      drawPet(ctx, time);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawPet]);

  // Pet actions
  const feed = useCallback(() => {
    if (!state.isAlive || state.isAsleep) return;

    setState(prev => ({
      ...prev,
      hunger: clamp(prev.hunger + 30),
      happiness: clamp(prev.happiness + 10),
      weight: Math.min(prev.weight + 2, 99),
      currentActivity: 'eating',
      mood: 'happy'
    }));

    setShowMessage('🍖 Yummy!');
    setTimeout(() => setShowMessage(''), 2000);
  }, [state.isAlive, state.isAsleep]);

  const play = useCallback(() => {
    if (!state.isAlive || state.isAsleep) return;

    setState(prev => ({
      ...prev,
      happiness: clamp(prev.happiness + 20),
      energy: clamp(prev.energy - 10),
      weight: Math.max(prev.weight - 1, 20),
      currentActivity: 'playing',
      mood: 'excited'
    }));

    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);

    setShowMessage('🎮 Wheee!');
    setTimeout(() => setShowMessage(''), 2000);
  }, [state.isAlive, state.isAsleep]);

  const clean = useCallback(() => {
    if (!state.isAlive || state.isAsleep) return;

    setState(prev => ({
      ...prev,
      cleanliness: clamp(prev.cleanliness + 40),
      happiness: clamp(prev.happiness + 5),
      currentActivity: 'bathing',
      mood: 'happy'
    }));

    setPoopCount(0);
    setShowMessage('🧼 Fresh and clean!');
    setTimeout(() => setShowMessage(''), 2000);
  }, [state.isAlive, state.isAsleep]);

  const sleep = useCallback(() => {
    if (!state.isAlive) return;

    setState(prev => ({
      ...prev,
      isAsleep: !prev.isAsleep,
      energy: prev.isAsleep ? clamp(prev.energy - 20) : 100,
      currentActivity: prev.isAsleep ? 'idle' : 'sleeping',
      mood: prev.isAsleep ? 'neutral' : 'sleeping'
    }));

    setShowMessage(state.isAsleep ? '☀️ Good morning!' : '😴 Good night...');
    setTimeout(() => setShowMessage(''), 2000);
  }, [state.isAlive, state.isAsleep]);

  const giveMedicine = useCallback(() => {
    if (!state.isAlive || !state.isSick) return;

    setState(prev => ({
      ...prev,
      health: clamp(prev.health + 30),
      isSick: false,
      mood: 'happy',
      currentActivity: 'idle'
    }));

    setShowMessage('💊 Feeling better!');
    setTimeout(() => setShowMessage(''), 2000);
  }, [state.isAlive, state.isSick]);

  // Memory game functions
  const initializeMemoryGame = useCallback(() => {
    const emojis = ['🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];
    const gameEmojis = emojis.slice(0, (gameSize * gameSize) / 2);
    const cards = [];

    for (let i = 0; i < gameEmojis.length; i++) {
      cards.push({ id: i * 2, emoji: gameEmojis[i], isFlipped: false, isMatched: false });
      cards.push({ id: i * 2 + 1, emoji: gameEmojis[i], isFlipped: false, isMatched: false });
    }

    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    setMemoryCards(cards);
    setSelectedCards([]);
    setGameScore(0);
  }, [gameSize]);

  const handleCardClick = useCallback((cardId: number) => {
    const card = memoryCards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    const newCards = memoryCards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setMemoryCards(newCards);

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const firstCard = memoryCards.find(c => c.id === first);
      const secondCard = memoryCards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          ));
          setGameScore(prev => prev + 10);
          setSelectedCards([]);
          setState(prev => ({ ...prev, happiness: clamp(prev.happiness + 5) }));
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setSelectedCards([]);
        }, 1500);
      }
    }
  }, [memoryCards, selectedCards]);

  const playMiniGame = useCallback(() => {
    if (!state.isAlive || state.isAsleep) return;
    setShowGame(true);
    initializeMemoryGame();
  }, [state.isAlive, state.isAsleep, initializeMemoryGame]);

  const endGame = useCallback(() => {
    setShowGame(false);
    setShowMessage(`Game Over! Score: ${gameScore}`);
    setTimeout(() => setShowMessage(''), 3000);
  }, [gameScore]);

  // Pet movement
  useEffect(() => {
    if (!state.isAlive || state.isAsleep) return;

    const moveInterval = setInterval(() => {
      setPetPosition(prev => ({
        x: Math.max(50, Math.min(250, prev.x + (Math.random() - 0.5) * 40)),
        y: 100
      }));
    }, 2000);

    return () => clearInterval(moveInterval);
  }, [state.isAlive, state.isAsleep]);

  if (!state.isAlive) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gray-900 text-white">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over</h2>
          <p className="text-lg mb-4">{state.name} has passed away 😢</p>
          <p className="text-sm text-gray-400 mb-4">Age: {Math.floor(state.age / 100)} years</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Start New Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-b from-blue-50 to-green-50 shadow-xl">
      <CardContent className="p-4">
        {/* Pet Display */}
        <div className="relative mb-4">
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            className="w-full border-4 border-gray-300 rounded-lg bg-white"
          />

          {/* Status Messages */}
          {showMessage && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-200 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
              {showMessage}
            </div>
          )}

          {/* Pet Name and Status */}
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded">
            <span className="font-bold text-sm">{state.name}</span>
            <span className="ml-1">{state.petType === 'cat' ? '🐱' : state.petType === 'dog' ? '🐕' : state.petType === 'owl' ? '🦉' : '🐼'}</span>
            {state.isSick && <span className="ml-1">😷</span>}
            {state.isAsleep && <span className="ml-1">😴</span>}
          </div>

          {/* Age */}
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded">
            <span className="text-xs">Age: {Math.floor(state.age / 100)}y</span>
          </div>
        </div>

        {/* Status Bars */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white rounded p-2">
            <div className="flex justify-between text-xs mb-1">
              <span>🍖 Hunger</span>
              <span>{state.hunger}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{width: `${state.hunger}%`}}
              />
            </div>
          </div>

          <div className="bg-white rounded p-2">
            <div className="flex justify-between text-xs mb-1">
              <span>😊 Happiness</span>
              <span>{state.happiness}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all"
                style={{width: `${state.happiness}%`}}
              />
            </div>
          </div>

          <div className="bg-white rounded p-2">
            <div className="flex justify-between text-xs mb-1">
              <span>🧼 Cleanliness</span>
              <span>{state.cleanliness}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{width: `${state.cleanliness}%`}}
              />
            </div>
          </div>

          <div className="bg-white rounded p-2">
            <div className="flex justify-between text-xs mb-1">
              <span>⚡ Energy</span>
              <span>{state.energy}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all"
                style={{width: `${state.energy}%`}}
              />
            </div>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white rounded p-2 mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>❤️ Health</span>
            <span>{state.health}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                state.health > 60 ? 'bg-green-500' :
                state.health > 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{width: `${state.health}%`}}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            onClick={feed}
            disabled={state.isAsleep}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300"
          >
            🍖 Feed
          </Button>
          <Button
            onClick={play}
            disabled={state.isAsleep || state.energy < 20}
            size="sm"
            className="bg-pink-500 hover:bg-pink-600 text-white disabled:bg-gray-300"
          >
            🎮 Play
          </Button>
          <Button
            onClick={clean}
            disabled={state.isAsleep}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300"
          >
            🧼 Clean
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            onClick={sleep}
            size="sm"
            className={state.isAsleep ? "bg-yellow-500 hover:bg-yellow-600" : "bg-indigo-500 hover:bg-indigo-600"}
          >
            {state.isAsleep ? '☀️ Wake' : '😴 Sleep'}
          </Button>
          <Button
            onClick={playMiniGame}
            disabled={state.isAsleep}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-300"
          >
            🎯 Memory
          </Button>
          <Button
            onClick={() => setShowShop(true)}
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            🛒 Shop
          </Button>
        </div>

        {/* Medicine if sick */}
        {state.isSick && (
          <Button
            onClick={giveMedicine}
            className="w-full mb-4 bg-red-500 hover:bg-red-600 text-white"
          >
            💊 Give Medicine
          </Button>
        )}

        {/* Resources */}
        <div className="bg-white rounded p-2 flex justify-between items-center">
          <div className="flex gap-4 text-sm">
            <span>💰 {state.coins}</span>
            <span>⚖️ {state.weight}kg</span>
            <span>🎯 {state.discipline}</span>
          </div>
          <Button
            onClick={() => setShowStore(true)}
            size="sm"
            variant="outline"
          >
            🏪 Store
          </Button>
        </div>

        {/* Shop Modal - Care Items */}
        {showShop && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">🛒 Care Shop</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    if (state.coins >= 20) {
                      setState(prev => ({...prev, coins: prev.coins - 20}));
                      setShowMessage('Purchased food!');
                      setTimeout(() => setShowMessage(''), 2000);
                    }
                  }}
                  disabled={state.coins < 20}
                  className="w-full justify-between"
                  variant="outline"
                >
                  🍖 Food Bundle <span>💰 20</span>
                </Button>
                <Button
                  onClick={() => {
                    if (state.coins >= 10) {
                      setState(prev => ({...prev, coins: prev.coins - 10, health: 100}));
                      setShowMessage('Purchased medicine!');
                      setTimeout(() => setShowMessage(''), 2000);
                    }
                  }}
                  disabled={state.coins < 10}
                  className="w-full justify-between"
                  variant="outline"
                >
                  💊 Medicine <span>💰 10</span>
                </Button>
                <Button
                  onClick={() => {
                    if (state.coins >= 15) {
                      setState(prev => ({...prev, coins: prev.coins - 15}));
                      setShowMessage('Purchased toys!');
                      setTimeout(() => setShowMessage(''), 2000);
                    }
                  }}
                  disabled={state.coins < 15}
                  className="w-full justify-between"
                  variant="outline"
                >
                  🎾 Toys <span>💰 15</span>
                </Button>
              </div>
              <Button
                onClick={() => setShowShop(false)}
                className="w-full mt-4"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Store Modal - Decorative Items */}
        {showStore && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">🏪 Decor Store</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    if (state.coins >= 30) {
                      setState(prev => ({...prev, coins: prev.coins - 30}));
                      setShowMessage('Purchased wallpaper!');
                      setTimeout(() => setShowMessage(''), 2000);
                    }
                  }}
                  disabled={state.coins < 30}
                  className="w-full justify-between"
                  variant="outline"
                >
                  🎨 Wallpaper <span>💰 30</span>
                </Button>
                <Button
                  onClick={() => {
                    if (state.coins >= 25) {
                      setState(prev => ({...prev, coins: prev.coins - 25}));
                      setShowMessage('Purchased flooring!');
                      setTimeout(() => setShowMessage(''), 2000);
                    }
                  }}
                  disabled={state.coins < 25}
                  className="w-full justify-between"
                  variant="outline"
                >
                  🟦 Flooring <span>💰 25</span>
                </Button>
                <Button
                  onClick={() => {
                    if (state.coins >= 40) {
                      setState(prev => ({...prev, coins: prev.coins - 40}));
                      setShowMessage('Purchased furniture!');
                      setTimeout(() => setShowMessage(''), 2000);
                    }
                  }}
                  disabled={state.coins < 40}
                  className="w-full justify-between"
                  variant="outline"
                >
                  🪑 Furniture <span>💰 40</span>
                </Button>
              </div>
              <Button
                onClick={() => setShowStore(false)}
                className="w-full mt-4"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Memory Game Modal */}
        {showGame && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">🎯 Memory Match Game!</h3>
              <p className="text-sm mb-4">Find all matching pairs!</p>
              <p className="text-sm mb-4">Score: {gameScore}</p>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {memoryCards.map(card => (
                  <Button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="h-16 text-2xl bg-gray-200 hover:bg-gray-300"
                    variant={card.isFlipped || card.isMatched ? "default" : "outline"}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : '?'}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={initializeMemoryGame}
                  className="flex-1"
                  variant="outline"
                >
                  🔄 New Game
                </Button>
                <Button
                  onClick={endGame}
                  className="flex-1"
                  variant="outline"
                >
                  ❌ Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}