import { Leaf, Position } from '../engine/types';
import {
  GRID_SIZE,
  LEAF_LEVELS,
  INITIAL_LEAF_COVERAGE,
  RESPAWN_TIME_MIN,
  RESPAWN_TIME_MAX,
  FOOD_COUNT,
} from '../engine/constants';

export function createInitialLeaves(): Leaf[] {
  const leaves: Leaf[] = [];
  const totalCells = GRID_SIZE * GRID_SIZE;
  const leafCount = Math.floor(totalCells * INITIAL_LEAF_COVERAGE);
  const positions = new Set<string>();

  // Generate random unique positions
  while (positions.size < leafCount) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    positions.add(`${x},${y}`);
  }

  // Convert positions to leaves
  const posArray = Array.from(positions).map((pos) => {
    const [x, y] = pos.split(',').map(Number);
    return { x, y };
  });

  // Create leaves, some with food
  const foodIndices = new Set<number>();
  while (foodIndices.size < Math.min(FOOD_COUNT, posArray.length)) {
    foodIndices.add(Math.floor(Math.random() * posArray.length));
  }

  posArray.forEach((position, index) => {
    // Leaves with food always start at max height
    // Other leaves have varied initial heights for more dynamic gameplay
    let heightLevel: number;
    if (foodIndices.has(index)) {
      heightLevel = LEAF_LEVELS;
    } else {
      // 50% at max level, 30% at level 2, 20% at level 1
      const rand = Math.random();
      if (rand < 0.5) {
        heightLevel = LEAF_LEVELS;
      } else if (rand < 0.8) {
        heightLevel = LEAF_LEVELS - 1;
      } else {
        heightLevel = 1;
      }
    }

    leaves.push({
      position,
      heightLevel,
      hasFood: foodIndices.has(index),
      lastSteppedOn: 0,
      sinkStartTime: Date.now(),
    });
  });

  return leaves;
}

export function getRandomPosition(excludePositions: Set<string>): Position {
  let x: number, y: number;
  do {
    x = Math.floor(Math.random() * GRID_SIZE);
    y = Math.floor(Math.random() * GRID_SIZE);
  } while (excludePositions.has(`${x},${y}`));

  return { x, y };
}

export function getRandomRespawnTime(): number {
  return (
    RESPAWN_TIME_MIN +
    Math.random() * (RESPAWN_TIME_MAX - RESPAWN_TIME_MIN)
  );
}

export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function isAdjacent(pos1: Position, pos2: Position): boolean {
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}
