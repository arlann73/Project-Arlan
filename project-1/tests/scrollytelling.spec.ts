import { test, expect, Page } from '@playwright/test';
import path from 'path';

// Use the baseURL configured in playwright.config.ts
const indexUrl = '/';

// Helper: simulate real human mouse wheel scroll to properly trigger Lenis and GSAP in headless mode
async function simulateRealScroll(page: Page, targetY: number) {
  // We don't want to just jump, we want to roll the wheel slowly
  const currentY = await page.evaluate(() => window.scrollY);
  const distance = targetY - currentY;
  
  if (Math.abs(distance) < 10) return;

  const steps = Math.floor(Math.abs(distance) / 100); // 100px per wheel tick
  const sign = Math.sign(distance);

  // Move mouse to center of page so wheel events hit the document
  await page.mouse.move(500, 500);

  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, sign * 100);
    // Wait for requestAnimationFrame to process the wheel event
    await page.waitForTimeout(50);
  }
  
  // Wait for the physics engine to settle (Lenis + GSAP dead-zone camera)
  await page.waitForTimeout(2000);
}

// Helper: get the about section's ScrollTrigger scroll range
async function getAboutScrollRange(page: Page) {
  return await page.evaluate(() => {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return { start: 0, end: 5000 };
    const rect = aboutSection.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const start = scrollTop + rect.top;
    // The total scroll weight determines the end distance
    const totalWeight = (window as any).timelineTotalScrollWeight || 3000;
    const end = start + totalWeight * 2.0;
    return { start, end, totalWeight };
  });
}

test.describe('Scrollytelling Credits-Film Effect — About Me Timeline', () => {
  // Simulating human scroll takes a long time, so we increase the timeout to 90 seconds
  test.setTimeout(90000);

  test.beforeEach(async ({ page }) => {
    // Listen for all console logs and errors to debug why ScrollTrigger isn't initializing
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('ScrollTrigger')) {
        console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`);
      }
    });
    page.on('pageerror', exception => {
      console.log(`[PAGE ERROR] Uncaught exception: ${exception}`);
    });

    await page.goto(indexUrl);
    // Wait for page, GSAP, Lenis, and ScrollTrigger to initialize
    await page.waitForTimeout(4000);
  });

  test('extended content elements exist on islands 2-8', async ({ page }) => {
    const cards = await page.locator('.timeline-card').all();
    expect(cards.length).toBe(9);

    for (let i = 1; i <= 7; i++) {
      const extContent = cards[i].locator('.timeline-extended-content');
      await expect(extContent).toHaveCount(1);
    }
  });

  test('extended content starts hidden (opacity 0) before scroll', async ({ page }) => {
    const extendedEls = await page.locator('.timeline-extended-content').all();
    for (const el of extendedEls) {
      const opacity = await el.evaluate((e) => window.getComputedStyle(e).opacity);
      expect(Number(opacity)).toBe(0);
    }
  });

  test('ScrollTrigger is initialized and pinning the about-section', async ({ page }) => {
    // Check if there is any ScrollTrigger instance that pins
    const hasPin = await page.evaluate(() => {
      const st = (window as any).ScrollTrigger;
      if (!st) return false;
      const triggers = st.getAll();
      return triggers.some((t: any) => t.pin !== null && t.pin !== undefined);
    });
    
    // Also check if tCards was populated correctly
    const tCardsLength = await page.evaluate(() => {
      return (window as any).tCards ? (window as any).tCards.length : -1;
    });

    console.log('ScrollTrigger has pin:', hasPin, 'tCards length:', tCardsLength);
    expect(hasPin).toBe(true);
  });
  
  test('text scrolls from bottom to top when island is docked', async ({ page }) => {
    // Get the about section scroll range
    const range = await getAboutScrollRange(page);

    // Scroll to ~25% into the about section (should dock at island 2 or 3)
    const targetScroll = range.start + (range.end - range.start) * 0.25;
    await simulateRealScroll(page, targetScroll);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/scrollytelling-dock-island2.png', fullPage: false });

    // Check if any extended content has become visible (opacity > 0)
    const anyVisible = await page.evaluate(() => {
      const els = document.querySelectorAll('.timeline-extended-content');
      for (const el of els) {
        const opacity = Number(window.getComputedStyle(el).opacity);
        if (opacity > 0) return true;
      }
      return false;
    });

    expect(anyVisible).toBe(true);
  });

  test('text persists visible after leaving island', async ({ page }) => {
    // Scroll to ~50% into the about section (should have passed island 2)
    const range = await getAboutScrollRange(page);
    const targetScroll = range.start + (range.end - range.start) * 0.50;
    await simulateRealScroll(page, targetScroll);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/scrollytelling-after-island2.png', fullPage: false });

    // Check that at least one extended content that was previously visited is still visible
    const persistsVisible = await page.evaluate(() => {
      const cards = document.querySelectorAll('.timeline-card');
      // Check island 2 (index 1) — should have been visited and still visible
      const card = cards[1];
      if (!card) return false;
      const ext = card.querySelector('.timeline-extended-content');
      if (!ext) return false;
      return Number(window.getComputedStyle(ext).opacity) === 1;
    });

    expect(persistsVisible).toBe(true);
  });

  test('scroll reverse makes text scroll back down', async ({ page }) => {
    const range = await getAboutScrollRange(page);

    // First scroll forward to ~40%
    const forwardScroll = range.start + (range.end - range.start) * 0.40;
    await simulateRealScroll(page, forwardScroll);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/scrollytelling-before-reverse.png', fullPage: false });

    // Now scroll back to near the start of the about section
    const reverseScroll = range.start + 100;
    await simulateRealScroll(page, reverseScroll);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/scrollytelling-after-reverse.png', fullPage: false });

    // After scrolling back, extended content should be hidden again
    const anyHidden = await page.evaluate(() => {
      const els = document.querySelectorAll('.timeline-extended-content');
      for (const el of els) {
        if (Number(window.getComputedStyle(el).opacity) === 0) return true;
      }
      return false;
    });

    expect(anyHidden).toBe(true);
  });

  test('first island (index 0) and last island (index 8) have no scrollytelling', async ({ page }) => {
    const range = await getAboutScrollRange(page);

    // Scroll to ~80% (deep into timeline, past most islands)
    const targetScroll = range.start + (range.end - range.start) * 0.80;
    await simulateRealScroll(page, targetScroll);
    await page.waitForTimeout(2000);

    // First island — should remain hidden
    const firstHidden = await page.evaluate(() => {
      const cards = document.querySelectorAll('.timeline-card');
      const ext = cards[0]?.querySelector('.timeline-extended-content');
      if (!ext) return true; // no element = correctly skipped
      return Number(window.getComputedStyle(ext).opacity) === 0;
    });
    expect(firstHidden).toBe(true);

    // Last island — should remain hidden
    const lastHidden = await page.evaluate(() => {
      const cards = document.querySelectorAll('.timeline-card');
      const ext = cards[cards.length - 1]?.querySelector('.timeline-extended-content');
      if (!ext) return true;
      return Number(window.getComputedStyle(ext).opacity) === 0;
    });
    expect(lastHidden).toBe(true);
  });

  test('horizontal positioning maintained (left/right per data-side)', async ({ page }) => {
    const range = await getAboutScrollRange(page);

    // Scroll to ~30% to activate some islands
    const targetScroll = range.start + (range.end - range.start) * 0.30;
    await simulateRealScroll(page, targetScroll);
    await page.waitForTimeout(2000);

    // Check left-side positioning
    const leftOk = await page.evaluate(() => {
      const els = document.querySelectorAll('.timeline-card[data-side="left"] .timeline-extended-content');
      for (const el of els) {
        const left = window.getComputedStyle(el).left;
        if (left !== 'auto' && parseInt(left) > 0) return true;
      }
      return els.length === 0; // OK if no left-side cards found
    });
    expect(leftOk).toBe(true);

    // Check right-side positioning
    const rightOk = await page.evaluate(() => {
      const els = document.querySelectorAll('.timeline-card[data-side="right"] .timeline-extended-content');
      for (const el of els) {
        const right = window.getComputedStyle(el).right;
        if (right !== 'auto' && parseInt(right) > 0) return true;
      }
      return els.length === 0;
    });
    expect(rightOk).toBe(true);
  });

});
