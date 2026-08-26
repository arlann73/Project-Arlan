const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const anchor = `<h3 class="timeline-title">Work Practice</h3>
                                      <p class="timeline-desc">Conducted well log analysis as part of a work practice
                                          internship at PT Pertamina Hulu Rokan.</p>
                                      
                                  </div>
                              </div>`;

const toInsert = `

                            <div class="timeline-card" data-year="2023" data-side="left">
                                <img src="assets/images/islands/ice_island6.png" class="timeline-island-img timeline-island-img--large" alt="Island 6">
                                <div class="timeline-text-content">
                                    <span class="timeline-year">'23</span>
                                    <h3 class="timeline-title">Undergraduate Research</h3>
                                    <p class="timeline-desc">Conducted sequence stratigraphic analysis at PT Pertamina Hulu Rokan as part of an undergraduate research internship.</p>
                                </div>
                            </div>

                            <div class="timeline-card" data-year="2023" data-side="right">
                                <img src="assets/images/islands/ice_island7.png" class="timeline-island-img timeline-island-img--large" alt="Island 7">
                                <div class="timeline-text-content">
                                    <span class="timeline-year">'23</span>
                                    <h3 class="timeline-title">Laboratory Assistant</h3>
                                    <p class="timeline-desc">Served as a Laboratory Assistant for Geomorphology, Geotechnics, and Hydrogeology.</p>
                                </div>
                            </div>`;

html = html.replace(anchor, anchor + toInsert);

fs.writeFileSync(filePath, html);
console.log('Successfully restored the missing timeline cards with the enlarged image classes!');
