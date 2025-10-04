import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { GameState, Direction } from '../engine/types';
import { GameBoard } from './GameBoard';
import { HUD } from './HUD';
import { GameOver } from './GameOver';
import { LifeLostModal } from './LifeLostModal';
import { StartScreen } from './StartScreen';
import { useGameLoop } from '../hooks/useGameLoop';

export const Game: React.FC = () => {
  const engineRef = useRef<GameEngine>(new GameEngine());
  const [gameState, setGameState] = useState<GameState>(
    engineRef.current.getState()
  );

  const updateGame = (currentTime: number) => {
    engineRef.current.update(currentTime);
    setGameState(engineRef.current.getState());
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameState.status !== 'playing') return;

    let direction: Direction | null = null;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'up';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'right';
        break;
    }

    if (direction) {
      event.preventDefault();
      const moved = engineRef.current.moveBird(direction);
      if (moved) {
        setGameState(engineRef.current.getState());
      }
    }
  };

  const handleRestart = () => {
    engineRef.current.restart();
    setGameState(engineRef.current.getState());
  };

  const handleContinue = () => {
    engineRef.current.continueAfterLifeLoss();
    setGameState(engineRef.current.getState());
  };

  const handleStart = () => {
    engineRef.current.startGame();
    setGameState(engineRef.current.getState());
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.status]);

  useGameLoop(updateGame, gameState.status === 'playing');

  return (
    <div className="flex flex-col gap-4">
      <HUD score={gameState.score} lives={gameState.lives} />
      <GameBoard gameState={gameState} />
      {gameState.status === 'startScreen' && (
        <StartScreen onStart={handleStart} />
      )}
      {gameState.status === 'lifeLost' && (
        <LifeLostModal
          livesRemaining={gameState.lives}
          onContinue={handleContinue}
        />
      )}
      {gameState.status === 'gameOver' && (
        <GameOver score={gameState.score} onRestart={handleRestart} />
      )}
    </div>
  );
};
