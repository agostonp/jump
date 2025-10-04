import React from 'react';
import { INITIAL_LIVES } from '../engine/constants';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg text-center max-w-md">
        <h1 className="text-5xl font-bold mb-6">🍃 Jump</h1>
        <div className="text-left mb-8 space-y-4">
          <p className="text-lg">Jump from leaf to leaf to survive!</p>
          <div className="space-y-2">
            <p className="text-sm">🎮 <strong>Controls:</strong> Arrow keys or WASD</p>
            <p className="text-sm">🎯 <strong>Goal:</strong> Collect food (+20 points) and avoid sinking</p>
            <p className="text-sm">⚠️ <strong>Warning:</strong> Leaves sink when you stand on them</p>
            <p className="text-sm">❤️ <strong>Lives:</strong> You have {INITIAL_LIVES} chances</p>
          </div>
        </div>
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
