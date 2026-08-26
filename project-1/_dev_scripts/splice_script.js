const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'script.js');
let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

const injection = `                    }
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
            const svgH = svg.offsetHeight || timeline.offsetHeight;`;

lines.splice(270, 0, ...injection.split('\n'));

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Successfully spliced the missing variables into script.js by array index.');
