const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Remove the style attribute from timeline-text-content
html = html.replace(/<div class="timeline-text-content" style="[^"]*">/g, '<div class="timeline-text-content">');

fs.writeFileSync(filePath, html);
console.log('Successfully stripped inline layout styles from timeline text content.');
