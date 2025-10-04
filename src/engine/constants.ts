import { LeafProbabilityUpperLimits } from "./types";

// Game configuration - easily modifiable
export const GRID_SIZE = 8;
export const INITIAL_LIVES = 5;
export const LEAF_LEVELS = 3; // Max height level (0 = sunk, 1-3 = visible)
export const SINK_RATE = 1; // levels per second
export const RESPAWN_TIME_MIN = 1000; // ms
export const RESPAWN_TIME_MAX = 3000; // ms
export const INITIAL_LEAF_COVERAGE = 0.8; // 80% of grid
export const FOOD_COUNT = 5; // Number of food items on the board

// Time constants
export const SINK_INTERVAL = 1000 / SINK_RATE; // ms per level

// Cell size for rendering
export const CELL_SIZE = 60; // pixels

export const LEVEL_1_DYNAMICS: LeafProbabilityUpperLimits = {
  full: 0.03, // 3% chance to grow to full height
  high: 0.09, // 6% chance to grow
  low: 0.15, // 6% chance to sink
  food: 0.17, // 2% chance for food to appear
};

export const LEVEL_1_START: LeafProbabilityUpperLimits = {
  full: 0.40,
  high: 0.65,
  low: 0.80,
  food: 0.12,
};
