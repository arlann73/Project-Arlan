const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// More conservative positions to fit the main content neatly
const positions = [
    'top: -10px; left: -10px; text-align: left;', // 1: Top-Left
    'bottom: -10px; right: -10px; text-align: right;', // 2: Bottom-Right
    'top: -10px; right: -10px; text-align: right;', // 3: Top-Right
    'bottom: -10px; left: -10px; text-align: left;', // 4: Bottom-Left
    'top: 50%; left: -30px; transform: translateY(-50%); text-align: left;', // 5: Center-Left
    'top: -30px; left: 50%; transform: translateX(-50%); text-align: center;', // 6: Top-Center
    'top: 50%; right: -30px; transform: translateY(-50%); text-align: right;', // 7: Center-Right
    'bottom: -30px; left: 50%; transform: translateX(-50%); text-align: center;', // 8: Bottom-Center
    'top: 0px; left: 0px; text-align: left;' // 9: Top-Left
];

let counter = 0;
html = html.replace(/<div class="timeline-text-content"[^>]*>/g, (match) => {
    if (counter >= positions.length) return match;
    const style = positions[counter];
    counter++;
    return `<div class="timeline-text-content" style="${style}">`;
});

fs.writeFileSync(filePath, html);
console.log('Successfully injected neater text coordinates.');
