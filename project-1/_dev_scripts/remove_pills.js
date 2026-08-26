const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove all `<div class="work-tags">...</div>` entirely from the HTML.
// Using a regex to match the div and its contents.
html = html.replace(/<div class="work-tags">.*?<\/div>\r?\n?/g, '');

fs.writeFileSync('index.html', html);
console.log('Removed all work-tags pill components.');
