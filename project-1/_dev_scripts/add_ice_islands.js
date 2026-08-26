const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

let counter = 1;
html = html.replace(/<div class="timeline-card-inner"[^>]*>/g, (match) => {
    // Only replace up to 8 times
    if (counter > 8) return match;
    const islandImage = `assets/images/islands/ice_island${counter}.jpg`;
    counter++;
    return `<div class="timeline-card-inner" style="background-image: url('${islandImage}');">`;
});

fs.writeFileSync(filePath, html);
console.log('Successfully updated 8 timeline cards to use unique ice islands.');
