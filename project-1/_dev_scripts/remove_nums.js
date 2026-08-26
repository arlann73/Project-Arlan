const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove all `<span class="work-num">...</span>` from the HTML.
html = html.replace(/\s*<span class="work-num">.*?<\/span>\r?\n?/g, '');

fs.writeFileSync('index.html', html);
console.log('Removed all work-num pill components.');
