const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');
data = data.split('<img loading=" lazy\\').join('<img loading="lazy"');
fs.writeFileSync('index.html', data);
console.log('Fixed img tags');
