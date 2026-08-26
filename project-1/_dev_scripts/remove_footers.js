const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace the entire timeline-footer and its contents (which ends with the Read more button)
html = html.replace(/<div class="timeline-footer">[\s\S]*?<\/button>\s*<\/div>/g, '');

fs.writeFileSync(filePath, html);
console.log('Successfully removed timeline footers (logos, badges, read more).');
