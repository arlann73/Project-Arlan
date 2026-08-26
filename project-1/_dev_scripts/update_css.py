import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# We want to remove from .work-card-top { ... } down to .work-card:hover .work-card-arrow-2 { ... }
start_idx = css.find('.work-card-top {')
end_idx = css.find('/* ===== WHAT YOU GET ===== */')

if start_idx != -1 and end_idx != -1:
    old_blocks = css[start_idx:end_idx]
    
    new_blocks = '''
.work-card-content {
    position: relative;
    z-index: 2;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.work-card:hover .work-card-content {
    opacity: 1;
    transform: translateY(0);
}

.work-card-title {
    font-size: 24px;
    font-family: 'Oswald', sans-serif;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 15px;
    font-weight: 500;
}

.work-card-desc {
    font-size: 14px;
    line-height: 1.5;
    opacity: 0.9;
    margin-bottom: 30px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.work-card-btn {
    padding: 12px 30px;
    border: 1px solid #fff;
    color: #fff;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: transparent;
    transition: background 0.3s, color 0.3s;
}

.work-card-btn:hover {
    background: #fff;
    color: #000;
}

'''
    css = css[:start_idx] + new_blocks + css[end_idx:]
    
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Replaced CSS blocks successfully.")
else:
    print("Could not find bounds.")
