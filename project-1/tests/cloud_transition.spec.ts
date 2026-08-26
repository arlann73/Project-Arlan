import { test, expect } from '@playwright/test';

test('Hero to About Cloud Wipe Transition visual and scroll test', async ({ page }) => {
    // Navigate to local server
    await page.goto('http://localhost:8080/index.html');
    await page.setViewportSize({ width: 1440, height: 900 });

    // Wait for GSAP and Lenis initialization
    await page.waitForTimeout(1000);

    // Initial state (Scroll 0)
    await page.screenshot({ path: 'screenshot_cloud_0.png' });

    // Scroll to 300px
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot_cloud_300.png' });

    // Verify clouds are moving up
    const c1Transform300 = await page.$eval('#c1', el => window.getComputedStyle(el).transform);
    console.log('c1 transform at 300px:', c1Transform300);

    // Scroll to 600px
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot_cloud_600.png' });

    // Scroll to 900px (near 100vh)
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot_cloud_900.png' });

    // Scroll to 1500px (into About timeline)
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot_cloud_1500.png' });

    // Scroll to 2500px (Timeline Islands active)
    await page.evaluate(() => window.scrollTo(0, 2500));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot_cloud_2500.png' });

    // Expect clouds to have transformed
    expect(c1Transform300).not.toBe('none');
});
