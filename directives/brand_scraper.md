# Directive: Brand Scraper

## Goal

Scrape any website to extract comprehensive brand and design data — colors, typography, fonts, logos, hero images, button styles, and more — producing a ready-to-use brand dossier for website design or redesign projects.

## Inputs

| Input | Description | Example |
|-------|-------------|---------|
| `url` | The URL to scrape (usually homepage) | `https://stripe.com` |
| `FIRECRAWL_API_KEY` | Optional. In `.env`. Required for screenshots and higher rate limits. | `fc-abc123...` |

## Tools / Scripts

| Script | Purpose |
|--------|---------|
| `execution/scrape_brand.py` | Calls Firecrawl with `branding + screenshot + images + markdown` formats, downloads the screenshot, saves all data to `brands/brand_<domain>/`, and generates `brand_report.md` |

## Steps

1. **Run the scrape script**
   ```bash
   python execution/scrape_brand.py --url "https://example.com"
   ```
   If a fresh scrape is needed (bypass cache):
   ```bash
   python execution/scrape_brand.py --url "https://example.com" --max-age 0
   ```

2. **Read `brand_report.md`** in `brands/brand_<domain>/` — this is the human-readable summary.

3. **Curate hero images** — look through `images.json` and identify:
   - Logo (small, appears in nav/header)
   - Hero/banner images (large, high up on the page)
   - Background images and textures
   - Icons and UI assets

4. **Analyze `page.md` + `branding.json`** for styling patterns:
   - Page section structure (hero → features → social proof → CTA)
   - Tone of voice (formal, playful, technical)
   - Notable visual effects (glassmorphism, gradients, dark mode)
   - Animation style (subtle, bold, none)

5. **Present to user** with:
   - The `brand_report.md` contents
   - The screenshot (reference visual)
   - Direct links to logo and hero images
   - Key design tokens (primary color, font family, border radius)

## Outputs

```
brands/brand_<domain>/
├── brand_guidelines.md  ← polished developer/designer reference (primary deliverable)
├── brand_report.md      ← raw agent-facing analysis dump
├── branding.json        ← full Firecrawl BrandingProfile
├── images.json          ← all image URLs
├── page.md              ← clean page content
└── screenshot.png       ← full-page screenshot
```

**Primary deliverable**: `brand_guidelines.md` — formatted like a real brand guide with CSS custom properties, type scale tables, Google Fonts import snippet, component specs, and classified image assets. Present this to the user and open it in the editor.

**Secondary**: `brand_report.md` — the raw agent analysis dump. More diagnostic, less pretty. Useful for agent follow-up work.

## Edge Cases & Known Issues

- **No API key**: Firecrawl works without a key at lower rate limits, but `screenshot` format often requires a key. Prompt user to add `FIRECRAWL_API_KEY` to `.env` if screenshot is missing.
- **JS-heavy SPAs**: Firecrawl handles these. If branding data is empty, retry with `--max-age 0`.
- **Screenshot URL expiry**: The script downloads immediately — URLs expire in 24h.
- **Login-gated pages**: Cannot scrape content behind authentication.
- **Rate limit (429)**: Add API key or wait 60s and retry.
- **`firecrawl-py` SDK version**: The `scrape_url()` vs `scrape()` method name varies by version. Script tries `scrape_url` first. If it fails with AttributeError, run `pip install --upgrade firecrawl-py` and update the script method name.

## Changelog

| Date | Change |
|------|--------|
| 2026-08-06 | Initial directive created |
