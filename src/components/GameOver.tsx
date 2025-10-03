import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Game Over</h1>
        <p className="text-2xl mb-6">Final Score: {score}</p>
        <button
          onClick={onRestart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
};
