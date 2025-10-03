import { GameState, Position, Leaf, Direction } from './types';
import {
  GRID_SIZE,
  INITIAL_LIVES,
  LEAF_LEVELS,
  SINK_INTERVAL,
} from './constants';
import {
  createInitialLeaves,
  getRandomPosition,
  getRandomRespawnTime,
  positionsEqual,
  isAdjacent,
} from '../utils/leafManager';
import { soundManager } from '../utils/soundManager';

export class GameEngine {
  private state: GameState;
  private pendingRespawns: Array<{ time: number; count: number }> = [];
  private lastTurnTime: number = Date.now();
  private readonly TURN_DURATION = 1000; // 1 second per turn

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    const leaves = createInitialLeaves();

    // Find a leaf to place the bird on (prefer one without food)
    let birdLeaf = leaves.find((leaf) => !leaf.hasFood) || leaves[0];
    birdLeaf.lastSteppedOn = Date.now();

    return {
      bird: {
        position: { ...birdLeaf.position },
      },
      leaves,
      score: 0,
      lives: INITIAL_LIVES,
      status: 'playing',
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

    // Find current leaf and mark it for emerging
    const currentLeaf = this.state.leaves.find((leaf) =>
      positionsEqual(leaf.position, currentPos)
    );
    if (currentLeaf) {
      currentLeaf.lastSteppedOn = Date.now();
    }

    // Move bird to new position (can move anywhere)
    this.state.bird.position = newPos;

    // Find leaf at new position
    const targetLeaf = this.state.leaves.find((leaf) =>
      positionsEqual(leaf.position, newPos)
    );

    // Check if there's no leaf or leaf is fully sunk - lose life immediately
    if (!targetLeaf || targetLeaf.heightLevel === 0) {
      this.loseLife();
      return true;
    }

    // Bird landed on valid leaf
    // (Leaf will start sinking on next turn via updateLeaves)

    // Check for food collection
    if (targetLeaf.hasFood) {
      targetLeaf.hasFood = false;
      this.state.score += 10;
      soundManager.collectFood();
    } else {
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

    // 2. Check pending respawns
    this.processPendingRespawns(currentTime);

    // 3. Check if bird is on a valid leaf
    this.checkBirdStatus();
  }

  private updateLeaves(currentTime: number): void {
    const birdPos = this.state.bird.position;
    const leavesToRemove: number[] = [];

    this.state.leaves.forEach((leaf, index) => {
      // Leaves with food don't sink or change
      if (leaf.hasFood) {
        leaf.heightLevel = LEAF_LEVELS;
        return;
      }

      const isBirdOnLeaf = positionsEqual(leaf.position, birdPos);

      if (isBirdOnLeaf) {
        // Bird is on this leaf - it SINKS one level per turn
        if (leaf.heightLevel > 0) {
          console.log(`Bird on leaf at (${leaf.position.x},${leaf.position.y}), sinking from ${leaf.heightLevel} to ${leaf.heightLevel - 1}`);
          leaf.heightLevel--;

          if (leaf.heightLevel === 1) {
            soundManager.leafSinking();
          }
        }

        // DON'T remove the leaf while bird is on it
        // Let checkBirdStatus handle life loss when it reaches 0
      } else {
        // Bird is NOT on this leaf

        // Check if bird was recently on it (bird just left)
        if (leaf.lastSteppedOn > 0) {
          // Bird just left - leaf emerges back to full height
          leaf.heightLevel = LEAF_LEVELS;
          leaf.lastSteppedOn = 0; // Reset flag
        } else {
          // Random sporadic leaf dynamics (15% chance per turn to change)
          // Only for leaves not at max or min level
          if (Math.random() < 0.15 && leaf.heightLevel > 0 && leaf.heightLevel < LEAF_LEVELS) {
            const oldLevel = leaf.heightLevel;
            // 60% chance to sink, 40% chance to emerge (slight bias toward sinking for difficulty)
            if (Math.random() < 0.6) {
              leaf.heightLevel = Math.max(1, leaf.heightLevel - 1);
            } else {
              leaf.heightLevel = Math.min(LEAF_LEVELS, leaf.heightLevel + 1);
            }
            console.log(`Random change at (${leaf.position.x},${leaf.position.y}): ${oldLevel} -> ${leaf.heightLevel}`);
          }

          // 8% chance per turn for fully emerged leaf to start sinking
          if (Math.random() < 0.08 && leaf.heightLevel === LEAF_LEVELS) {
            leaf.heightLevel = LEAF_LEVELS - 1;
            console.log(`Leaf at (${leaf.position.x},${leaf.position.y}) starting to sink: ${LEAF_LEVELS} -> ${leaf.heightLevel}`);
          }

          // 10% chance per turn for level 1 leaf to sink completely
          if (Math.random() < 0.10 && leaf.heightLevel === 1) {
            leaf.heightLevel = 0;
            console.log(`Leaf at (${leaf.position.x},${leaf.position.y}) sinking completely: 1 -> 0`);
          }

          // Mark fully sunk leaves (not stepped on by bird) for removal
          if (leaf.heightLevel === 0) {
            leavesToRemove.push(index);
          }
        }
      }
    });

    // Remove fully sunk leaves and schedule respawns
    if (leavesToRemove.length > 0) {
      console.log(`Removing ${leavesToRemove.length} fully sunk leaves`);
      // Remove from end to start to maintain indices
      for (let i = leavesToRemove.length - 1; i >= 0; i--) {
        this.state.leaves.splice(leavesToRemove[i], 1);
      }

      // Schedule respawn for each removed leaf
      leavesToRemove.forEach(() => {
        const respawnTime = currentTime + getRandomRespawnTime();
        console.log(`Scheduling respawn at ${respawnTime} (in ${getRandomRespawnTime()}ms)`);
        this.pendingRespawns.push({
          time: respawnTime,
          count: 1,
        });
      });
    }
  }

  private processPendingRespawns(currentTime: number): void {
    const respawnsToProcess = this.pendingRespawns.filter(
      (r) => r.time <= currentTime
    );

    if (respawnsToProcess.length > 0) {
      console.log(`Processing ${respawnsToProcess.length} respawns`);
    }

    respawnsToProcess.forEach((respawn) => {
      // Get existing positions
      const existingPositions = new Set(
        this.state.leaves.map((leaf) => `${leaf.position.x},${leaf.position.y}`)
      );

      // Add new leaves
      for (let i = 0; i < respawn.count; i++) {
        const position = getRandomPosition(existingPositions);
        existingPositions.add(`${position.x},${position.y}`);

        console.log(`Respawning leaf at (${position.x},${position.y})`);
        this.state.leaves.push({
          position,
          heightLevel: LEAF_LEVELS,
          hasFood: false,
          lastSteppedOn: 0,
          sinkStartTime: currentTime,
        });
      }
    });

    // Remove processed respawns
    this.pendingRespawns = this.pendingRespawns.filter(
      (r) => r.time > currentTime
    );
  }

  private checkBirdStatus(): void {
    const birdPos = this.state.bird.position;
    const currentLeaf = this.state.leaves.find((leaf) =>
      positionsEqual(leaf.position, birdPos)
    );

    // Bird fell (leaf fully sunk while bird was on it)
    if (currentLeaf && currentLeaf.heightLevel === 0) {
      this.loseLife();
    }
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

    // Respawn bird on a random leaf with full height
    const validLeaves = this.state.leaves.filter(
      (leaf) => leaf.heightLevel === LEAF_LEVELS && !leaf.hasFood
    );

    if (validLeaves.length > 0) {
      const respawnLeaf =
        validLeaves[Math.floor(Math.random() * validLeaves.length)];
      this.state.bird.position = { ...respawnLeaf.position };
    }

    // Resume game and reset turn timer
    this.state.status = 'playing';
    this.lastTurnTime = Date.now();
  }

  restart(): void {
    this.state = this.createInitialState();
    this.pendingRespawns = [];
    this.lastTurnTime = Date.now();
  }
}
