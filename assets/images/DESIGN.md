---
name: SolarSync Control
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#d7ffc5'
  on-secondary: '#053900'
  secondary-container: '#2ff801'
  on-secondary-container: '#0f6d00'
  tertiary: '#fcf5ff'
  on-tertiary: '#3c0090'
  tertiary-container: '#e3d4ff'
  on-tertiary-container: '#7318ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#79ff5b'
  secondary-fixed-dim: '#2ae500'
  on-secondary-fixed: '#022100'
  on-secondary-fixed-variant: '#095300'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#23005b'
  on-tertiary-fixed-variant: '#5700c9'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  stat-value:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  grid-margin: 32px
  gutter: 20px
  container-padding: 24px
  stack-gap: 12px
---

## Brand & Style
The design system is engineered for high-performance energy monitoring and IoT management. It targets tech-literate users who demand precision, real-time responsiveness, and a premium "command center" aesthetic.

The visual style is a fusion of **Modern Corporate** and **Glassmorphism**, heavily influenced by high-end automotive interfaces. It utilizes a deep-space background to minimize eye strain in low-light environments while allowing neon functional accents to guide the eye toward critical data. The emotional response is one of total control, technical sophistication, and eco-innovation.

## Colors
This design system operates on a "Midnight Base" palette. The background is a near-black neutral to maximize the contrast of luminous data points.

- **Primary (Electric Cyan):** Reserved for active states, data linkages, and primary action buttons. It represents the flow of energy.
- **Secondary (Neon Green):** Used exclusively for positive status indicators, efficiency metrics, and solar gain icons.
- **Tertiary (Voltage Purple):** Utilized for deep-level technical metrics or secondary data streams like grid-export.
- **Surface Tiers:** Uses a scale of transparent whites over the charcoal base to create glass layers rather than solid grey blocks.

## Typography
The typography strategy prioritizes legibility and a technical "instrument panel" feel. **Inter** provides the structural clarity for the interface, while **JetBrains Mono** is introduced for labels and small-scale data readouts to evoke an engineering terminal.

Large numerical values (statistics) should use a tighter letter-spacing to appear more compact and powerful. All technical labels should be uppercase to maintain a disciplined, architectural hierarchy.

## Layout & Spacing
The design system employs a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

Layouts should prioritize "Information Density" without clutter. Components are grouped into logical clusters (e.g., Generation, Consumption, Storage) using generous 20px gutters. Internal card padding is locked at 24px to ensure data doesn't feel cramped against the highly rounded corners.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and tonal layering rather than traditional shadows. 

1.  **Base Layer:** Solid `#0A0A0B`.
2.  **Card Layer:** Background blur (20px) with a semi-transparent fill (`rgba(255, 255, 255, 0.03)`).
3.  **Borders:** Each card features a 1px "Hairline" border using a gradient of `white/10%` to `white/5%`.
4.  **Active Elevation:** When a card is focused or active, the border color shifts to the Primary Cyan and a subtle 15px outer glow (Primary Color at 20% opacity) is applied.

## Shapes
The design system utilizes a "Super-Ellipse" aesthetic. Cards and containers use a consistent **24px (rounded-xl)** radius to soften the technical nature of the data. 

Interactive elements like buttons and input fields follow a **Pill-shaped** (full radius) convention to distinguish them from informational containers. Data bars and progress indicators must have rounded caps to match the global organic-tech hybrid style.

## Components
- **Technical Gauges:** Circular or semi-circular arcs using Primary and Secondary colors. Use "track" lines (low-opacity strokes) to show the full range.
- **Glass Cards:** High-radius containers with `backdrop-filter: blur(20px)`. Text inside cards should use white at 90% opacity for body and 100% for headings.
- **System Buttons:** Primary buttons are solid Cyan with black text. Secondary buttons use the "Ghost" style—transparent with a 1px Cyan border.
- **Input Fields:** Darker than the card background (`rgba(0,0,0,0.2)`) with a subtle inner shadow to look "recessed."
- **Status Chips:** Small, high-contrast badges with a subtle glow (e.g., "ONLINE" in Neon Green with a 4px green outer blur).
- **Trend Sparklines:** Simplified vector lines without axes, colored based on the delta (Green for up, Red for down).