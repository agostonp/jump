import { GameState, Position, Leaf, Direction, LeafProbabilityUpperLimits } from './types';
import {
  GRID_SIZE,
  INITIAL_LIVES,
  LEAF_LEVELS,
  LEVEL_1_DYNAMICS,
  LEVEL_1_START,
} from './constants';
import {
  indexToPosition,
  positionsEqual,
  positionToIndex,
  nearestLeaf,
} from '../utils/leafManager';
import { soundManager } from '../utils/soundManager';

export class GameEngine {
  private state: GameState;
  private lastTurnTime: number = 0;
  private readonly TURN_DURATION = 1000; // 1 second per turn

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
  
    const leaves = this.initializeLeaves(LEVEL_1_START);

    // Find a leaf to place the bird on (prefer one without food)
    let birdPosition = nearestLeaf(leaves, { x: 0, y: 0 }, (leaf) => leaf.heightLevel === LEAF_LEVELS && !leaf.hasFood)
    if (!birdPosition) {
      birdPosition = nearestLeaf(leaves, { x: 0, y: 0 }, (leaf) => leaf.heightLevel > 0) || { x: 0, y: 0 };
    }
    
    return {
      bird: {
        position: { ...birdPosition },
      },
      leaves,
      score: 0,
      lives: INITIAL_LIVES,
      status: 'startScreen',
      lastUpdateTime: Date.now(),
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  moveBird(direction: Direction): boolean {
    if (this.state.status !== 'playing') return false;

    const currentPos = this.state.bird.position;
    const newPos: Position = { ...currentPos };

    // Calculate new position
    switch (direction) {
      case 'up':
        newPos.y = Math.max(0, newPos.y - 1);
        break;
      case 'down':
        newPos.y = Math.min(GRID_SIZE - 1, newPos.y + 1);
        break;
      case 'left':
        newPos.x = Math.max(0, newPos.x - 1);
        break;
      case 'right':
        newPos.x = Math.min(GRID_SIZE - 1, newPos.x + 1);
        break;
    }

    // Check if position changed (hit boundary)
    if (positionsEqual(currentPos, newPos)) return false;
    console.log(`Bird moves ${direction} to (${newPos.x},${newPos.y})`);

    // Move bird to new position (can move anywhere)
    this.state.bird.position = newPos;

    // Find leaf at new position
    const targetLeaf = this.state.leaves[positionToIndex(newPos)];

    // Check if leaf is fully sunk - lose life immediately
    if (targetLeaf.heightLevel === 0) {
      this.loseLife();
      return true;
    }

    // Bird landed on valid leaf
    // (Leaf will start sinking on next turn via updateLeaves)

    // Check for food collection
    if (targetLeaf.hasFood) {
      targetLeaf.hasFood = false;
      this.state.score += 20;
      soundManager.collectFood();
    } else {
      this.state.score += 1;
      soundManager.jump();
    }

    return true;
  }

  update(currentTime: number): void {
    if (this.state.status !== 'playing') return;

    // Check if a full turn has elapsed
    const timeSinceLastTurn = currentTime - this.lastTurnTime;
    if (timeSinceLastTurn >= this.TURN_DURATION) {
      // Process one turn
      this.processTurn(currentTime);
      this.lastTurnTime = currentTime;
    }

    this.state.lastUpdateTime = currentTime;
  }

  private processTurn(currentTime: number): void {
    // All game changes happen once per turn (1 second)
    console.log('Processing turn at', currentTime);

    // 1. Update leaves (sink/emerge/random changes)
    this.updateLeaves(currentTime);

  }

  private updateLeaves(currentTime: number): void {
    const birdPos = this.state.bird.position;

    this.state.leaves.forEach((leaf, index) => {
      const leafPos = indexToPosition(index);

      const isBirdOnLeaf = positionsEqual(leafPos, birdPos);

      if (isBirdOnLeaf) {
        // Bird is on this leaf - it SINKS one level per turn
        if (leaf.heightLevel > 0) {
          console.log(`Bird on leaf at (${leafPos.x},${leafPos.y}), sinking from ${leaf.heightLevel} to ${leaf.heightLevel - 1}`);
          leaf.heightLevel--;

          if (leaf.heightLevel === 0) {
            this.loseLife();
          }
        }
      } else {
        // Bird is NOT on this leaf

        const leafFate = Math.random(); 
        if(leafFate <= LEVEL_1_DYNAMICS.full) {
          leaf.heightLevel = LEAF_LEVELS;
          console.log(`Leaf at (${leafPos.x},${leafPos.y}) grows to full height: ${leaf.heightLevel}`);
        } else if(leafFate <= LEVEL_1_DYNAMICS.high) {
          if(leaf.heightLevel < LEAF_LEVELS) {
            leaf.heightLevel++;
            console.log(`Leaf at (${leafPos.x},${leafPos.y}) grows: ${leaf.heightLevel}`);
          }
        } else if(leafFate <= LEVEL_1_DYNAMICS.low) {
          if(leaf.heightLevel > 0 && !leaf.hasFood) {
            leaf.heightLevel--;
            console.log(`Leaf at (${leafPos.x},${leafPos.y}) sinks: ${leaf.heightLevel}`);
          }
        } else if(leafFate <= LEVEL_1_DYNAMICS.food) {
          if(leaf.heightLevel > 0 && !leaf.hasFood) {
            leaf.hasFood = true;
            console.log(`Food appears on leaf at (${leafPos.x},${leafPos.y})`);
          }
        }
        // Otherwise, leaf remains the same
      }
    });
  }

  private initializeLeaves(leafProbabilities: LeafProbabilityUpperLimits): Leaf[] {

    const totalCells = GRID_SIZE * GRID_SIZE;
    const leaves: Leaf[] = [];

    for (let i = 0; i < totalCells; i++) {
      const leaf: Leaf = { heightLevel: 0, hasFood: false };
      const leafFate = Math.random(); 
      if(leafFate <= leafProbabilities.full) {
        leaf.heightLevel = 3;
      } else if(leafFate <= leafProbabilities.high) {
          leaf.heightLevel = 2;
      } else if(leafFate <= leafProbabilities.low) {
          leaf.heightLevel = 1;
      } else {
          leaf.heightLevel = 0;
      }

      const foodFate = Math.random(); 
      if(leaf.heightLevel > 0 && foodFate <= leafProbabilities.food) {
        leaf.hasFood = true;
      }

      leaves.push(leaf);
    }

    return leaves;
  }        

  private loseLife(): void {
    this.state.lives--;
    soundManager.loseLife();

    if (this.state.lives <= 0) {
      this.state.status = 'gameOver';
      soundManager.gameOver();
    } else {
      // Pause game and show life lost modal
      this.state.status = 'lifeLost';
    }
  }

  continueAfterLifeLoss(): void {
    if (this.state.status !== 'lifeLost') return;

    // Find a leaf to place the bird on (prefer one without food)
    let birdPosition = nearestLeaf(this.state.leaves, this.state.bird.position, (leaf) => leaf.heightLevel === LEAF_LEVELS && !leaf.hasFood)
    if (!birdPosition) {
      birdPosition = nearestLeaf(this.state.leaves, this.state.bird.position, (leaf) => leaf.heightLevel > 0) || this.state.bird.position;
    }
    this.state.bird.position = { ...birdPosition };

    // Resume game and reset turn timer
    this.state.status = 'playing';
    this.lastTurnTime = 0;
  }

  restart(): void {
    this.state = this.createInitialState();
    this.state.status = 'playing';
    this.lastTurnTime = 0;
  }

  startGame(): void {
    if (this.state.status !== 'startScreen') return;
    this.state.status = 'playing';
    this.lastTurnTime = 0;
  }
}
