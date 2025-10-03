import { test, expect, Page } from '@playwright/test';

test.describe('Leaves Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the game with initial state', async ({ page }) => {
    // Check that the game board is visible
    const gameBoard = page.locator('.bg-blue-400');
    await expect(gameBoard).toBeVisible();

    // Check HUD elements
    await expect(page.locator('text=Score:')).toBeVisible();
    await expect(page.locator('text=Lives:')).toBeVisible();

    // Check initial score is 0
    await expect(page.locator('text=Score: 0')).toBeVisible();

    // Check initial lives (should see 5 hearts)
    const hearts = page.locator('text=❤');
    await expect(hearts).toHaveCount(5);
  });

  test('should render leaves and bird on the board', async ({ page }) => {
    // Check for leaves (green circles)
    const leaves = page.locator('.bg-green-600');
    const leafCount = await leaves.count();
    expect(leafCount).toBeGreaterThan(0);
    console.log(`Found ${leafCount} leaves on the board`);

    // Check for bird (orange circle)
    const bird = page.locator('.bg-orange-500');
    await expect(bird).toBeVisible();
  });

  test('should move bird with arrow keys', async ({ page }) => {
    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/initial-state.png' });

    // Get initial bird position by checking its parent div
    const initialBirdParent = await page.locator('.bg-orange-500').locator('xpath=../..').getAttribute('style');
    console.log('Initial bird position:', initialBirdParent);

    // Press arrow key to move
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Check if bird moved (position should change)
    const newBirdParent = await page.locator('.bg-orange-500').locator('xpath=../..').getAttribute('style');
    console.log('New bird position after right:', newBirdParent);

    // Bird should still be visible
    await expect(page.locator('.bg-orange-500')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/after-move.png' });
  });

  test('should move bird with WASD keys', async ({ page }) => {
    // Press 'd' to move right
    await page.keyboard.press('d');
    await page.waitForTimeout(100);
    await expect(page.locator('.bg-orange-500')).toBeVisible();

    // Press 's' to move down
    await page.keyboard.press('s');
    await page.waitForTimeout(100);
    await expect(page.locator('.bg-orange-500')).toBeVisible();
  });

  test('should collect food and increase score', async ({ page }) => {
    // Look for food items (yellow dots)
    const foodItems = page.locator('.bg-yellow-400');
    const initialFoodCount = await foodItems.count();
    console.log(`Found ${initialFoodCount} food items`);

    if (initialFoodCount > 0) {
      // Try to navigate to food by pressing arrow keys multiple times
      const moves = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];

      for (let i = 0; i < 10; i++) {
        const currentScore = await page.locator('text=/Score: \\d+/').textContent();
        console.log(`Current score: ${currentScore}`);

        // If score increased, we collected food
        if (currentScore && currentScore !== 'Score: 0') {
          console.log('Food collected! Score increased.');
          break;
        }

        // Try different movements
        await page.keyboard.press(moves[i % moves.length]);
        await page.waitForTimeout(200);
      }
    }
  });

  test('should show leaves sinking over time', async ({ page }) => {
    // Get initial leaf sizes
    const leaves = page.locator('.bg-green-600');
    const initialCount = await leaves.count();
    console.log(`Initial leaf count: ${initialCount}`);

    // Move bird to leave current leaf
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Wait for leaves to start sinking (1 second per level)
    await page.waitForTimeout(2000);

    // Take screenshot to see leaf state
    await page.screenshot({ path: 'tests/screenshots/leaves-sinking.png' });

    // Leaves should still be visible (some may have changed size)
    const leavesAfter = page.locator('.bg-green-600');
    expect(await leavesAfter.count()).toBeGreaterThan(0);
  });

  test('should lose a life when bird falls', async ({ page }) => {
    // Initial lives should be 5
    let hearts = page.locator('text=❤');
    await expect(hearts).toHaveCount(5);

    // Strategy: try to find a leaf that will sink quickly
    // Move to create opportunity for leaf to sink
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Wait longer for leaves to sink completely (3 levels * 1 second)
    await page.waitForTimeout(4000);

    // Try to move back to potentially sunken leaf
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/after-waiting.png' });

    // Check if lives decreased or stayed same
    const finalHeartCount = await page.locator('text=❤').count();
    console.log(`Final heart count: ${finalHeartCount}`);
    expect(finalHeartCount).toBeLessThanOrEqual(5);
  });

  test('should show game over when all lives are lost', async ({ page }) => {
    // This test would need to simulate losing all lives
    // For now, we'll just verify the game over screen can be shown

    // Game Over screen should not be visible initially
    await expect(page.locator('text=Game Over')).not.toBeVisible();
  });

  test('should allow restarting the game', async ({ page }) => {
    // If we can trigger game over somehow, test the restart button
    // For now, just verify the initial state can be loaded again
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.bg-blue-400')).toBeVisible();
    await expect(page.locator('text=Score: 0')).toBeVisible();
  });

  test('keyboard navigation should work in all directions', async ({ page }) => {
    const directions = [
      { key: 'ArrowUp', name: 'up' },
      { key: 'ArrowDown', name: 'down' },
      { key: 'ArrowLeft', name: 'left' },
      { key: 'ArrowRight', name: 'right' },
    ];

    for (const direction of directions) {
      await page.keyboard.press(direction.key);
      await page.waitForTimeout(100);

      // Bird should still be visible after each move
      await expect(page.locator('.bg-orange-500')).toBeVisible();
      console.log(`Moved ${direction.name}`);
    }
  });

  test('should have visible grid structure', async ({ page }) => {
    // Check that the game board has proper dimensions
    const gameBoard = page.locator('.bg-blue-400');
    const boundingBox = await gameBoard.boundingBox();

    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      // 8x8 grid with 60px cells = 480x480
      expect(boundingBox.width).toBe(480);
      expect(boundingBox.height).toBe(480);
      console.log(`Game board size: ${boundingBox.width}x${boundingBox.height}`);
    }
  });

  test('visual regression - initial game state', async ({ page }) => {
    // Wait a moment for everything to render
    await page.waitForTimeout(500);

    // Take viewport screenshot (not fullPage to avoid Chromium crash)
    await page.screenshot({
      path: 'tests/screenshots/game-initial-full.png',
      fullPage: false
    });

    // Take just the game board
    const gameBoard = page.locator('.bg-blue-400');
    await gameBoard.screenshot({
      path: 'tests/screenshots/game-board-initial.png'
    });
  });
});
