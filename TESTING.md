# Testing Guide

## Playwright Browser Testing

The game includes comprehensive browser automation tests using Playwright.

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Debug tests
npm run test:debug
```

### Test Coverage

**13 tests covering:**

1. ✅ **Initial game state** - Verifies game loads with correct HUD (score, lives)
2. ✅ **Rendering** - Checks leaves and bird are visible on board
3. ✅ **Arrow key movement** - Tests bird movement with arrow keys
4. ✅ **WASD movement** - Tests bird movement with WASD keys
5. ✅ **Food collection** - Verifies score increases when collecting food
6. ✅ **Leaf sinking** - Tests leaves sink over time
7. ✅ **Life loss** - Checks life decrease mechanism
8. ✅ **Game over state** - Verifies game over screen behavior
9. ✅ **Restart functionality** - Tests game can be restarted
10. ✅ **Keyboard navigation** - All four directions work correctly
11. ✅ **Grid structure** - Game board has correct dimensions (480x480)
12. ✅ **Visual regression** - Screenshots for visual comparison
13. ✅ **Debug test** - Verifies CSS and rendering pipeline

### Test Results

All tests pass successfully! The game:
- Renders correctly with Tailwind CSS v4
- Responds to keyboard input
- Has proper game mechanics (movement, collision, scoring)
- Shows 51 leaves initially (80% coverage of 8x8 grid)
- Displays 5 food items
- Maintains 5 lives at start

### Screenshots

Test screenshots are saved to `tests/screenshots/`:
- `game-initial-full.png` - Full viewport of initial game state
- `game-board-initial.png` - Just the game board
- `initial-state.png` - Before movement
- `after-move.png` - After bird moves
- `leaves-sinking.png` - Showing leaf sinking behavior
- `after-waiting.png` - Game state after time passes
- `debug-full.png` - Debug visualization

### Key Findings

✅ **Game board**: Blue water background (480x480px)
✅ **Leaves**: Green circles that fill cells, proper opacity
✅ **Bird**: Orange circle with eye detail, visible and moveable
✅ **Food**: Yellow dots on leaves
✅ **HUD**: Score and heart indicators working
✅ **Keyboard controls**: Both arrow keys and WASD functional

### Issues Fixed During Testing

1. **Tailwind CSS v4 syntax**: Changed from `@tailwind` directives to `@import "tailwindcss"`
2. **TypeScript strict mode**: Added explicit undefined type to useRef
3. **Chromium fullPage crash**: Disabled fullPage screenshots to prevent memory issues

## Manual Testing

The dev server is running at http://localhost:3000

### Manual Test Scenarios

1. **Basic Movement**
   - Use arrow keys or WASD to move the bird
   - Bird should only move to adjacent leaves
   - Movement should be blocked at grid boundaries

2. **Food Collection**
   - Navigate to yellow dots on leaves
   - Score should increase by 10 points
   - Food should disappear after collection

3. **Leaf Sinking**
   - Move away from a leaf and watch it sink
   - Leaves should shrink over ~3 seconds
   - Leaves you've stepped on should emerge back to full size

4. **Life Loss**
   - Wait for a leaf to fully sink
   - Try to move back to it
   - A heart should disappear from HUD
   - Bird should respawn on a random full-height leaf

5. **Game Over**
   - Lose all 5 lives
   - Game Over screen should appear
   - Click "New Game" to restart

## Future Test Additions

Consider adding:
- Unit tests for GameEngine logic (Jest)
- E2E test for complete game playthrough
- Performance tests for game loop
- Visual regression baseline images
- Mobile touch interaction tests (when implemented)
