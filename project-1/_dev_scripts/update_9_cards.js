const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const islandsToUse = [
    'assets/images/islands/ice_island1.jpg', // 19
    'assets/images/islands/ice_island2.jpg', // 21
    'assets/images/islands/ice_island3.jpg', // 22
    'assets/images/islands/ice_island4.jpg', // 22
    'assets/images/islands/ice_island5.jpg', // 22 (New fixed variation)
    'assets/images/islands/ice_island6.jpg', // 23
    'assets/images/islands/ice_island7.jpg', // 23
    'assets/images/islands/ice_island8.jpg', // 25
    'assets/images/islands/ice_island9.jpg'  // 26 (New fixed variation)
];

let counter = 0;
html = html.replace(/<div class="timeline-card-inner"[^>]*>/g, (match) => {
    if (counter >= islandsToUse.length) return match;
    const islandImage = islandsToUse[counter];
    counter++;
    return `<div class="timeline-card-inner" style="background-image: url('${islandImage}');">`;
});

fs.writeFileSync(filePath, html);
console.log('Successfully updated all 9 timeline cards.');
