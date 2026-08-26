const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    
    // Load local index.html
    const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    
    // Wait for timeline to be visible
    await page.waitForSelector('.timeline-card');
    
    // Scroll down slowly to trigger GSAP ScrollTrigger
    for (let i = 0; i < 20; i++) {
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(100);
    }
    
    // Take screenshot of the about section
    const aboutSection = await page.$('.about-section');
    await aboutSection.screenshot({ path: 'debug_timeline.png' });
    
    // Take screenshot of the whole page just in case
    await page.screenshot({ path: 'debug_full.png', fullPage: true });

    // Extract DOM state of first timeline card
    const cardHTML = await page.evaluate(() => {
        const card = document.querySelector('.timeline-card:nth-child(1)');
        if (!card) return null;
        return {
            classes: card.className,
            html: card.innerHTML
        };
    });
    console.log("Card 1 State:", cardHTML);
    
    await browser.close();
})();
