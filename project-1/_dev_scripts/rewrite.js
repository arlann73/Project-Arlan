const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

const newContents = [
    {
        title: "CORE VALUES",
        text: "Throughout my journey, I have cultivated a strong foundation in adaptability and leadership. By consistently navigating complex challenges, I've honed my problem-solving skills and learned to communicate effectively within diverse teams."
    },
    {
        title: "PROFESSIONAL ETHOS",
        text: "My involvement required unwavering discipline and teamwork. I approach every project with strict integrity and an eager, continuous desire to learn and adapt to new geological methodologies."
    },
    {
        title: "FIELD EXPLORATION",
        text: "My fieldwork at Way Krui in the West Coast Regency of Lampung was a defining experience. Serving as a student field mapping project, it provided hands-on exposure to rigorous geological exploration and spatial data analysis."
    },
    {
        title: "TECHNICAL ANALYSIS",
        text: "During my time at PT Pertamina Hulu Rokan, I focused heavily on well log data analysis, calculating key parameters like porosity, saturation, and permeability. I also performed detailed core descriptions and microfossil preparation."
    },
    {
        title: "RESEARCH FOCUS",
        text: "My undergraduate research centered on sequence stratigraphy and biostratigraphic analysis. I reconstructed complex paleogeographic histories and successfully identified rock age zoning to better understand the region's geological evolution."
    },
    {
        title: "ACADEMIC MENTORSHIP",
        text: "As a dedicated Laboratory Assistant, I guided students through critical practicum modules. I oversaw hands-on sessions in Geomorphology, Hydrogeology, and Geotechnics, ensuring a comprehensive understanding of earth processes."
    },
    {
        title: "ACADEMIC EXCELLENCE",
        text: "I graduated with a GPA of 3.62. My final thesis, titled 'Analysis of Sequences Stratigraphic and Biostratigraphic Based on Well Log Data Interpretation, MN Field, Central Sumatra Basin', represents the culmination of my academic journey."
    },
    {
        title: "FUTURE HORIZONS",
        text: "As I look to the future, I am actively seeking roles where I can make an immediate impact. I am highly interested in pursuing positions as a Management Trainee, Junior Geologist, Mine Plan Engineer, or Geotechnical Engineer."
    }
];

$('.timeline-card').each((i, el) => {
    const extendedContent = $(el).find('.timeline-extended-content');
    if (extendedContent.length > 0 && i < newContents.length) {
        extendedContent.empty();
        extendedContent.append(`<div class="timeline-extended-title">${newContents[i].title}</div>`);
        extendedContent.append(`<p class="timeline-extended-text">${newContents[i].text}</p>`);
    }
});

fs.writeFileSync('index.html', $.html());
console.log('Successfully rewrote extended content!');
