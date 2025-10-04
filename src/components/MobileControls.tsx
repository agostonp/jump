import React, { useRef } from 'react';
import { Direction } from '../engine/types';

interface MobileControlsProps {
  onMove: (direction: Direction) => void;
  disabled: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onMove, disabled }) => {
  const lastMoveTimeRef = useRef<number>(0);
  const MOVE_COOLDOWN = 200; // ms between moves

  const buttonClass = `
    w-16 h-16 sm:w-20 sm:h-20
    bg-gray-700 hover:bg-gray-600 active:bg-gray-500
    disabled:bg-gray-800 disabled:opacity-50
    text-white text-2xl sm:text-3xl
    rounded-lg shadow-lg
    flex items-center justify-center
    transition-colors duration-150
    touch-manipulation
    select-none
  `;

  const handlePress = (direction: Direction) => {
    if (disabled) return;

    const now = Date.now();
    if (now - lastMoveTimeRef.current < MOVE_COOLDOWN) {
      return; // Still in cooldown period
    }

    lastMoveTimeRef.current = now;
    onMove(direction);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4 lg:hidden">
      <div className="flex justify-center">
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('up');
          }}
          onClick={() => handlePress('up')}
          disabled={disabled}
          aria-label="Move up"
        >
          ↑
        </button>
      </div>
      <div className="flex gap-2 justify-center">
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('left');
          }}
          onClick={() => handlePress('left')}
          disabled={disabled}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('down');
          }}
          onClick={() => handlePress('down')}
          disabled={disabled}
          aria-label="Move down"
        >
          ↓
        </button>
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('right');
          }}
          onClick={() => handlePress('right')}
          disabled={disabled}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  );
};
