const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'script.js');
let script = fs.readFileSync(filePath, 'utf8');

const brokenTarget = `                        sidebarMatch.classList.add('is-active');
            svg.setAttribute('viewBox', \`0 0 \${svgW} \${svgH}\`);`;

const fixedContent = `                        sidebarMatch.classList.add('is-active');
                    }
                }
            });
        });

        // 5. Timeline SVG path dynamic generator and draw
        const timeline = document.querySelector('.timeline');
        const svg = document.querySelector('.timeline-path-svg');
        const curveBase = document.getElementById('timeline-curve-base');
        const curveActive = document.getElementById('timeline-curve-active');
        const signalDot = document.getElementById('timeline-signal');
        const tCards = gsap.utils.toArray('.timeline-card');

        function updateTimelinePath() {
            if (!timeline || !svg || !curveBase || !curveActive || tCards.length === 0) return;

            const svgRect = svg.getBoundingClientRect();
            const svgW = svg.offsetWidth || svgRect.width;
            const svgH = svg.offsetHeight || timeline.offsetHeight;

            svg.setAttribute('viewBox', \`0 0 \${svgW} \${svgH}\`);`;

script = script.replace(brokenTarget, fixedContent);

fs.writeFileSync(filePath, script);
console.log('Successfully injected the missing variable declarations into script.js');
