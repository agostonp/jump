import React from 'react';
import { GameState } from '../engine/types';
import { GRID_SIZE, CELL_SIZE } from '../engine/constants';
import { Bird } from './Bird';
import { Leaf } from './Leaf';
import { positionToIndex } from '../utils/leafManager';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const boardSize = GRID_SIZE * CELL_SIZE;

  return (
    <div
      className="relative bg-blue-500 rounded-lg shadow-2xl overflow-hidden"
      style={{
        width: boardSize,
        height: boardSize,
      }}
    >
      {/* Render grid */}
      {Array.from({ length: GRID_SIZE }).map((_, y) =>
        Array.from({ length: GRID_SIZE }).map((_, x) => {
          const index = positionToIndex({x, y});
          const leaf = gameState.leaves[index];
          const isBirdHere =
            gameState.bird.position.x === x && gameState.bird.position.y === y;

          return (
            <div
              key={`${x},${y}`}
              className="absolute border border-blue-300 border-opacity-20"
              style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: 'transparent',
              }}
            >
              {leaf && <Leaf heightLevel={leaf.heightLevel} hasFood={leaf.hasFood} />}
              {isBirdHere && <Bird />}
            </div>
          );
        })
      )}
    </div>
  );
};
