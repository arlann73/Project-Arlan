const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', 'script.js');
let script = fs.readFileSync(scriptPath, 'utf8');

const targetStart = "            // 3. Construct the continuous smooth Bézier trajectory";
const targetEnd = "            curveBase.setAttribute('d', pathD);";

const startIndex = script.indexOf(targetStart);
const endIndex = script.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find start or end markers');
    process.exit(1);
}

const replacement = `            // 3. Construct the continuous smooth Bézier trajectory with Perfect Tangent Continuity
            
            // Helper for C1 continuity reflection
            const reflectPoint = (p, center) => ({
                x: center.x + (center.x - p.x),
                y: center.y + (center.y - p.y)
            });

            // Pre-calculate all inter-island negative space segments
            const interSegments = [];
            for (let i = 1; i < cardData.length; i++) {
                const prevExit = anchors[i - 1].exit;
                const enter = anchors[i].enter;
                const spanX = enter.x - prevExit.x;
                const spanY = enter.y - prevExit.y;

                const directionRatio = Math.abs(spanX) / (Math.abs(spanY) || 1);
                let rawCurveOffset = spanX * curveFactor * (1 + Math.min(directionRatio, 1.5) * 0.5);

                const maxOffset = Math.abs(spanX) * TRAJECTORY_CONFIG.MAX_CURVATURE_OFFSET_RATIO;
                const sign = spanX >= 0 ? 1 : -1;
                let clampedOffset = Math.max(TRAJECTORY_CONFIG.MIN_CURVATURE_OFFSET, Math.min(Math.abs(rawCurveOffset), maxOffset)) * sign;

                const cp1 = {
                    x: prevExit.x + clampedOffset,
                    y: prevExit.y + spanY * TRAJECTORY_CONFIG.VERTICAL_BIAS
                };

                const cp2 = {
                    x: enter.x - clampedOffset * (1 - TRAJECTORY_CONFIG.ARRIVAL_EASING_STRENGTH),
                    y: enter.y - spanY * (1 - TRAJECTORY_CONFIG.VERTICAL_BIAS + TRAJECTORY_CONFIG.ARRIVAL_EASING_STRENGTH * 0.3)
                };

                interSegments.push({ cp1, cp2 });
            }

            // Intro setup for first island
            const firstEnter = anchors[0].enter;
            const introStartY = Math.max(0, firstEnter.y - 110);
            const introCp1 = { x: firstEnter.x - 12, y: firstEnter.y - 60 };
            const introCp2 = { x: firstEnter.x, y: firstEnter.y - 25 };

            let pathD = \`M \${(firstEnter.x - 18).toFixed(1)} \${introStartY.toFixed(1)} C \${introCp1.x.toFixed(1)} \${introCp1.y.toFixed(1)}, \${introCp2.x.toFixed(1)} \${introCp2.y.toFixed(1)}, \${firstEnter.x.toFixed(1)} \${firstEnter.y.toFixed(1)}\`;

            // Build full path ensuring PERFECT tangent continuity (C1) across all anchors
            for (let i = 0; i < cardData.length; i++) {
                const { enter, exit } = anchors[i];
                
                // Determine incoming tangent (cp2) and outgoing tangent (cp1)
                let incomingCp2, outgoingCp1;
                
                if (i === 0) {
                    incomingCp2 = introCp2;
                } else {
                    incomingCp2 = interSegments[i - 1].cp2;
                }

                if (i < cardData.length - 1) {
                    outgoingCp1 = interSegments[i].cp1;
                } else {
                    // Last island exit just flows straight down smoothly
                    outgoingCp1 = { x: exit.x, y: exit.y + 50 };
                }

                // Internal crossing perfectly follows main curve tangents! (No forced elbows)
                const internalCp1 = reflectPoint(incomingCp2, enter);
                const internalCp2 = reflectPoint(outgoingCp1, exit);
                
                pathD += \` C \${internalCp1.x.toFixed(1)} \${internalCp1.y.toFixed(1)}, \${internalCp2.x.toFixed(1)} \${internalCp2.y.toFixed(1)}, \${exit.x.toFixed(1)} \${exit.y.toFixed(1)}\`;

                // Add the pre-calculated negative space segment
                if (i < cardData.length - 1) {
                    const nextEnter = anchors[i + 1].enter;
                    const { cp1, cp2 } = interSegments[i];
                    pathD += \` C \${cp1.x.toFixed(1)} \${cp1.y.toFixed(1)}, \${cp2.x.toFixed(1)} \${cp2.y.toFixed(1)}, \${nextEnter.x.toFixed(1)} \${nextEnter.y.toFixed(1)}\`;
                }
            }

`;

const newScript = script.substring(0, startIndex) + replacement + script.substring(endIndex);
fs.writeFileSync(scriptPath, newScript, 'utf8');
console.log('Successfully updated script.js with perfect C1 tangent continuity.');
