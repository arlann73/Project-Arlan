const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace <div class="timeline-dot"></div> and <div class="timeline-dot timeline-dot--active"></div>
html = html.replace(/<div class="timeline-dot.*?<\/div>/g, '');

fs.writeFileSync(filePath, html);
console.log('Successfully removed all timeline-dot elements from HTML.');
