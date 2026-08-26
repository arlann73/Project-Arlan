---
name: brand-scraper
description: Extract comprehensive brand identity, design system, and visual styling information from websites using Firecrawl API. Use when you need to analyze a website's branding, colors, typography, fonts, images (logos, hero images, headers, favicons), button designs, styling effects, layout, or any visual design elements. Ideal for building new websites based on existing brand guidelines, creating design systems, cloning visual styles, or understanding a brand's visual identity. Trigger on: "scrape this site for brand data", "extract the colors and fonts from X", "I want to clone/match the style of Y", "pull the branding from this URL", "analyze the design system of Z", "build a design system from URL", or whenever the user provides a URL to reference design inspiration.
---

# Brand Scraper & Design System Extractor

Extract comprehensive brand identity, design systems, and visual styling information from any live website using the Firecrawl API. The output is a developer-ready brand guidelines reference document (`brand_guidelines.md`) along with raw design tokens (`branding.json`), visual assets, full-page screenshots, and page structure markdown.

---

## Capabilities & What Gets Extracted

This skill executes a single-pass extraction using four Firecrawl formats simultaneously (`branding`, `screenshot`, `images`, `markdown`):

- **Brand Identity:** Primary/Secondary logos, favicons, OG/social share images, and color palettes (Primary, Secondary, Accent, Background, Text Primary/Secondary, Links, and Semantic States with Hex & CSS Tokens).
- **Typography & Type Scale:** Font families (Primary, Heading, Code), font sizes (`h1`–`body`), font weights, line heights, and auto-generated Google Fonts import snippets.
- **Design Systems & Components:** Button styles (Primary, Secondary, Ghost - background, text color, border radius), input fields, border radiuses, and component patterns.
- **Styling Effects & Motion:** Animations, transition curves, color schemes (`light`/`dark` mode), glassmorphism/gradient cues, and brand personality traits (tone, energy, target audience).
- **Layout Patterns:** Grid spacing base units (e.g., `8px`), layout configuration (grid, header/footer heights), and page section hierarchy.
- **Image & Visual Inventory:** Auto-classified image lists (Logos, Hero/Banner candidates, UI icons) and full-page high-resolution screenshot (`screenshot.png`).

---

## Quick Start & Usage

To extract brand guidelines from any URL, run the deterministic Python script:

```bash
python execution/scrape_brand.py --url "https://example.com"
```

To force a fresh scrape (bypassing Firecrawl cache):
```bash
python execution/scrape_brand.py --url "https://example.com" --max-age 0
```

To specify a custom output directory:
```bash
python execution/scrape_brand.py --url "https://example.com" --output-dir "brands/custom_brand_dir"
```

---

## Generated Artifacts Structure

Outputs are generated inside `brands/brand_<domain>/` (or custom directory):

```text
brands/brand_example.com/
├── brand_guidelines.md   ← Primary Deliverable: Polished developer reference doc (CSS variables, type scales, Google Fonts, components)
├── brand_report.md       ← Secondary Deliverable: Raw agent analysis dump (diagnostic report for AI agents)
├── branding.json         ← Full raw Firecrawl BrandingProfile object
├── images.json           ← Complete list of extracted image URLs with metadata
├── page.md               ← Clean markdown text content of the page structure
└── screenshot.png        ← Full-page screenshot (auto-downloaded before 24h URL expiration)
```

---

## Deliverables Breakdown

### 1. `brand_guidelines.md` (Primary Reference Document)
Formatted specifically for Web Developers & Designers:
- Ready-to-copy `:root { ... }` CSS custom properties block.
- Ready-to-copy Google Fonts `<link>` import snippet.
- Typography scale tables (`h1` through `body`).
- UI component specification tables (Buttons, Inputs, Spacing).
- Embedded primary logo and direct links to hero images.

### 2. `brand_report.md` (Agent Analysis Dossier)
Formatted for AI Agent reasoning & design planning:
- Tone of voice and copywriting style analysis.
- Visual hierarchy and section flow breakdown (Hero → Features → Testimonials → CTA).
- Detailed image inventory categorization.

---

## Step-by-Step Execution Workflow

1. **Verify Script:** Ensure `execution/scrape_brand.py` exists (or create/update per the script specification).
2. **Execute Scrape:** Run `python execution/scrape_brand.py --url "<URL>"`.
3. **Inspect Output:** Verify that `brands/brand_<domain>/brand_guidelines.md` and `screenshot.png` were created.
4. **Present Results:** Open `brand_guidelines.md` in the editor, highlight key CSS tokens and typography, and present screenshot/image links to the user.
5. **Handoff:** Use `brand-guidelines` skill if the user wants to apply this extracted design system to a new web project, slide deck, or UI component.

---

## Script Specification (`execution/scrape_brand.py`)

If script updates are needed, ensure it adheres to this spec:

- **Dependencies:** `firecrawl-py`, `python-dotenv`, `requests`.
- **Environment:** Reads `FIRECRAWL_API_KEY` from `.env`. Fallbacks gracefully to free-tier if no key is present.
- **Formats:** Requests `['branding', 'screenshot', 'images', 'markdown']`.
- **Screenshot Handler:** Automatically downloads the remote screenshot URL to local `screenshot.png` to prevent URL expiration (24h limit).
- **Dual Generator:** Calls `generate_brand_report()` and `generate_brand_guidelines()`.

---

## Edge Cases & Troubleshooting

- **JS-Heavy SPAs (React / Next.js / Vue):** Firecrawl renders dynamic JS natively. If data is sparse, use `--max-age 0`.
- **API Rate Limits (429):** Ensure `FIRECRAWL_API_KEY` is present in `.env` or pause 60s before retrying.
- **Missing Branding Fields:** Simple or text-only pages may lack component or animation data. The script inserts `_No data extracted_` placeholders gracefully without throwing errors.
- **Login / Auth Gated Sites:** Firecrawl cannot bypass login forms. Notify the user if the URL redirects to a login screen.
