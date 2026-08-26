const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'script.js');
let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

console.log(lines[268]);
console.log(lines[269]);
console.log(lines[270]);
console.log(lines[271]);
