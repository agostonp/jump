export interface Position {
  x: number;
  y: number;
}

export interface Leaf {
  heightLevel: number; // 0 = fully sunk, 1-3 = visible
  hasFood: boolean;
}

export interface Bird {
  position: Position;
}

export interface GameState {
  bird: Bird;
  leaves: Leaf[];
  score: number;
  lives: number;
  status: 'startScreen' | 'playing' | 'gameOver' | 'lifeLost';
  lastUpdateTime: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface LeafProbabilityUpperLimits {
  full: number; // Upper limit of Probability of a leaf on max height
  high: number; // Upper limit of Probability of a leaf growing / on level 2
  low: number; // Upper limit of Probability of a leaf sinking / on level 1
  food: number; // Upper limit of Probability of food on a leaf
}

