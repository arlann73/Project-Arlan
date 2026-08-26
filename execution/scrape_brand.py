"""
Script: scrape_brand.py
Purpose: Scrape a website using Firecrawl and extract comprehensive brand/design data.
         Pulls branding profile, all images, a full-page screenshot, and page markdown
         in a single API call. Saves results to brands/brand_<domain>/.

Outputs:
    brand_guidelines.md  ← polished, developer-ready brand reference doc (primary output)
    brand_report.md      ← raw agent-facing analysis dump
    branding.json        ← full Firecrawl BrandingProfile
    images.json          ← all image URLs
    page.md              ← clean markdown content
    screenshot.png       ← full-page screenshot

Usage:
    python execution/scrape_brand.py --url "https://example.com"
    python execution/scrape_brand.py --url "https://example.com" --output-dir "brands/my_brand"

Dependencies:
    pip install firecrawl-py python-dotenv requests

Environment variables (.env):
    FIRECRAWL_API_KEY  — optional, but required for higher rate limits
"""

import argparse
import json
import os
import re
import sys
import textwrap
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv

# ── Windows UTF-8 fix (emoji in print) ───────────────────────────────────────
import io
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'buffer'):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# ── Load environment variables ────────────────────────────────────────────────
load_dotenv()

# ── Argument parsing ──────────────────────────────────────────────────────────
def parse_args():
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--url",
        required=True,
        help='The URL to scrape (e.g. "https://example.com")',
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help='Directory to save results. Defaults to brands/brand_<domain>/',
    )
    parser.add_argument(
        "--max-age",
        type=int,
        default=None,
        help="Cache freshness in ms. Set to 0 to always fetch fresh content.",
    )
    return parser.parse_args()


# ── Helpers ───────────────────────────────────────────────────────────────────
def slugify_domain(url: str) -> str:
    """Turn a URL into a safe directory name."""
    parsed = urlparse(url)
    domain = parsed.netloc or parsed.path
    domain = re.sub(r"^www\.", "", domain)
    return re.sub(r"[^\w\-.]", "_", domain)


def download_image(url: str, dest: Path) -> bool:
    """Download a remote image to dest. Returns True on success."""
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
        return True
    except Exception as e:
        print(f"  ⚠ Could not download {url}: {e}", file=sys.stderr)
        return False


def safe_get(d, *keys, default=None):
    """Safely traverse a nested dict."""
    for key in keys:
        if not isinstance(d, dict):
            return default
        d = d.get(key, default)
        if d is None:
            return default
    return d


# ── Brand report generator ────────────────────────────────────────────────────
def generate_brand_report(url: str, branding: dict, images: list, output_dir: Path) -> str:
    """Generate a human-readable brand_report.md from scraped data."""

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    site_name = safe_get(branding, "metadata", "title") or urlparse(url).netloc or url
    color_scheme = branding.get("colorScheme", "unknown")

    # ── Colors ────────────────────────────────────────────────────────────────
    colors = branding.get("colors", {})
    color_rows = ""
    color_map = {
        "primary": "Primary",
        "secondary": "Secondary",
        "accent": "Accent",
        "background": "Background",
        "textPrimary": "Text (primary)",
        "textSecondary": "Text (secondary)",
        "link": "Link",
        "success": "Success",
        "warning": "Warning",
        "error": "Error",
    }
    for key, label in color_map.items():
        val = colors.get(key)
        if val:
            color_rows += f"| {label} | `{val}` |\n"
    colors_section = f"""## Colors

| Role | Value |
|------|-------|
{color_rows.strip()}
""" if color_rows else "## Colors\n\n_No color data extracted._\n"

    # ── Typography ────────────────────────────────────────────────────────────
    typography = branding.get("typography", {})
    font_families = typography.get("fontFamilies", {})
    font_sizes = typography.get("fontSizes", {})
    font_weights = typography.get("fontWeights", {})
    fonts_list = branding.get("fonts", [])

    fonts_section = "## Typography\n\n"
    if font_families:
        fonts_section += "**Font families:**\n"
        for role, family in font_families.items():
            if family:
                fonts_section += f"- {role.capitalize()}: {family}\n"
        fonts_section += "\n"
    elif fonts_list:
        fonts_section += "**Fonts detected on page:**\n"
        for f in fonts_list:
            fam = f.get("family") if isinstance(f, dict) else str(f)
            if fam:
                fonts_section += f"- {fam}\n"
        fonts_section += "\n"
    else:
        fonts_section += "_No font data extracted._\n\n"

    if font_sizes:
        fonts_section += "**Font sizes:**\n"
        for role, size in font_sizes.items():
            fonts_section += f"- {role}: {size}\n"
        fonts_section += "\n"

    if font_weights:
        fonts_section += "**Font weights:**\n"
        for role, weight in font_weights.items():
            fonts_section += f"- {role}: {weight}\n"
        fonts_section += "\n"

    # ── Key images ────────────────────────────────────────────────────────────
    brand_images = branding.get("images", {})
    key_images_section = "## Key Brand Images\n\n| Type | URL |\n|------|-----|\n"
    for img_type, img_url in brand_images.items():
        if img_url:
            key_images_section += f"| {img_type.capitalize()} | {img_url} |\n"
    if brand_images.get("logo") or branding.get("logo"):
        logo_url = branding.get("logo") or brand_images.get("logo")
        if logo_url and "Logo" not in key_images_section:
            key_images_section += f"| Logo | {logo_url} |\n"

    # ── Buttons ───────────────────────────────────────────────────────────────
    components = branding.get("components", {})
    buttons_section = "## Button Styles\n\n"
    if components:
        buttons_section += "| Button | Background | Text Color | Border Radius |\n"
        buttons_section += "|--------|-----------|------------|---------------|\n"
        for btn_key, btn_val in components.items():
            if isinstance(btn_val, dict):
                bg = btn_val.get("background", "—")
                text = btn_val.get("textColor", "—")
                radius = btn_val.get("borderRadius", "—")
                buttons_section += f"| {btn_key} | `{bg}` | `{text}` | {radius} |\n"
    else:
        buttons_section += "_No component data extracted._\n"

    # ── Spacing ───────────────────────────────────────────────────────────────
    spacing = branding.get("spacing", {})
    spacing_section = "## Spacing & Layout\n\n"
    if spacing:
        for k, v in spacing.items():
            spacing_section += f"- **{k}**: {v}\n"
    else:
        spacing_section += "_No spacing data extracted._\n"

    # ── Personality / animations ───────────────────────────────────────────────
    personality = branding.get("personality", {})
    animations = branding.get("animations", {})
    intelligence_section = "## Styling Intelligence\n\n"
    if personality:
        for k, v in personality.items():
            intelligence_section += f"- **{k.capitalize()}**: {v}\n"
    if animations:
        intelligence_section += "\n**Animations:**\n"
        for k, v in animations.items():
            intelligence_section += f"- {k}: {v}\n"
    if not personality and not animations:
        intelligence_section += "_Run manual analysis on page.md for tone and styling patterns._\n"

    # ── Image inventory ────────────────────────────────────────────────────────
    inventory_section = "## Page Image Inventory\n\n"
    if images:
        top_images = images[:20]  # cap at 20
        for img_url in top_images:
            url_str = img_url if isinstance(img_url, str) else img_url.get("url", "")
            if url_str:
                inventory_section += f"- {url_str}\n"
    else:
        inventory_section += "_No images extracted._\n"

    # ── Assemble ───────────────────────────────────────────────────────────────
    report = f"""# Brand Dossier: {site_name}

**Source URL**: {url}  
**Scraped**: {timestamp}  
**Color Scheme**: {color_scheme}  
**Screenshot**: [screenshot.png](screenshot.png) _(if downloaded successfully)_

---

{colors_section}
---

{fonts_section}
---

{key_images_section}
---

{buttons_section}
---

{spacing_section}
---

{intelligence_section}
---

{inventory_section}
---

## Raw Files

| File | Contents |
|------|---------|
| `brand_guidelines.md` | Polished developer reference document |
| `branding.json` | Full BrandingProfile object from Firecrawl |
| `images.json` | All image URLs extracted from the page |
| `page.md` | Clean markdown version of the page content |
| `screenshot.png` | Full-page screenshot |
"""

    return report


# ── Brand guidelines generator ────────────────────────────────────────────────
def generate_brand_guidelines(url: str, branding: dict, images: list, metadata: dict) -> str:
    """
    Generate a polished brand_guidelines.md — the developer/designer reference doc.
    This is distinct from brand_report.md (which is agent-facing).
    Formatted like a real brand guide: tokens, type scale, components, image assets.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d")
    domain = urlparse(url).netloc or url
    site_name = metadata.get("title") or metadata.get("ogTitle") or domain
    description = metadata.get("description") or metadata.get("ogDescription") or ""
    color_scheme = branding.get("colorScheme", "light")
    logo_url = branding.get("logo") or safe_get(branding, "images", "logo") or ""
    favicon_url = safe_get(branding, "images", "favicon") or ""
    og_image_url = safe_get(branding, "images", "ogImage") or metadata.get("ogImage") or ""

    # ── Header ────────────────────────────────────────────────────────────────
    header = f"""# {site_name} — Brand Guidelines

> **Source**: [{url}]({url})  
> **Extracted**: {timestamp}  
> **Color scheme**: {color_scheme.capitalize()}  
> **Screenshot**: [View screenshot](screenshot.png)
"""

    if description:
        header += f"\n> {description}\n"

    # ── Brand identity ────────────────────────────────────────────────────────
    identity_lines = []
    if logo_url:
        identity_lines.append(f"- **Logo**: [{logo_url}]({logo_url})")
    if favicon_url:
        identity_lines.append(f"- **Favicon**: [{favicon_url}]({favicon_url})")
    if og_image_url:
        identity_lines.append(f"- **OG / Social image**: [{og_image_url}]({og_image_url})")

    identity_section = "## Brand Identity\n\n"
    identity_section += "\n".join(identity_lines) if identity_lines else "_No identity assets extracted._"
    identity_section += "\n"

    # ── Color palette ─────────────────────────────────────────────────────────
    colors = branding.get("colors") or {}
    color_token_map = [
        ("primary",       "--color-primary",        "Primary brand color"),
        ("secondary",     "--color-secondary",      "Secondary brand color"),
        ("accent",        "--color-accent",          "Accent / highlight color"),
        ("background",    "--color-background",      "Page background"),
        ("textPrimary",   "--color-text-primary",    "Primary text"),
        ("textSecondary", "--color-text-secondary",  "Secondary / muted text"),
        ("link",          "--color-link",            "Link color"),
        ("success",       "--color-success",         "Success state"),
        ("warning",       "--color-warning",         "Warning state"),
        ("error",         "--color-error",           "Error state"),
    ]

    color_table_rows = ""
    css_vars = ""
    for key, css_var, role in color_token_map:
        val = colors.get(key)
        if val:
            color_table_rows += f"| {role} | `{css_var}` | `{val}` |\n"
            css_vars += f"  {css_var}: {val};\n"

    if color_table_rows:
        color_section = f"""## Color Palette

| Role | CSS Token | Value |
|------|-----------|-------|
{color_table_rows.strip()}

### CSS Custom Properties

```css
:root {{
{css_vars.rstrip()}
}}
```
"""
    else:
        color_section = "## Color Palette\n\n_No color data extracted._\n"

    # ── Typography ────────────────────────────────────────────────────────────
    typography = branding.get("typography") or {}
    font_families = typography.get("fontFamilies") or {}
    font_sizes = typography.get("fontSizes") or {}
    font_weights = typography.get("fontWeights") or {}
    line_heights = typography.get("lineHeights") or {}
    fonts_list = branding.get("fonts") or []

    type_section = "## Typography\n\n"

    # Font families
    if font_families:
        type_section += "### Font Families\n\n"
        type_section += "| Role | Family |\n|------|--------| \n"
        for role, family in font_families.items():
            if family:
                type_section += f"| {role.capitalize()} | `{family}` |\n"
        type_section += "\n"
    elif fonts_list:
        type_section += "### Fonts Detected\n\n"
        for f in fonts_list:
            fam = f.get("family") if isinstance(f, dict) else str(f)
            if fam:
                type_section += f"- `{fam}`\n"
        type_section += "\n"

    # Type scale
    if font_sizes:
        type_section += "### Type Scale\n\n"
        type_section += "| Element | Size |\n|---------|------| \n"
        for el, size in font_sizes.items():
            type_section += f"| `{el}` | {size} |\n"
        type_section += "\n"

    # Weights
    if font_weights:
        type_section += "### Font Weights\n\n"
        type_section += "| Weight | Value |\n|--------|-------| \n"
        for name, weight in font_weights.items():
            type_section += f"| {name.capitalize()} | `{weight}` |\n"
        type_section += "\n"

    # Line heights
    if line_heights:
        type_section += "### Line Heights\n\n"
        for role, lh in line_heights.items():
            type_section += f"- {role}: `{lh}`\n"
        type_section += "\n"

    if not font_families and not fonts_list:
        type_section += "_No typography data extracted._\n"

    # CSS snippet for primary font
    primary_font = font_families.get("primary") or (fonts_list[0].get("family") if fonts_list and isinstance(fonts_list[0], dict) else None)
    if primary_font:
        type_section += f"""### Google Fonts Import

If this font is available on Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family={primary_font.replace(' ', '+')}:wght@400;500;700&display=swap" rel="stylesheet">
```

"""

    # ── Spacing & layout ──────────────────────────────────────────────────────
    spacing = branding.get("spacing") or {}
    layout = branding.get("layout") or {}

    spacing_section = "## Spacing & Layout\n\n"
    if spacing:
        spacing_section += "| Token | Value |\n|-------|-------| \n"
        for k, v in spacing.items():
            spacing_section += f"| `{k}` | {v} |\n"
        spacing_section += "\n"
    if layout:
        spacing_section += "**Layout:**\n"
        for k, v in layout.items():
            spacing_section += f"- {k}: {v}\n"
        spacing_section += "\n"
    if not spacing and not layout:
        spacing_section += "_No spacing data extracted._\n"

    # ── Components ────────────────────────────────────────────────────────────
    components = branding.get("components") or {}
    components_section = "## UI Components\n\n"
    if components:
        for comp_name, comp in components.items():
            if not isinstance(comp, dict):
                continue
            components_section += f"### {comp_name}\n\n"
            components_section += "| Property | Value |\n|----------|-------| \n"
            for prop, val in comp.items():
                components_section += f"| {prop} | `{val}` |\n"
            components_section += "\n"
    else:
        components_section += "_No component data extracted._\n"

    # ── Animations ────────────────────────────────────────────────────────────
    animations = branding.get("animations") or {}
    anim_section = ""
    if animations:
        anim_section = "## Animations & Transitions\n\n"
        for k, v in animations.items():
            anim_section += f"- **{k}**: {v}\n"
        anim_section += "\n"

    # ── Brand personality ─────────────────────────────────────────────────────
    personality = branding.get("personality") or {}
    personality_section = ""
    if personality:
        personality_section = "## Brand Personality\n\n"
        for k, v in personality.items():
            personality_section += f"- **{k.capitalize()}**: {v}\n"
        personality_section += "\n"

    # ── Key image assets ──────────────────────────────────────────────────────
    # Classify images from the full images list
    # Simple heuristic: large images (contain 'hero', 'banner', 'bg', 'header') vs icons
    hero_keywords = {"hero", "banner", "header", "bg", "background", "cover", "splash", "feature"}
    logo_keywords = {"logo", "brand", "icon", "favicon"}

    hero_candidates = []
    logo_candidates = []
    other_images = []

    for img in images[:50]:  # check up to 50
        url_str = img if isinstance(img, str) else (img.get("url") if isinstance(img, dict) else "")
        if not url_str:
            continue
        lower = url_str.lower()
        if any(kw in lower for kw in logo_keywords):
            logo_candidates.append(url_str)
        elif any(kw in lower for kw in hero_keywords):
            hero_candidates.append(url_str)
        else:
            other_images.append(url_str)

    assets_section = "## Image Assets\n\n"

    if logo_url:
        assets_section += f"### Primary Logo\n\n![]({logo_url})\n\n[Direct link]({logo_url})\n\n"

    if logo_candidates:
        assets_section += "### Logo / Icon Candidates\n\n"
        for u in logo_candidates[:5]:
            assets_section += f"- [{u}]({u})\n"
        assets_section += "\n"

    if hero_candidates:
        assets_section += "### Hero / Banner Images\n\n"
        for u in hero_candidates[:5]:
            assets_section += f"- [{u}]({u})\n"
        assets_section += "\n"

    if og_image_url:
        assets_section += f"### Social / OG Image\n\n![]({og_image_url})\n\n[Direct link]({og_image_url})\n\n"

    if other_images:
        assets_section += "### Other Page Images (first 10)\n\n"
        for u in other_images[:10]:
            assets_section += f"- [{u}]({u})\n"
        assets_section += "\n"

    if not logo_url and not logo_candidates and not hero_candidates and not og_image_url and not other_images:
        assets_section += "_No images extracted._\n"

    # ── Assemble ──────────────────────────────────────────────────────────────
    sections = [
        header,
        "---",
        identity_section,
        "---",
        color_section,
        "---",
        type_section,
        "---",
        spacing_section,
        "---",
        components_section,
    ]

    if anim_section:
        sections += ["---", anim_section]
    if personality_section:
        sections += ["---", personality_section]

    sections += ["---", assets_section]

    sections.append("""
---

## Notes

> This file was auto-generated by `execution/scrape_brand.py` using the Firecrawl API.
> Review and refine manually — especially the image classifications and any fields marked _No data_.
> Raw data is in `branding.json`. Full page content is in `page.md`.
""")

    return "\n".join(sections)


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    args = parse_args()

    # ── Import Firecrawl ──────────────────────────────────────────────────────
    try:
        from firecrawl import FirecrawlApp
    except ImportError:
        print("❌ firecrawl-py not installed. Run: pip install firecrawl-py", file=sys.stderr)
        sys.exit(1)

    # ── Output directory ──────────────────────────────────────────────────────
    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        domain_slug = slugify_domain(args.url)
        output_dir = Path("brands") / f"brand_{domain_slug}"

    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"[DIR] Output directory: {output_dir}")

    # ── Initialize Firecrawl ──────────────────────────────────────────────────
    api_key = os.getenv("FIRECRAWL_API_KEY")
    if api_key:
        print("[KEY] Using FIRECRAWL_API_KEY from environment")
        app = FirecrawlApp(api_key=api_key)
    else:
        print("[WARN] No FIRECRAWL_API_KEY found -- using free tier (lower rate limits)")
        app = FirecrawlApp()

    # ── Scrape ────────────────────────────────────────────────────────────────
    print(f"[SCRAPE] Scraping {args.url} ...")
    scrape_kwargs = {
        "formats": ["branding", "screenshot", "images", "markdown", "html"],
    }
    if args.max_age is not None:
        scrape_kwargs["max_age"] = args.max_age

    try:
        result = app.scrape(args.url, **scrape_kwargs)
    except Exception as e:
        print(f"[ERROR] Firecrawl scrape failed: {e}", file=sys.stderr)
        sys.exit(1)

    # Normalize result: Document object or dict -> plain dict
    if hasattr(result, "model_dump"):
        result = result.model_dump()  # Pydantic v2
    elif hasattr(result, "dict"):
        result = result.dict()        # Pydantic v1
    elif hasattr(result, "__dict__"):
        result = result.__dict__

    # ── Save branding.json ────────────────────────────────────────────────────
    branding = result.get("branding") or {}
    branding_path = output_dir / "branding.json"
    branding_path.write_text(json.dumps(branding, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[OK] Saved branding data -> {branding_path}")

    # ── Save images.json ──────────────────────────────────────────────────────
    images = result.get("images") or []
    images_path = output_dir / "images.json"
    images_path.write_text(json.dumps(images, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[OK] Saved {len(images)} image URLs -> {images_path}")

    # ── Save page.md ──────────────────────────────────────────────────────────
    markdown = result.get("markdown") or ""
    page_md_path = output_dir / "page.md"
    page_md_path.write_text(markdown, encoding="utf-8")
    print(f"[OK] Saved page markdown ({len(markdown)} chars) -> {page_md_path}")

    # ── Save page.html ────────────────────────────────────────────────────────
    html_content = result.get("html") or ""
    page_html_path = output_dir / "page.html"
    if html_content:
        page_html_path.write_text(html_content, encoding="utf-8")
        print(f"[OK] Saved page HTML ({len(html_content)} chars) -> {page_html_path}")

    # ── Download screenshot ───────────────────────────────────────────────────
    screenshot_url = result.get("screenshot")
    screenshot_path = output_dir / "screenshot.png"
    if screenshot_url:
        print(f"[SCREENSHOT] Downloading screenshot from {screenshot_url} ...")
        ok = download_image(screenshot_url, screenshot_path)
        if ok:
            print(f"[OK] Screenshot saved -> {screenshot_path}")
        else:
            print("[WARN] Screenshot download failed -- URL may have already expired", file=sys.stderr)
    else:
        print("[WARN] No screenshot returned (this format may need an API key)", file=sys.stderr)

    # ── Generate brand report ─────────────────────────────────────────────────
    # Merge metadata into branding for report generation
    metadata = result.get("metadata") or {}
    if metadata and isinstance(branding, dict):
        branding["metadata"] = metadata

    report_md = generate_brand_report(args.url, branding, images, output_dir)
    report_path = output_dir / "brand_report.md"
    report_path.write_text(report_md, encoding="utf-8")
    print(f"[OK] Brand report generated -> {report_path}")

    # ── Generate brand guidelines ─────────────────────────────────────────────
    guidelines_md = generate_brand_guidelines(args.url, branding, images, metadata)
    guidelines_path = output_dir / "brand_guidelines.md"
    guidelines_path.write_text(guidelines_md, encoding="utf-8")
    print(f"[OK] Brand guidelines generated -> {guidelines_path}")

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n[DONE] Files saved to:", output_dir)
    print("   brand_guidelines.md  <- primary reference doc (share this one)")
    print("   brand_report.md      <- raw agent analysis dump")
    print("   branding.json        <- full design system data")
    print("   images.json          <- all image URLs")
    print("   page.md              <- page content")
    if screenshot_path.exists():
        print("   screenshot.png       <- full-page visual")



if __name__ == "__main__":
    main()
