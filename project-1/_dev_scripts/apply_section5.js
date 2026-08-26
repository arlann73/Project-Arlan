const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', 'script.js');
let script = fs.readFileSync(scriptPath, 'utf8');

const targetStart = "        // 5. Timeline SVG path dynamic generator and draw";
const targetEnd = "        tCards.forEach((card) => {";

const startIndex = script.indexOf(targetStart);
const endIndex = script.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find start or end markers in script.js');
    console.error('startIndex:', startIndex, 'endIndex:', endIndex);
    process.exit(1);
}

const replacement = `        // 5. Timeline SVG path dynamic generator and scroll-driven draw
        const timeline = document.querySelector('.timeline');
        const svg = document.querySelector('.timeline-path-svg');
        const curveBase = document.getElementById('timeline-curve-base');
        const curveActive = document.getElementById('timeline-curve-active');
        const signalDot = document.getElementById('timeline-signal');
        const tCards = gsap.utils.toArray('.timeline-card');

        let timelineCurrentProgress = 0;

        function updateTimelinePath() {
            if (!timeline || !svg || !curveBase || !curveActive || tCards.length === 0) return;

            const svgRect = svg.getBoundingClientRect();
            const svgW = svg.offsetWidth || svgRect.width;
            const svgH = svg.offsetHeight || timeline.offsetHeight;
            if (svgW <= 0 || svgH <= 0) return;

            svg.setAttribute('viewBox', \`0 0 \${svgW} \${svgH}\`);

            const scaleX = svgRect.width > 0 ? (svgW / svgRect.width) : 1;
            const scaleY = svgRect.height > 0 ? (svgH / svgRect.height) : 1;

            // 1. Gather all island image measurements and centers
            const cardData = tCards.map((card) => {
                const img = card.querySelector('.timeline-island-img') || card;
                const imgRect = img.getBoundingClientRect();
                
                const ix = (imgRect.left - svgRect.left) * scaleX;
                const iy = (imgRect.top - svgRect.top) * scaleY;
                const iw = imgRect.width * scaleX;
                const ih = imgRect.height * scaleY;

                return {
                    card,
                    side: card.getAttribute('data-side') || 'center',
                    cx: ix + iw * 0.5,
                    cy: iy + ih * 0.5,
                    w: iw,
                    h: ih
                };
            });

            // 2. Compute dynamic, direction-aware anchor points for each island
            const anchors = [];
            for (let i = 0; i < cardData.length; i++) {
                const c = cardData[i];
                
                // Outgoing direction to next island
                let dirX = 0, dirY = 1;
                if (i < cardData.length - 1) {
                    const nextC = cardData[i + 1];
                    const dx = nextC.cx - c.cx;
                    const dy = nextC.cy - c.cy;
                    const dist = Math.hypot(dx, dy) || 1;
                    dirX = dx / dist;
                    dirY = dy / dist;
                }

                // Incoming direction from previous island
                let prevDirX = 0, prevDirY = 1;
                if (i > 0) {
                    const prevC = cardData[i - 1];
                    const dx = c.cx - prevC.cx;
                    const dy = c.cy - prevC.cy;
                    const dist = Math.hypot(dx, dy) || 1;
                    prevDirX = dx / dist;
                    prevDirY = dy / dist;
                }

                // Entry anchor: on the edge facing the incoming trajectory (underneath artwork)
                const enter = {
                    x: c.cx - prevDirX * (c.w * 0.26),
                    y: c.cy - Math.max(prevDirY, 0.35) * (c.h * 0.28)
                };

                // Exit anchor: on the edge facing the destination trajectory (underneath artwork)
                const exit = {
                    x: c.cx + dirX * (c.w * 0.26),
                    y: c.cy + Math.max(dirY, 0.35) * (c.h * 0.28)
                };

                anchors.push({ enter, exit });
            }

            // 3. Construct the continuous smooth Bézier trajectory through negative space
            let pathD = '';
            for (let i = 0; i < cardData.length; i++) {
                const { enter, exit } = anchors[i];
                if (i === 0) {
                    // Soft intro approach from above
                    const startY = Math.max(0, enter.y - 100);
                    pathD = \`M \${(enter.x - 12).toFixed(1)} \${startY.toFixed(1)} C \${(enter.x - 6).toFixed(1)} \${(enter.y - 50).toFixed(1)}, \${enter.x.toFixed(1)} \${(enter.y - 20).toFixed(1)}, \${enter.x.toFixed(1)} \${enter.y.toFixed(1)}\`;
                    pathD += \` L \${exit.x.toFixed(1)} \${exit.y.toFixed(1)}\`;
                } else {
                    const prevExit = anchors[i - 1].exit;
                    const spanX = enter.x - prevExit.x;
                    const spanY = enter.y - prevExit.y;

                    // Bézier control points: curve gracefully through the vertical negative space avoiding text
                    const cp1 = {
                        x: prevExit.x + spanX * 0.12,
                        y: prevExit.y + spanY * 0.50
                    };
                    const cp2 = {
                        x: enter.x - spanX * 0.12,
                        y: enter.y - spanY * 0.50
                    };

                    pathD += \` C \${cp1.x.toFixed(1)} \${cp1.y.toFixed(1)}, \${cp2.x.toFixed(1)} \${cp2.y.toFixed(1)}, \${enter.x.toFixed(1)} \${enter.y.toFixed(1)}\`;
                    pathD += \` L \${exit.x.toFixed(1)} \${exit.y.toFixed(1)}\`;
                }
            }

            curveBase.setAttribute('d', pathD);
            curveActive.setAttribute('d', pathD);

            const pathLength = curveActive.getTotalLength();
            window.timelinePathLength = pathLength;
            if (pathLength && !isNaN(pathLength)) {
                curveActive.style.strokeDasharray = pathLength + ' ' + (pathLength * 2);
                const currentOffset = pathLength * (1 - timelineCurrentProgress);
                curveActive.style.strokeDashoffset = currentOffset;

                if (signalDot) {
                    if (timelineCurrentProgress > 0.005) {
                        signalDot.style.visibility = 'visible';
                        const point = curveActive.getPointAtLength(pathLength * timelineCurrentProgress);
                        signalDot.setAttribute('transform', \`translate(\${point.x}, \${point.y})\`);
                    } else {
                        signalDot.style.visibility = 'hidden';
                    }
                }
            }
        }

        // Setup ScrollTrigger for progressive active path drawing & waypoint travel
        if (tCards.length > 0) {
            const firstCard = tCards[0];
            const lastCard = tCards[tCards.length - 1];

            ScrollTrigger.create({
                trigger: firstCard,
                endTrigger: lastCard,
                start: "top 65%",
                end: "bottom 35%",
                scrub: 0.8,
                onUpdate: (self) => {
                    timelineCurrentProgress = self.progress;
                    const len = window.timelinePathLength || (curveActive ? curveActive.getTotalLength() : 0);
                    if (!len || isNaN(len)) return;

                    curveActive.style.strokeDasharray = len + ' ' + (len * 2);
                    const offset = len * (1 - self.progress);
                    curveActive.style.strokeDashoffset = offset;

                    if (signalDot) {
                        if (self.progress > 0.005) {
                            signalDot.style.visibility = 'visible';
                            const point = curveActive.getPointAtLength(len * self.progress);
                            signalDot.setAttribute('transform', \`translate(\${point.x}, \${point.y})\`);
                        } else {
                            signalDot.style.visibility = 'hidden';
                        }
                    }
                }
            });
        }

        // Initial path computation on load & dynamic observation
        updateTimelinePath();
        window.addEventListener('resize', updateTimelinePath);
        window.addEventListener('load', () => {
            updateTimelinePath();
            ScrollTrigger.refresh();
        });
        ScrollTrigger.addEventListener('refresh', updateTimelinePath);

        if (window.ResizeObserver && timeline) {
            const ro = new ResizeObserver(() => updateTimelinePath());
            ro.observe(timeline);
            tCards.forEach(c => ro.observe(c));
        }

        document.querySelectorAll('.timeline img').forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', () => {
                    updateTimelinePath();
                    ScrollTrigger.refresh();
                });
            }
        });

`;

const newScript = script.substring(0, startIndex) + replacement + script.substring(endIndex);
fs.writeFileSync(scriptPath, newScript, 'utf8');
console.log('Successfully updated Section 5 in script.js');
