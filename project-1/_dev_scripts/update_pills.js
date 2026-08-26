const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Disable all links on Project Cards
// We'll match <a href="..." target="_blank" class="work-card" id="work-card-X">
html = html.replace(/<a href="[^"]+" target="_blank" class="work-card"/g, '<a href="javascript:void(0)" class="work-card"');

// 2. Replace pill components (tags)
const newTags = [
  ['Excel', 'Corel Draw'], // Card 1
  ['Petrel', 'Corel Draw', 'Excel'], // Card 2
  ['Petrel', 'Corel Draw', 'Excel'], // Card 3
  ['Corel Draw'], // Card 4
  ['ArcGIS', 'Dips', 'Global Mapper'], // Card 5
  ['Minescape', 'Spry'], // Card 6
  ['Minescape', 'Spry'] // Card 7
];

let currentIndex = 0;
html = html.replace(/<div class="work-tags">[\s\S]*?<\/div>/g, (match) => {
  if (currentIndex < 7) {
    const tags = newTags[currentIndex];
    currentIndex++;
    const pills = tags.map(tag => `<span class="work-tag">${tag}</span>`).join('');
    return `<div class="work-tags">${pills}</div>`;
  }
  return match;
});

fs.writeFileSync('index.html', html);
console.log('Project cards updated successfully: Links disabled and pills replaced.');
