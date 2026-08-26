import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_card(match):
    full_card = match.group(0)
    id_attr = match.group(1)
    
    # Extract title
    title_match = re.search(r'<h3 class="work-card-title">(.*?)</h3>', full_card, re.DOTALL)
    title = title_match.group(1).strip() if title_match else "OUR STORY"
    
    # Extract desc
    desc_match = re.search(r'<p class="work-card-desc">(.*?)</p>', full_card, re.DOTALL)
    desc = desc_match.group(1).strip() if desc_match else "Description goes here."
    
    # Replace background image with placeholder color
    new_card = f'''<a href="javascript:void(0)" class="work-card" id="{id_attr}">
                        <div class="work-card-image" style="background-color: #1c1c1c;"></div>
                        <div class="work-image-overlay"></div>
                        <div class="work-card-content">
                            <h3 class="work-card-title">{title}</h3>
                            <p class="work-card-desc">{desc}</p>
                            <div class="work-card-btn">Learn More</div>
                        </div>
                    </a>'''
    return new_card

new_html = re.sub(r'<a href="javascript:void\(0\)" class="work-card" id="(work-card-\d+)">(.*?)</a>', replace_card, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
print("Replaced HTML cards successfully.")
