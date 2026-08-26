const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

$('.timeline-card').each((i, el) => {
    const textContent = $(el).find('.timeline-text-content');
    const extendedContent = $(el).find('.timeline-extended-content');
    if (textContent.length > 0 && extendedContent.length > 0) {
        textContent.append(extendedContent);
    }
});

fs.writeFileSync('index.html', $.html());
console.log('Restructured HTML');
