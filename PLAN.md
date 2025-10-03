# Leaves Game - Implementation Plan

## Project Overview
A React-based game where a bird jumps between leaves on a lake, collecting food while avoiding sinking leaves.

## Technical Stack
- **Framework**: React with TypeScript
- **Build Tool**: Webpack
- **Styling**: Tailwind CSS
- **State Management**: React state (upgrade to Context/Zustand if complexity increases)
- **Game Loop**: requestAnimationFrame for smooth rendering

## Architecture

### 1. Core Game Engine (Modular & Graphics-Independent)
- **GameState**: Manages all game logic separately from rendering
  - Grid system (8x8)
  - Bird position and movement
  - Leaf states (height levels 0-3)
  - Food items
  - Lives count (starts at 5)
  - Score tracking
  - Game status (playing, game over)

- **Game Loop**: Uses requestAnimationFrame
  - Time-based updates (1 level per second sinking)
  - Collision detection
  - Adjacent leaf movement validation

### 2. Component Structure
```
src/
├── components/
│   ├── Game.tsx              # Main game container
│   ├── GameBoard.tsx         # Renders the 8x8 grid
│   ├── Bird.tsx              # Bird sprite/visual
│   ├── Leaf.tsx              # Leaf sprite with height levels
│   ├── Food.tsx              # Food item sprite
│   ├── HUD.tsx               # Lives, score display
│   └── GameOver.tsx          # Game over screen
├── engine/
│   ├── GameEngine.ts         # Core game logic
│   ├── types.ts              # Type definitions
│   └── constants.ts          # Configurable constants
├── hooks/
│   └── useGameLoop.ts        # Game loop hook
└── utils/
    ├── leafManager.ts        # Leaf spawning/sinking logic
    ├── collisionDetection.ts # Check bird-leaf-food interactions
    └── soundManager.ts       # Sound effects handler
```

### 3. Key Features Implementation

#### Phase 1: Core Gameplay
1. **Grid & Basic Rendering**
   - 8x8 grid system
   - Basic geometric shapes for bird, leaves, food
   - Modular rendering layer (easy to swap graphics)

2. **Bird Movement**
   - Keyboard controls (arrow keys)
   - One leaf at a time, adjacent only (up/down/left/right)
   - Cannot move to fully sunk leaves (level 0)

3. **Leaf System**
   - Initial state: Most of lake area covered with leaves
   - 4 height levels (0=sunk, 1-3=visible)
   - Visual size decreases with level
   - Sinking: 1 level per second when bird not on it
   - Emerging: Partially sunk leaves return to level 3 when bird leaves
   - Respawn: 1-3 seconds after fully sinking, random position
   - Respawn count: >= number that sunk

4. **Food System**
   - Food items placed on random leaves
   - Leaves with food stay at level 3 (fixed height)
   - Food collected when bird lands on leaf
   - Score increases with each collection

5. **Lives & Game Over**
   - Start with 5 lives
   - Lose life when bird on fully sunk leaf
   - Game over when lives = 0
   - Stop all activity on game over
   - Display game over screen
   - "New Game" button to restart

6. **Sound Effects**
   - Jump sound
   - Food collection sound
   - Leaf sinking warning sound
   - Life lost sound
   - Game over sound

#### Phase 2: Polish (Future)
- Smooth animations
- Better graphics/sprites
- Multiple levels with varying difficulty
- Different lake shapes
- Adjustable sinking speed
- Mobile touch controls

## Configurable Constants (Easy to Modify)
```typescript
GRID_SIZE = 8
INITIAL_LIVES = 5
LEAF_LEVELS = 3
SINK_RATE = 1 // levels per second
RESPAWN_TIME_MIN = 1000 // ms
RESPAWN_TIME_MAX = 3000 // ms
INITIAL_LEAF_COVERAGE = 0.8 // 80% of grid
```

## File Structure for Modularity

### Game Engine (Logic Only)
- No rendering code
- Pure functions where possible
- Easily testable
- Returns state objects

### Rendering Layer
- Receives state from engine
- Maps state to visuals
- Can be swapped without touching engine
- Graphics config file for easy asset replacement

## Implementation Steps

1. **Setup** (30 min)
   - Initialize React + TypeScript + Webpack
   - Configure Tailwind CSS
   - Set up project structure

2. **Game Engine Core** (2-3 hours)
   - Type definitions
   - GameEngine class with core logic
   - Grid system
   - Bird movement validation
   - Leaf state management

3. **Rendering** (1-2 hours)
   - Basic components with geometric shapes
   - Grid rendering
   - Bird, Leaf, Food components
   - HUD component

4. **Game Loop** (1 hour)
   - useGameLoop hook with requestAnimationFrame
   - Time-based updates
   - State synchronization

5. **Leaf Mechanics** (2 hours)
   - Sinking logic (time-based)
   - Emerging when bird leaves
   - Respawning system
   - Food-leaf pinning

6. **Lives & Game Over** (1 hour)
   - Life tracking
   - Death detection
   - Game over state
   - Restart functionality

7. **Scoring** (30 min)
   - Score tracking
   - Display updates

8. **Sound Effects** (1 hour)
   - Sound manager setup
   - Event-triggered sounds
   - Basic sound files (can use beeps initially)

9. **Testing & Polish** (1-2 hours)
   - Gameplay testing
   - Bug fixes
   - Balance adjustments

**Total Estimated Time**: 10-13 hours

## Future Extensibility

The modular architecture allows for:
- Easy graphics replacement (swap rendering components)
- Level system addition (config-based difficulty)
- Different game modes (time trials, survival)
- Power-ups and special leaves
- Multiplayer support
- Mobile controls layer
- Animation system integration
