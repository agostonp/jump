import { Leaf, Position } from '../engine/types';
import {
  GRID_SIZE,
  LEAF_LEVELS,
  INITIAL_LEAF_COVERAGE,
  RESPAWN_TIME_MIN,
  RESPAWN_TIME_MAX,
  FOOD_COUNT,
} from '../engine/constants';

export function indexToPosition(index: number): Position {
  const x = index % GRID_SIZE;
  const y = Math.floor(index / GRID_SIZE);
  return { x, y };
}

export function positionToIndex(targetPostion: Position): number {
  return targetPostion.y * GRID_SIZE + targetPostion.x;
}

export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function positionDistance(pos1: Position, pos2: Position): number {
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);
  return dx + dy;
}

export function nearestLeaf(
  leaves: Leaf[],
  targetPosition: Position,
  predicate: (leaf: Leaf) => boolean
): Position | null {
  let nearestDistance = Infinity;
  let nearestPosition: Position | null = null;

  leaves.forEach((leaf, index) => {
    if (predicate(leaf)) {
      const leafPosition = indexToPosition(index);
      const distance = positionDistance(targetPosition, leafPosition);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPosition = leafPosition;
      }
    }
  });

  return nearestPosition;
}
