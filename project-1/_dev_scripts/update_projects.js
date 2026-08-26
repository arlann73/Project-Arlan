const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newContents = [
  {
    title: "Biostratigraphy & Microfossil Analysis",
    desc: "Analysis of rock age and biostratigraphic zones using planktonic foraminifera and nannoplankton to determine relative rock ages and support subsurface stratigraphic interpretation."
  },
  {
    title: "Sequence Stratigraphy Analysis",
    desc: "Analysis of sequence stratigraphy and electrofacies using well log and stratigraphic data to interpret depositional sequences and subsurface stratigraphy."
  },
  {
    title: "Well Log & Electrofacies Analysis",
    desc: "Well log and core data analysis to evaluate porosity, water saturation, permeability, electrofacies, and potential hydrocarbon-bearing zones."
  },
  {
    title: "Central Sumatra Basin Paleogeographic Reconstruction",
    desc: "Reconstruction of paleogeography and depositional history based on integrated fossil, facies, and well log data to interpret basin evolution."
  },
  {
    title: "Geological Mapping & 3D Terrain Modeling",
    desc: "Development of geological maps, spatial datasets, DEM-based terrain analysis, and 3D terrain visualizations using GIS software."
  },
  {
    title: "Coal Mine Planning & Resource Estimation",
    desc: "Development of geological and terrain models, coal resource estimation, stripping ratio analysis, pit optimization, waste disposal, and haul road planning."
  },
  {
    title: "Mine Scheduling & Production Optimization",
    desc: "Development of mine scheduling scenarios, production sequences, production calendars, and mining animations to support operational planning."
  }
];

let currentIndex = 0;
html = html.replace(/<div class="work-card-info">[\s\S]*?<\/div>/g, (match) => {
  if (currentIndex < 7) {
    const data = newContents[currentIndex];
    currentIndex++;
    return `<div class="work-card-info">
                            <h3 class="work-card-title">${data.title}</h3>
                            <p class="work-card-desc">${data.desc}</p>
                        </div>`;
  }
  return match;
});

// Remove card 8 and 9 (and any trailing whitespace/newlines before them)
html = html.replace(/\s*<a[^>]*id="work-card-8"[\s\S]*?<\/a>/, '');
html = html.replace(/\s*<a[^>]*id="work-card-9"[\s\S]*?<\/a>/, '');

fs.writeFileSync('index.html', html);
console.log('HTML updated successfully');
