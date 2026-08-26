const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const newImages = [
  "assets/images/Background/Biostragraphy%20Analysis.png",
  "assets/images/Background/Sequence%20Stratigraphy%20Analysis.png",
  "assets/images/Background/Electrofacies%20Analysis.png",
  "assets/images/Background/Paleogeography.png",
  "assets/images/Background/Geological%20Mapping.png",
  "assets/images/Background/Coal%20Mine%20Planning%20%26%20Resource%20Estimation.png",
  "assets/images/Background/Mine%20Schedulling.png"
];

let currentIndex = 0;
html = html.replace(/style="background-image:url\('[^']+'\)"/g, (match) => {
  if (currentIndex < 7) {
    const newStyle = `style="background-image:url('${newImages[currentIndex]}')"`;
    currentIndex++;
    return newStyle;
  }
  return match;
});

fs.writeFileSync('index.html', html);
console.log('Project card background images updated successfully.');
