const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', 'script.js');
let script = fs.readFileSync(scriptPath, 'utf8');

const targetStart = "        // 5. Timeline SVG path dynamic generator and scroll-driven draw";
const targetEnd = "        tCards.forEach((card) => {";

const startIndex = script.indexOf(targetStart);
const endIndex = script.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find start or end markers in script.js');
    process.exit(1);
}

const replacement = `        // 5. Timeline SVG path dynamic generator and scroll-driven draw
        // --- TRAJECTORY GEOMETRY ENGINE ---
        const TRAJECTORY_CONFIG = {
            // Dynamic Anchor Offsets (submerged into island solid mass)
            ANCHOR_DEPTH_X: 0.28,
            ANCHOR_DEPTH_Y: 0.30,
            
            // Multi-factor Curvature Multipliers
            CURVE_FACTOR_DESKTOP: 0.16,
            CURVE_FACTOR_MOBILE: 0.22,
            VERTICAL_BIAS: 0.50,
            
            // Curvature Budget Guardrails (min & max horizontal swing in px)
            MIN_CURVATURE_OFFSET: 18,
            MAX_CURVATURE_OFFSET_RATIO: 0.35,
            
            // Arrival Easing (landing tangent alignment into target waypoint)
            ARRIVAL_EASING_STRENGTH: 0.20
        };

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
            const isMobile = window.innerWidth < 768;
            const curveFactor = isMobile ? TRAJECTORY_CONFIG.CURVE_FACTOR_MOBILE : TRAJECTORY_CONFIG.CURVE_FACTOR_DESKTOP;

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
                    x: c.cx - prevDirX * (c.w * TRAJECTORY_CONFIG.ANCHOR_DEPTH_X),
                    y: c.cy - Math.max(prevDirY, 0.35) * (c.h * TRAJECTORY_CONFIG.ANCHOR_DEPTH_Y)
                };

                // Exit anchor: on the edge facing the destination trajectory (underneath artwork)
                const exit = {
                    x: c.cx + dirX * (c.w * TRAJECTORY_CONFIG.ANCHOR_DEPTH_X),
                    y: c.cy + Math.max(dirY, 0.35) * (c.h * TRAJECTORY_CONFIG.ANCHOR_DEPTH_Y)
                };

                anchors.push({ enter, exit });
            }

            // 3. Construct the continuous smooth Bézier trajectory with Arrival Easing & Multi-factor Guardrails
            let pathD = '';
            for (let i = 0; i < cardData.length; i++) {
                const { enter, exit } = anchors[i];
                
                // Internal island crossing: smooth gentle curve under the island (zero straight lines)
                const internalSpanY = exit.y - enter.y;
                const internalCp1 = { x: enter.x, y: enter.y + internalSpanY * 0.5 };
                const internalCp2 = { x: exit.x, y: exit.y - internalSpanY * 0.5 };
                const internalSegment = \` C \${internalCp1.x.toFixed(1)} \${internalCp1.y.toFixed(1)}, \${internalCp2.x.toFixed(1)} \${internalCp2.y.toFixed(1)}, \${exit.x.toFixed(1)} \${exit.y.toFixed(1)}\`;

                if (i === 0) {
                    // Soft intro approach from above into first island
                    const introStartY = Math.max(0, enter.y - 110);
                    const introCp1 = { x: enter.x - 12, y: enter.y - 60 };
                    const introCp2 = { x: enter.x, y: enter.y - 25 };
                    pathD = \`M \${(enter.x - 18).toFixed(1)} \${introStartY.toFixed(1)} C \${introCp1.x.toFixed(1)} \${introCp1.y.toFixed(1)}, \${introCp2.x.toFixed(1)} \${introCp2.y.toFixed(1)}, \${enter.x.toFixed(1)} \${enter.y.toFixed(1)}\`;
                    pathD += internalSegment;
                } else {
                    const prevExit = anchors[i - 1].exit;
                    const spanX = enter.x - prevExit.x;
                    const spanY = enter.y - prevExit.y;

                    // Multi-factor calculation: distance × direction (dx/dy ratio) × viewport factor
                    const directionRatio = Math.abs(spanX) / (Math.abs(spanY) || 1);
                    let rawCurveOffset = spanX * curveFactor * (1 + Math.min(directionRatio, 1.5) * 0.5);

                    // Curvature Budget Guardrails (clamp min and max offset)
                    const maxOffset = Math.abs(spanX) * TRAJECTORY_CONFIG.MAX_CURVATURE_OFFSET_RATIO;
                    const sign = spanX >= 0 ? 1 : -1;
                    let clampedOffset = Math.max(TRAJECTORY_CONFIG.MIN_CURVATURE_OFFSET, Math.min(Math.abs(rawCurveOffset), maxOffset)) * sign;

                    // Control Point 1 (departure arc)
                    const cp1 = {
                        x: prevExit.x + clampedOffset,
                        y: prevExit.y + spanY * TRAJECTORY_CONFIG.VERTICAL_BIAS
                    };

                    // Control Point 2 (Arrival Easing: gently aligns with tangent before landing)
                    const cp2 = {
                        x: enter.x - clampedOffset * (1 - TRAJECTORY_CONFIG.ARRIVAL_EASING_STRENGTH),
                        y: enter.y - spanY * (1 - TRAJECTORY_CONFIG.VERTICAL_BIAS + TRAJECTORY_CONFIG.ARRIVAL_EASING_STRENGTH * 0.3)
                    };

                    pathD += \` C \${cp1.x.toFixed(1)} \${cp1.y.toFixed(1)}, \${cp2.x.toFixed(1)} \${cp2.y.toFixed(1)}, \${enter.x.toFixed(1)} \${enter.y.toFixed(1)}\`;
                    pathD += internalSegment;
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

        // Setup ScrollTrigger for progressive active path drawing & scroll-driven waypoint travel
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
console.log('Successfully updated script.js with locked trajectory geometry architecture.');
