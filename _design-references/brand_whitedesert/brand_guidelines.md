# White Desert — Brand Guidelines

> **Source**: [https://white-desert.com](https://white-desert.com)
> **Extracted**: 2026-08-25
> **Color Scheme**: Light
> **Screenshot**: [View Full-Page Screenshot](screenshot.png)

> *White Desert is the world's leading luxury Antarctic expedition company, offering once-in-a-lifetime journeys to the South Pole and Emperor Penguins. Founded by Patrick Woodhead. Limited to 12 guests per camp.*

---

## Brand Identity

| Asset | Details |
|-------|---------|
| **Logo** | SVG inline (White Desert wordmark + emblem). White on dark. |
| **Favicon** | [favicon.ico](https://white-desert.com/favicon.ico?favicon.d05ab43b.ico) |
| **OG / Social Image** | [Antarctica Hero](https://cdn.sanity.io/images/kq9qn5zn/production/61d6822b0a9de3ba0d497135328c37d64f981c0d-2000x1333.jpg) |

---

## Color Palette

| Role | CSS Token | Hex | Usage |
|------|-----------|-----|-------|
| Primary Brand | `--color-primary` | `#FF7E15` | CTAs, highlights, brand accent (deep orange) |
| Secondary | `--color-secondary` | `#FF0000` | Semantic / alert use only |
| Accent / Text | `--color-accent` | `#1F2A44` | Dark navy — primary text and heading color |
| Background | `--color-background` | `#FFFFFF` | Page background (bright white) |
| Text Primary | `--color-text-primary` | `#1F2A44` | All body and heading text |
| Link | `--color-link` | `#1F2A44` | Navigation and inline links |

### CSS Custom Properties

```css
:root {
  --color-primary:      #FF7E15;
  --color-secondary:    #FF0000;
  --color-accent:       #1F2A44;
  --color-background:   #FFFFFF;
  --color-text-primary: #1F2A44;
  --color-link:         #1F2A44;
  --color-surface-dark: #000000;
}
```

> **Design Note:** The hero section uses full black (`#000000`) as the base canvas. The white page body creates a high-contrast split between the immersive dark hero and the clean editorial content below.

---

## Typography

### Font Families

| Role | Family | Fallback Stack |
|------|--------|----------------|
| **Display / Headings** | `Oswald` | `Arial Narrow`, `Arial`, `sans-serif` |
| **Primary / Body / UI** | `Inter Tight` | `system-ui`, `-apple-system`, `Helvetica Neue`, `Arial` |
| **Paragraph / Editorial** | `Cardinal Classic Long` | `Georgia`, `Cambria`, `Times New Roman`, `serif` |

> **Note:** `Cardinal Classic Long` is a commercial serif. Open-source alternative: `Cormorant Garamond` or `EB Garamond` (Google Fonts).

### Type Scale

| Element | Size | Family | Usage |
|---------|------|--------|-------|
| `display / h1` | `277px` | Oswald | Massive hero title, full-bleed, uppercase |
| `h2` | `90px` | Oswald | Section headings |
| `body` | `19.5px` | Inter Tight | Body copy, navigation, UI labels |
| `caption / label` | `~10px` | Inter Tight | Tags, buttons, small labels |

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Oswald:wght@200..700&display=swap" rel="stylesheet">
```

---

## Spacing and Layout

| Token | Value | Notes |
|-------|-------|-------|
| `--spacing-base` | `4px` | Base unit |
| `--border-radius` | `0px` | Sharp, unrounded corners throughout |
| Hero padding | `36px 40px` | Observed in hero nav area |

> **Layout Philosophy:** White Desert uses a full-viewport hero, followed by a clean white editorial grid. Sharp `0px` border-radius gives a premium, architecture-inspired rigidity. No pill buttons — everything is angular.

---

## UI Components

### Button Primary CTA

| Property | Value |
|----------|-------|
| Background | `transparent` |
| Text Color | `#FFFFFF` |
| Border | `1px solid rgba(255,255,255,0.3)` top and bottom only |
| Border Radius | `0px` |
| Font | `Inter Tight`, weight `500`, `10px`, uppercase, `letter-spacing: 0.15em` |
| Padding | `15px 30px` |

```css
.btn-wd-primary {
  background: transparent;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 15px 30px;
  font-family: 'Inter Tight', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 20px;
}
```

### Navigation Bar

| Property | Value |
|----------|-------|
| Style | Editorial, independent elements — no background box |
| Font | `Inter Tight`, uppercase, small |
| Color default | `#FFFFFF` |
| Color scrolled | `#1F2A44` |
| Behavior | Hides on scroll down, reveals on scroll up |

---

## Brand Personality

| Attribute | Value |
|-----------|-------|
| **Tone** | Awe-inspiring, authoritative, intimate |
| **Energy** | Calm, cinematic, deliberate — never rushed |
| **Target Audience** | Ultra-high-net-worth individuals, adventurers, scientists |
| **Color Scheme** | Light body (white) over dark hero (black) |
| **Design Language** | Cinematic editorial — National Geographic meets luxury hospitality |
| **Key Emotion** | Reverence for nature; exclusivity without pretension |

### Copywriting Voice

- Active and evocative: *"Vast, majestic and unimaginably beautiful"*
- Never salesy — the product speaks for itself
- Short, powerful sentences, dense with meaning
- Uses the word "extraordinary" intentionally, never casually

---

## Image Assets

### Cloud Parallax Assets (Key Design Elements)

These are the actual cloud images used in the white-desert.com parallax transition:

| Asset | URL |
|-------|-----|
| Cloud Gradient (Mist) | https://white-desert.com/_next/image?url=%2Fimages%2Fcloud-gradient.png&w=3840&q=75 |
| Cloud 1 (Cropped) | https://white-desert.com/_next/image?url=%2Fimages%2Fcloud-1-cropped.png&w=3840&q=75 |
| Cloud 2 (Full) | https://white-desert.com/_next/image?url=%2Fimages%2Fcloud-2-full.png&w=3840&q=75 |
| Flight Path Map | https://white-desert.com/_next/image?url=%2Fimages%2Fflight-path_large.jpg&w=3840&q=90 |

### Content Photography (Sanity CDN)

| Description | URL |
|-------------|-----|
| Hero Antarctic Ice | https://cdn.sanity.io/images/kq9qn5zn/production/7f7efa50400ce9b425d21711fe3dbc6f34da5056-2000x1333.jpg |
| Antarctic Landscape (3000px) | https://cdn.sanity.io/images/kq9qn5zn/production/1a56d4190cee89b1fa408978753d1558a50d2639-3000x2014.jpg |
| Baby Penguins and Blue Tunnels | https://cdn.sanity.io/images/kq9qn5zn/production/16add1ee0bdc16862dc37b826abb1600887e7fbb-2000x1333.jpg |
| South Pole and Penguins | https://cdn.sanity.io/images/kq9qn5zn/production/fc3d4887c37b05526119edbc5db9d18a0b034c6b-2000x1250.jpg |
| South Pole and Blue Rivers | https://cdn.sanity.io/images/kq9qn5zn/production/545ecd31bdf0cdd5605316894111fb0f197e0129-2668x2000.jpg |
| The Long Stay | https://cdn.sanity.io/images/kq9qn5zn/production/0554de84a6e2cfa68bff6d38a7d7e1c975653f91-2000x1333.jpg |
| Antarctica in a Day | https://cdn.sanity.io/images/kq9qn5zn/production/a1e7092001e46b8511e5d9386f43ccfce30122d2-2000x1333.jpg |
| Camp Background | https://cdn.sanity.io/images/kq9qn5zn/production/be7f8922a9352273b56ca6798837ff6c95d3e060-2000x1250.jpg |
| Additional Scene 1 | https://cdn.sanity.io/images/kq9qn5zn/production/0f16bedb356a9d8a7833ce3f7155b0ff043ebd59-2000x1333.jpg |
| Additional Scene 2 | https://cdn.sanity.io/images/kq9qn5zn/production/997058a2941b8500aabe100c899a6443ae943494-2000x1250.jpg |

---

## Design System Notes

### Section Flow (Page Hierarchy)

1. **Hero** — Full-viewport dark cinematic with massive `277px` Oswald title. Video or landscape photography background.
2. **Cloud Parallax Transition** — `cloud-gradient.png` + `cloud-1-cropped.png` + `cloud-2-full.png`. Layers dissolve from dark hero into the white body.
3. **Introduction** — "Antarctica / The Last Continent" editorial copy over white background.
4. **Our Season** — Contextual text block. Body uses `Cardinal Classic Long` serif for warmth.
5. **Trip Cards** — Grid of images with pricing overlays. Clean, no decoration.
6. **Founder Quote** — Full-bleed testimonial. Emotional anchor.

### Signature Design Techniques

- **Parallax Cloud Effect:** 2 to 3 layers of PNG cloud images scrolling at different speeds (0.3x to 0.6x) transitioning from the dark hero to the white body.
- **Sharp geometry:** Zero border-radius everywhere. No shadows on interactive elements.
- **Typographic scale extremes:** Jumping from `277px` display down to `10px` button labels creates dramatic hierarchy.
- **Full-bleed photography:** All images are `object-fit: cover` at full width, no padding, no framing.

---

## Raw Files Reference

| File | Contents |
|------|---------|
| `brand_guidelines.md` | This document |
| `brand_report.md` | Raw agent analysis dump |
| `branding.json` | Full BrandingProfile from Firecrawl |
| `images.json` | All 20 image URLs from the page |
| `page.md` | Clean markdown version of page content |
| `screenshot.png` | Full-page screenshot |

---

> *Auto-generated by `execution/scrape_brand.py` and refined by `brand-guidelines` skill.*
