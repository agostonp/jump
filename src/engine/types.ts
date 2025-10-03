export interface Position {
  x: number;
  y: number;
}

export interface Leaf {
  position: Position;
  heightLevel: number; // 0 = fully sunk, 1-3 = visible
  hasFood: boolean;
  lastSteppedOn: number; // timestamp
  sinkStartTime: number; // timestamp when sinking started
}

export interface Bird {
  position: Position;
}

export interface GameState {
  bird: Bird;
  leaves: Leaf[];
  score: number;
  lives: number;
  status: 'playing' | 'gameOver' | 'lifeLost';
  lastUpdateTime: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
