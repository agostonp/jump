import React from 'react';
import { LEAF_LEVELS } from '../engine/constants';

interface LeafProps {
  heightLevel: number;
  hasFood: boolean;
}

export const Leaf: React.FC<LeafProps> = ({ heightLevel, hasFood }) => {
  // Calculate size based on height level (0 = invisible, 1-3 = progressively larger)
  // Use a maximum of 80% to ensure circles don't fill the entire cell
  const maxSize = 80;
  const sizePercentage = (heightLevel / LEAF_LEVELS) * maxSize;
  const opacity = heightLevel === 0 ? 0 : 0.8 + (heightLevel / LEAF_LEVELS) * 0.2;

  if (heightLevel === 0) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="rounded-full bg-green-500 border-2 border-green-700 shadow-md transition-all duration-200"
        style={{
          width: `${sizePercentage}%`,
          height: `${sizePercentage}%`,
        }}
      />
      {hasFood && (
        <div
          className="absolute w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-sm"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </div>
  );
};
