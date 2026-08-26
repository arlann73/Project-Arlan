const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'script.js');
let script = fs.readFileSync(filePath, 'utf8');

// 1. Replace variables at the top of the timeline logic
const brokenVars = `        // 5. Timeline SVG path dynamic generator and draw
        const timeline = document.querySelector('.timeline');
        const svg = document.querySelector('.timeline-path-svg');
        const curve = document.getElementById('timeline-curve');
        const dashedCurve = document.getElementById('timeline-curve-dashed');
        const tCards = gsap.utils.toArray('.timeline-card');

        function updateTimelinePath() {
            if (!timeline || !svg || !curve || tCards.length === 0) return;`;

const fixedVars = `        // 5. Timeline SVG path dynamic generator and draw
        const timeline = document.querySelector('.timeline');
        const svg = document.querySelector('.timeline-path-svg');
        const curveBase = document.getElementById('timeline-curve-base');
        const curveActive = document.getElementById('timeline-curve-active');
        const signalDot = document.getElementById('timeline-signal');
        const tCards = gsap.utils.toArray('.timeline-card');

        function updateTimelinePath() {
            if (!timeline || !svg || !curveBase || !curveActive || tCards.length === 0) return;`;

script = script.replace(brokenVars, fixedVars);

// 2. Fix the syntax errors and duplicated pathLength logic in updateTimelinePath
const brokenLogic = `            curveBase.setAttribute('d', pathD);
            curveActive.setAttribute('d', pathD);

            const pathLength = curveActive.getTotalLength(); window.timelinePathLength = pathLength;
            if (pathLength && !isNaN(pathLength)) {
                curveActive.style.strokeDasharray = pathLength + ' ' + (pathLength * 2);
                curveActive.style.strokeDashoffset = pathLength;
            }
            if(signalDot) {
                signalDot.style.visibility = 'hidden';
            }
 {
                dashRect.setAttribute('x', '0');
                dashRect.setAttribute('y', \`\${lastBottomY}\`);
                dashRect.setAttribute('width', \`\${svgW}\`);
            }

            const pathLength = curve.getTotalLength(); window.timelinePathLength = pathLength;
            if (pathLength && !isNaN(pathLength)) {
                curve.style.strokeDasharray = pathLength;
                curve.style.strokeDashoffset = pathLength;
            }`;

const fixedLogic = `            curveBase.setAttribute('d', pathD);
            curveActive.setAttribute('d', pathD);

            const pathLength = curveActive.getTotalLength(); 
            window.timelinePathLength = pathLength;
            
            if (pathLength && !isNaN(pathLength)) {
                curveActive.style.strokeDasharray = pathLength + ' ' + (pathLength * 2);
                curveActive.style.strokeDashoffset = pathLength; // Hide initially
            }
            
            if (signalDot) {
                // Ensure dot is hidden initially before scrolling triggers
                signalDot.style.visibility = 'hidden';
            }`;

script = script.replace(brokenLogic, fixedLogic);

fs.writeFileSync(filePath, script);
console.log('Fixed script.js successfully!');
