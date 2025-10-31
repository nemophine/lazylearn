'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import MemoryGame from './MemoryGame';
import SnakeGame from './SnakeGame';
import BreakoutGame from './BreakoutGame';

type GameType = 'none' | 'memory' | 'snake' | 'breakout';

export default function GameHub() {
  const [selectedGame, setSelectedGame] = useState<GameType>('none');

  const games = [
    {
      id: 'memory' as GameType,
      title: '🧠 Memory',
      description: 'จับคู่ไพล์',
      color: 'from-purple-400 to-purple-500',
      hoverColor: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-300'
    },
    {
      id: 'snake' as GameType,
      title: '🐍 Snake',
      description: 'เกมงูคลาสสิก',
      color: 'from-green-400 to-green-500',
      hoverColor: 'from-green-500 to-green-600',
      borderColor: 'border-green-300'
    },
    {
      id: 'breakout' as GameType,
      title: '🎮 Breakout',
      description: 'ทุบอิฐ',
      color: 'from-blue-400 to-blue-500',
      hoverColor: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-300'
    }
  ];

  const renderGame = () => {
    switch (selectedGame) {
      case 'memory':
        return <MemoryGame onGameComplete={(score) => console.log('Memory game completed:', score)} />;
      case 'snake':
        return <SnakeGame />;
      case 'breakout':
        return <BreakoutGame />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Polaroid Frame Container */}
      <div className="relative bg-white p-6 rounded-lg shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105 max-w-2xl mx-auto">
        {/* Photo Border with Aging Effects */}
        <div className="relative border-8 border-gray-100 rounded-lg shadow-inner overflow-hidden">
          {/* Photo Texture Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-gray-100/10 pointer-events-none"></div>
          {/* Film Grain Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`}}>
          </div>

          <Card className="overflow-hidden border-0 shadow-none relative">
            <CardContent className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 text-center relative">
              {/* Game Hub Title */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-2">🎮 GAME HUB</h2>
                <p className="text-sm text-gray-600">
                  {selectedGame === 'none' ? 'เลือกเกมที่อยากเล่น!' : 'กำลังเล่นเกม...'}
                </p>
              </div>

              {selectedGame === 'none' ? (
                /* Game Selection Menu */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                    {games.map((game) => (
                      <Button
                        key={game.id}
                        onClick={() => setSelectedGame(game.id)}
                        className={`p-6 h-24 bg-gradient-to-r ${game.color} hover:${game.hoverColor} text-white border-2 ${game.borderColor} shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 rounded-xl`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="text-xl font-bold mb-1">{game.title}</div>
                            <div className="text-sm opacity-90">{game.description}</div>
                          </div>
                          <div className="text-3xl opacity-80">▶️</div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">📋 วิธีเล่น:</h3>
                    <div className="text-xs text-gray-600 space-y-1 text-left">
                      <p>• <strong>Memory:</strong> คลิกที่ไพล์เพื่อค้นหาคู่ที่ตรงกัน</p>
                      <p>• <strong>Snake:</strong> ใช้ปุ่มลูกศรละทึกหรือปุ่มทิศทาง</p>
                      <p>• <strong>Breakout:</strong> เคลื่อนเมาส์เพื่อควบคุมไม้พาดเดิ้ล</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Game Display */
                <div className="space-y-4">
                  {/* Back Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setSelectedGame('none')}
                      size="sm"
                      className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white border-2 border-gray-300 shadow-md"
                    >
                      🔙 กลับเมนูเกม
                    </Button>
                  </div>

                  {/* Current Game */}
                  <div className="flex justify-center">
                    {renderGame()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Polaroid Bottom Label */}
        <div className="bg-white mt-2 p-2 text-center">
          <p className="text-xs font-serif text-gray-600 italic">Game Collection</p>
          <p className="text-xs text-gray-500">Mini Games Paradise</p>
        </div>
      </div>

      {/* Shadow Effect */}
      <div className="absolute inset-0 bg-black/10 blur-xl transform translate-y-2 translate-x-1 -z-10"></div>
    </div>
  );
}