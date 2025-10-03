# Leaves - Bird Game

A React-based game where a bird jumps between leaves on a lake, collecting food while avoiding sinking leaves.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm start
```
This will start the development server and open the game in your browser at http://localhost:3000

### Build for Production
```bash
npm run build
```
The production build will be created in the `dist` folder.

## How to Play

### Controls
- **Arrow Keys** or **WASD** - Move the bird (up, down, left, right)
- The bird can only move to adjacent leaves (one square at a time)

### Game Mechanics
- **Leaves**: Start at full size (level 3) and sink 1 level per second when the bird is not on them
- **Leaves with Food**: Stay at full height until the food is collected
- **Emerging Leaves**: Partially sunk leaves return to full height when the bird leaves them
- **Respawning**: Fully sunk leaves respawn after 1-3 seconds at random positions
- **Lives**: Start with 5 lives. Lose a life when standing on a fully sunk leaf
- **Score**: Collect food items (yellow dots) to increase your score by 10 points each
- **Game Over**: The game ends when all lives are lost

### Tips
- Watch the size of leaves - smaller leaves are closer to sinking!
- Plan your route to collect food while avoiding sinking leaves
- Leaves you've stepped on will emerge back to full height, creating safe paths

## Technical Details

### Project Structure
```
src/
├── components/      # React components (rendering layer)
├── engine/          # Game logic (GameEngine, types, constants)
├── hooks/           # Custom React hooks (game loop)
├── utils/           # Utility functions (leaf management, sound)
└── index.tsx        # Entry point
```

### Architecture
- **Modular Design**: Game engine separated from rendering for easy graphics replacement
- **Configurable**: All game parameters in `src/engine/constants.ts`
- **Type-Safe**: Full TypeScript support
- **Sound Effects**: Web Audio API for game sounds

### Configuration
Edit `src/engine/constants.ts` to modify:
- Grid size
- Number of lives
- Leaf levels
- Sink rate
- Respawn timing
- Initial leaf coverage
- Food count

## Technologies Used
- React 19
- TypeScript
- Webpack
- Tailwind CSS
- Web Audio API
