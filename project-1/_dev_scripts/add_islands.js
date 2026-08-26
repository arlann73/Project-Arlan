const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const islands = [
    'assets/images/islands/island1.jpg',
    'assets/images/islands/island2.jpg',
    'assets/images/islands/island3.jpg'
];

let counter = 0;
html = html.replace(/<div class="timeline-card-inner">/g, (match) => {
    const islandImage = islands[counter % islands.length];
    counter++;
    return `<div class="timeline-card-inner" style="background-image: url('${islandImage}');">`;
});

fs.writeFileSync(filePath, html);
console.log('Successfully added island backgrounds to timeline cards.');
