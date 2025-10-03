import { test, expect } from '@playwright/test';

test('debug rendering issue', async ({ page }) => {
  // Listen for console messages
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log(`Page error: ${error.message}`);
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Check computed styles
  const gameBoard = page.locator('.bg-blue-400').first();
  const bgColor = await gameBoard.evaluate(el => {
    return window.getComputedStyle(el).backgroundColor;
  });
  console.log('Game board background color:', bgColor);

  // Check if leaves are visible
  const leaf = page.locator('.bg-green-600').first();
  if (await leaf.count() > 0) {
    const leafColor = await leaf.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    const leafOpacity = await leaf.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('Leaf background color:', leafColor);
    console.log('Leaf opacity:', leafOpacity);
  }

  // Take a screenshot with more details
  await page.screenshot({
    path: 'tests/screenshots/debug-full.png',
    fullPage: false
  });

  // Check if Tailwind CSS is loaded
  const stylesheets = await page.evaluate(() => {
    return Array.from(document.styleSheets).map(s => s.href || 'inline');
  });
  console.log('Loaded stylesheets:', stylesheets);
});
