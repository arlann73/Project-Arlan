const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'script.js');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// 1. Delete lines 322 to 512 (0-indexed: lines 321 to 511)
lines.splice(321, 191);

// 2. Insert the missing closing braces for the forEach loop
lines.splice(321, 0, '                }', '            });');

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Successfully removed the duplicated ghost code and fixed the syntax error.');
