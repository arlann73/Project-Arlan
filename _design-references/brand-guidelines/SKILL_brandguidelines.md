---
name: brand-guidelines
description: Applies extracted brand colors, typography, spacing, and visual design system to any artifact (document, slide deck, web page, email, UI component, etc.). Use this skill whenever brand consistency is needed — whether applying Anthropic's own brand, a client's brand, or any brand extracted via the brand-scraper skill. Trigger on: "apply brand guidelines", "style this with the brand", "make this on-brand", "use our brand colors/fonts", "apply the design system", "format this according to brand standards", "use heynesh style", or whenever the user wants an artifact to look polished and consistent with a specific brand's visual identity.
license: Complete terms in LICENSE.txt
---

# Brand Guidelines Applicator

Apply a brand's visual identity system to any artifact. This skill works with:

- **Anthropic's brand** (default — defined below)
- **NESH® / heynesh.com brand** (extracted — defined below)
- **Any scraped brand** from `.tmp/brand_<domain>/brand_guidelines.md` (produced by the `brand-scraper` skill)
- **Any brand the user defines** inline in the conversation

---

## How to Determine Which Brand to Apply

1. **User names a brand explicitly** → use it directly from the sections below
2. **User references a URL** → look in `.tmp/brand_<domain>/brand_guidelines.md` and `branding.json`
3. **No brand specified** → default to Anthropic (Section 1 below)

---

## Section 1 — Anthropic Brand System

> Use this when no other brand is specified.

### Colors

| Role | Hex | CSS Token | Usage |
|------|-----|-----------|-------|
| Dark | `#141413` | `--color-dark` | Primary text and dark backgrounds |
| Light | `#faf9f5` | `--color-light` | Light backgrounds, text on dark |
| Mid Gray | `#b0aea5` | `--color-mid-gray` | Secondary elements |
| Light Gray | `#e8e6dc` | `--color-light-gray` | Subtle backgrounds |
| Orange (Accent 1) | `#d97757` | `--color-accent-orange` | Primary CTAs |
| Blue (Accent 2) | `#6a9bcc` | `--color-accent-blue` | Secondary accent |
| Green (Accent 3) | `#788c5d` | `--color-accent-green` | Tertiary accent |

```css
:root {
  --color-dark: #141413;
  --color-light: #faf9f5;
  --color-mid-gray: #b0aea5;
  --color-light-gray: #e8e6dc;
  --color-accent-orange: #d97757;
  --color-accent-blue: #6a9bcc;
  --color-accent-green: #788c5d;
}
```

### Typography

| Role | Family | Fallback |
|------|--------|----------|
| Headings (24pt+) | Poppins | Arial |
| Body text | Lora | Georgia |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Lora:wght@400;700&display=swap" rel="stylesheet">
```

### Spacing & Layout

| Token | Value |
|-------|-------|
| `--border-radius` | `8px` |
| Base spacing unit | `8px` |

### UI Components

**Button Primary:** Background `#d97757` · Text `#faf9f5` · Radius `8px`

**Button Secondary:** Background `transparent` · Text `#d97757` · Border `1px solid #d97757` · Radius `8px`

### Brand Personality

- **Tone**: Professional, clear, approachable
- **Energy**: Calm, focused
- **Color scheme**: Light

---

## Section 2 — NESH® Brand System (heynesh.com)

> Webflow developer brand for Nenad Popadic — specialising in biotech, SaaS, and blockchain.  
> Extracted: 2026-08-06 · Source: https://heynesh.com/

### Colors

| Role | CSS Token | Hex | Usage |
|------|-----------|-----|-------|
| Primary | `--color-primary` | `#D5CFBE` | Warm sand / neutral |
| Secondary | `--color-secondary` | `#FFFF23` | Electric yellow — key accent |
| Accent | `--color-accent` | `#FFFF23` | Same as secondary |
| Background | `--color-background` | `#FFFFFF` | White page background |
| Text Primary | `--color-text-primary` | `#000000` | All body text |
| Link | `--color-link` | `#DDDBCB` | Link color |
| Button Secondary BG | — | `#EBEADA` | Secondary button fill |
| Button Secondary Border | — | `#BDB8AA` | Secondary button border |

```css
:root {
  --color-primary: #D5CFBE;
  --color-secondary: #FFFF23;
  --color-accent: #FFFF23;
  --color-background: #FFFFFF;
  --color-text-primary: #000000;
  --color-link: #DDDBCB;
}
```

### Typography

| Role | Family | Fallback Stack |
|------|--------|----------------|
| Primary / Body | `Ppneuemontreal Book` | Arial, sans-serif |
| Heading | `Ppneuemontreal` | Tr 3 A, Arial, sans-serif |

> **Note:** PP Neue Montreal is a commercial typeface by Pangram Pangram. Not available on Google Fonts — must be self-hosted or purchased.

### Type Scale

| Element | Size |
|---------|------|
| `h1` | `88px` |
| `h2` | `80px` |
| `body` | `19.2px` |

### Spacing & Layout

| Token | Value |
|-------|-------|
| Base unit | `4px` |
| Default border radius | `1px` |
| Button border radius | `15.936px` (fully rounded pill) |

### UI Components

**Button Primary — "Book a Call"**

| Property | Value |
|----------|-------|
| Background | `#FFFF23` (electric yellow) |
| Text Color | `#000000` |
| Border Radius | `15.936px` (pill shape) |
| Shadow | `none` |

**Button Secondary — "Read more"**

| Property | Value |
|----------|-------|
| Background | `#EBEADA` |
| Text Color | `#000000` |
| Border Color | `#BDB8AA` |
| Border Radius | `15.936px` (pill shape) |
| Shadow | `none` |

### Brand Personality

- **Tone**: Modern
- **Energy**: Medium
- **Target Audience**: Creative professionals

### Design System

- **Framework**: Custom (Webflow)
- **Component Library**: None (custom-built)
- **Extraction Confidence**: 92.5%

### Brand Assets

| Asset | URL |
|-------|-----|
| Logo (SVG) | [happyring.svg](https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/69206dcc9ccb58439ffc32dc_happyring.svg) |
| Favicon | [favicon.png](https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/69839f2955d4ddfd746742eb_favicon.png) |
| OG / Social Image | [OpenGraph.jpg](https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/6985214bb975f745e43bb088_OpenGraph.jpg) |
| Screenshot | `brands/brand_heynesh.com/screenshot.png` |

#### Hero / Banner Images

- [Client - Puck (Background)](https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/6a426dc807f9848ecf6a2844_Client%20-%20Puck%20(Background).avif)
- [Client - PSSLTD (Background)](https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/6a426dc8b12f78cbd2eb83c3_Client%20-%20PSSLTD%20(Background).avif)
- [Client - Happy Ring (Background)](https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/6a426dc91b5db38eeb9f9a79_Client%20-%20Happy%20Ring%20(Background).avif)
- [Client - Omicron (Background)](https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/6a426dc8e57f823bcb23eb4a_Client%20-%20Omicron%20(Background).avif)
- [Client - Alosant (Background)](https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/6a426dc82aeeb32d25045e95_Client%20-%20Alosant%20(Background).avif)

#### Raw files

```
brands/brand_heynesh.com/
├── brand_guidelines.md   ← auto-generated source
├── branding.json         ← full structured data
├── images.json           ← all 55 image URLs
├── page.md               ← full page markdown
└── screenshot.png        ← full-page screenshot
```

---

## Section 3 — Applying a Scraped Brand (Any URL)

When a brand has been scraped via the `brand-scraper` skill:

1. Read `brands/brand_<domain>/brand_guidelines.md` first
2. Pull CSS tokens from the `:root {}` block
3. Apply in order: **Colors → Typography → Spacing → Components**

### What the `brand_guidelines.md` contains

| Section | Contents |
|---------|---------|
| **Brand Identity** | Logo URL, favicon URL, OG/social image |
| **Color Palette** | Role → CSS token → hex + ready-to-paste `:root {}` |
| **Typography** | Font families, type scale, weights, Google Fonts import |
| **Spacing & Layout** | Base unit, border radius, layout config |
| **UI Components** | Per-component property tables |
| **Brand Personality** | Tone, energy, target audience |
| **Image Assets** | Logo, Hero/Banner, Social/OG, Other — with direct links |

---

## Application Rules (All Brands)

### Color hierarchy
- `primary` → key highlights, active states
- `secondary` / `accent` → CTAs, decorative highlights
- `background` → page/slide background
- `textPrimary` → all body and heading text
- For shapes/icons: cycle through accent colors for visual variety

### Typography hierarchy
- `h1–h3`: heading font family
- Body paragraphs: body/primary font family
- Code/mono: code font or system `monospace`

### Smart contrast
- Dark background → use light text (`--color-light` or `textPrimary`)
- Light background → use dark text (`--color-dark` or `textPrimary`)

### Triggering the brand-scraper first
If the user wants to apply a brand from a URL and no scrape data exists yet, say:
> *"I'll need to scrape that site's brand data first — give me a moment."*

Then run the `brand-scraper` skill and return here once `brands/brand_<domain>/brand_guidelines.md` is ready.
