# ShipTime Landing Page — Design System

> Based on the official ShipTime brand specification (version: alpha)

## Overview

ShipTime's brand system reads as a clear, practical logistics platform that makes a complex industry feel simple and trustworthy. Neutral canvas dominant (70%), dark blue for structure (20%), orange strictly as a sparing accent (10%). Manrope geometric display headlines paired with Inter for all body and UI text.

---

## Colors

| Token          | Hex       | Usage                                                   |
|----------------|-----------|---------------------------------------------------------|
| `navy`         | `#1C1E3D` | Anchor color. Headers, sections, footer, primary text   |
| `orange`       | `#EC5A26` | CTAs, icons, highlights, key moments. 10% rule          |
| `orangeSoft`   | `#F0845B` | Warm accent glows, gradient stops                       |
| `muted`        | `#6E728A` | Body copy, captions, de-emphasized labels               |
| `lightBlue`    | `#E3EEFC` | Soft gradient washes, hero background                   |
| `surface`      | `#F8FAFB` | Section backgrounds (alternating)                       |
| `surfaceAlt`   | `#F8FAFB` | Section backgrounds (alternating)                       |
| `border`       | `#E8E8E8` | Dividers, card borders                                  |
| `white`        | `#FFFFFF` | Canvas, card backgrounds                                |

### Color Ratio (70 / 20 / 10)
- **70% Neutral** — white, light grey, soft backgrounds
- **20% Dark Blue** — anchor for headers, contrast sections, structure
- **10% Orange** — CTAs, icons, highlights only

### Gradient System
- **Hero (Soft Blue Wash):** `linear-gradient(135deg, #FFFFFF 0%, #E3EEFC 55%, #F8FAFB 100%)`
- **Warm Accent Glow:** `radial-gradient(circle, rgba(240,132,91,0.12) 0%, transparent 68%)`

---

## Typography

| Role            | Font     | Size  | Weight | Line Height | Letter Spacing |
|-----------------|----------|-------|--------|-------------|----------------|
| Hero Display    | Manrope  | 72px  | 800    | 1.05        | -1.44px        |
| Display         | Manrope  | 56px  | 800    | 1.10        | -1.12px        |
| Section Heading | Manrope  | 40px  | 700    | 1.15        | -0.40px        |
| Card Heading    | Manrope  | 28px  | 700    | 1.20        | -0.28px        |
| Feature Heading | Manrope  | 22px  | 600    | 1.30        | 0              |
| Body Large      | Inter    | 18px  | 400    | 1.50        | 0              |
| Body            | Inter    | 16px  | 400    | 1.60        | 0              |
| Button          | Manrope  | 15px  | 600    | 1.40        | 0              |
| Caption         | Inter    | 14px  | 400    | 1.40        | 0              |
| Label           | Inter    | 13px  | 500    | 1.40        | 0.20px         |
| Micro           | Inter    | 12px  | 400    | 1.40        | 0              |

**CSS Variables:**
- `--font-manrope` — headings, buttons, labels, eyebrows
- `--font-inter` — body copy, captions, UI text

---

## Spacing & Layout

| Token     | Value |
|-----------|-------|
| `xxs`     | 2px   |
| `xs`      | 6px   |
| `sm`      | 8px   |
| `md`      | 12px  |
| `lg`      | 16px  |
| `xl`      | 24px  |
| `xxl`     | 32px  |
| `section` | 80px  |

- Max content width: `1240px` (wide), `960px` (text-heavy), `860px` (comparison)
- Section vertical padding: `py-20 md:py-28`
- Horizontal padding: `px-5 md:px-10`

---

## Border Radius

| Token  | Value  | Use                                     |
|--------|--------|-----------------------------------------|
| `xs`   | 4px    | Small tags, input details               |
| `sm`   | 8px    | Chips, small elements                   |
| `md`   | 12px   | Tables, grouped blocks                  |
| `lg`   | 16px   | Primary cards, feature bands            |
| `xl`   | 24px   | Large containers, globe card            |
| `pill` | 999px  | All CTA buttons                         |

---

## Components

### Buttons
- **Primary:** orange fill, white text, pill (999px), Manrope 600, 12px 24px padding
- **Secondary:** navy fill, white text, pill (999px), same dimensions
- **Outline:** transparent, navy border + text, pill

### Nav
- Fixed, `rgba(255,255,255,0.93)` + `blur(12px)`
- Logo left, single primary CTA right (no nav links)

### Hero
- `linear-gradient(135deg, #FFFFFF 0%, #E3EEFC 55%, #F8FAFB 100%)` background
- Warm radial glow behind headline
- Eyebrow → H1 (Manrope 800) → subtitle (Inter) → dual CTAs → 3-step strip

### Cards
- White background, `1px solid #E8E8E8` border, `borderRadius: 16px`
- No heavy drop shadows — depth through surface alternation

### Bento Grid (What We Do)
- 12-col asymmetric: Rate Shopping (7, navy) + Unified Platform (5, lightBlue)
- Fulfillment (5, surface) + Visibility (7, white+border)

### Globe Section
- `#F8FAFB` card background, `borderRadius: 24px`
- COBE markers use orange `#EC5A26`

### Metrics
- 3 stat cards, orange large figure, navy label, muted sub
- Cards: white bg, border, 16px radius

### FBA Comparison
- `surfaceAlt` section background
- Desktop: raised ShipTime column (white card, orange border, shadow)
- Mobile: stacked cards

### Dual CTA
- Navy section background
- Left card: orange bg (primary action)
- Right card: translucent white

### Footer
- Navy background
- "Ship Smarter Today" tagline
- Address + phone

---

## CTAs & Tracking

| Parameter      | Value                                       |
|----------------|---------------------------------------------|
| `utm_source`   | `shiptimelandin`                            |
| `utm_medium`   | `landing`                                   |
| `utm_campaign` | `logistics-report` / `book-meeting`         |
| `utm_content`  | `nav` / `hero` / `dual-cta` / `footer`      |

**Report URL:** Google Form (questionnaire)  
**Meeting URL:** `https://meetings-na3.hubspot.com/peter-sexton/meeting-with-peter`

---

## Analytics

- **GA4 ID:** `G-Y984M16EL7` (ShipTime's stream)
- Cross-domain linking: `shiptime.com` ↔ `shiptimelandin.com`
- Loaded via `next/script` with `strategy="afterInteractive"`

---

## File Structure

```
app/
  layout.tsx          # Manrope + Inter fonts, GA4 script, metadata
  page.tsx            # All sections inline except Globe and Why
  globals.css         # Tailwind v4, marquee keyframes

components/ui/
  shiptime-globe-section.tsx   # COBE globe + carrier copy
  shiptime-why-section.tsx     # Marquee + 4-col feature grid
  marquee.tsx                  # Marquee animation
  icons.tsx                    # SVG line icons

public/
  shiptime-logo.svg            # Main logo
```

---

## Voice & Copy

- **Use:** ShipTime, Ship Smarter, courier (parcel), carrier (freight/both), shippers
- **Avoid:** em dashes, AI filler words (seamless, leverage, game-changer), "customers/members"
- **Format:** Active voice, no all-caps paragraphs, standard hyphens only
