# Lightning's Portfolio — Build Plan

---

## Vision

A single-page portfolio that feels like a **calm, breathing space** — not a flashy show reel.
Dark mode: nonchalant, powerful, low-color. Think late-night terminal meets premium SaaS.
Light mode: energetic, Google Material-inspired soft palette, like a sunny morning IDE.

Reference layout: gazijarin.com (full-viewport sections, smooth scroll between anchored panels).
Dark tone ref: craftwork.design (not jet black — warm near-blacks, muted surfaces, depth via layering).

---

## Tech Stack

| Role | Library |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| Routing | None — single page, anchor scroll |
| Animation | Framer Motion |
| 3D / WebGL | React Three Fiber + Drei |
| Styling | Tailwind CSS v3 + CSS variables |
| Theme | Custom React context + localStorage |
| Icons | Lucide React |
| Fonts | Google Fonts |
| Utilities | clsx + tailwind-merge |

---

## Folder Structure

```
src/
├── main.tsx                      # Entry, ThemeProvider wrap
├── App.tsx                       # Section assembly + smooth scroll
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Fixed top nav, theme toggle
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx              # ParticlePortrait + headline
│   │   ├── About.tsx             # FadeIn text + parallax + FractalTree
│   │   ├── Skills.tsx            # Scroll-triggered tag cloud
│   │   ├── Experience.tsx        # Timeline with scroll movement
│   │   ├── Projects.tsx          # RotatingCube showcase
│   │   └── Contact.tsx           # AuraBg + form
│   └── ui/
│       ├── ParticlePortrait.tsx  # Face → particles on hover/load (raw canvas)
│       ├── FractalTree.tsx       # p5.js fractal tree via react-p5-wrapper
│       ├── RotatingCube.tsx      # R3F cube, 6 faces = 6 projects
│       ├── AuraBackground.tsx    # Radial gradient blobs (theme-aware)
│       ├── BorderGlowCard.tsx    # Card with animated border glow
│       ├── FadeSection.tsx       # IntersectionObserver fade in/out
│       ├── ParallaxLayer.tsx     # Framer Motion parallax wrapper
│       ├── ClickSpark.tsx        # Global click spark burst (canvas, line sparks)
│       └── ThemeToggle.tsx       # Sun/Moon animated toggle
├── hooks/
│   ├── useTheme.ts
│   ├── useScrollProgress.ts
│   └── useMousePosition.ts
├── context/
│   └── ThemeContext.tsx
├── styles/
│   ├── globals.css               # CSS variables, base reset
│   └── tokens.css                # All color/spacing tokens
├── data/
│   ├── projects.ts               # Project metadata for cube faces
│   ├── skills.ts
│   └── experience.ts
├── assets/
│   └── images/
└── types/
    └── index.ts
```

---

## Color System

### Design Token Philosophy
- All colors defined as CSS variables on `:root` and `[data-theme="dark"]`
- Tailwind extended to consume these variables
- Zero hardcoded hex in components — always reference tokens

---

### Light Theme — "Energetic Morning"
Inspired by Google Material You soft tones. Warm whites, not sterile paper white.
Each section gets a different accent, creating rhythm without chaos.

```css
:root {
  --bg-primary:     #F8F7F4;   /* warm off-white */
  --bg-secondary:   #F0EDE8;   /* cream card surface */
  --bg-tertiary:    #E8E4DE;   /* subtle section dividers */

  --text-primary:   #1A1A1A;
  --text-secondary: #5C5C5C;
  --text-muted:     #9A9A9A;

  /* Google Material-inspired soft accents */
  --accent-red:     #E8645A;   /* soft coral — Contact section */
  --accent-yellow:  #F5C842;   /* warm yellow — Projects section */
  --accent-blue:    #5B9CF6;   /* calm sky — Hero/default interactive */
  --accent-green:   #5DBE89;   /* soft mint — Skills section */

  --accent-primary: var(--accent-blue);

  --glow-color:     rgba(91, 156, 246, 0.35);
  --border:         rgba(0, 0, 0, 0.08);
  --shadow:         0 4px 24px rgba(0,0,0,0.08);
  --particle-color: #5B9CF6;
}
```

---

### Dark Theme — "Nonchalant Dark"
Not true black. Warm charcoal surfaces. Single dominant accent (muted teal).
Other accents exist only for tags/badges — never for decoration.

```css
[data-theme="dark"] {
  --bg-primary:     #141414;   /* near-black, warm tint */
  --bg-secondary:   #1C1C1C;   /* elevated surfaces */
  --bg-tertiary:    #242424;   /* cards */

  --text-primary:   #E8E6E0;   /* warm off-white */
  --text-secondary: #888880;   /* muted body */
  --text-muted:     #555550;

  /* Single accent family — muted teal is the only real color */
  --accent-primary: #4ECDC4;
  --accent-dim:     #2A7A75;   /* for glows / dimmed states */

  /* Rarely used — tags/badges only */
  --accent-red:     #C0544A;
  --accent-yellow:  #B8913A;
  --accent-blue:    #3D7ABF;
  --accent-green:   #3D8F68;

  --glow-color:     rgba(78, 205, 196, 0.2);
  --border:         rgba(255, 255, 255, 0.06);
  --shadow:         0 4px 32px rgba(0,0,0,0.4);
  --particle-color: #4ECDC4;
}
```

---

## Typography

| Role | Font | Weights |
|---|---|---|
| Display / Name | **Cormorant Garamond** | 300, 600 |
| Headings | **DM Serif Display** | 400 |
| Body / UI | **DM Sans** | 300, 400, 500 |
| Code snippets | **JetBrains Mono** | 400 |

Cormorant's elegant thin serifs against DM Sans's geometric cleanliness = calm + techy.
JetBrains Mono reinforces the developer identity without being cliché.

---

## Layout — Section by Section

### 1. Navbar (Fixed)
- Transparent on top → frosted glass (`backdrop-filter: blur(12px)`) on scroll
- Logo: `L` monogram, draw-on SVG animation on mount
- Nav links: Hero / About / Skills / Experience / Projects / Contact
- Right: ThemeToggle (animated sun ↔ moon with Framer Motion)

### 2. Hero (100vh)
- **Left half**: Name in Cormorant Garamond, animated word-by-word
- **Right half**: `ParticlePortrait` — photo dissolves to particles on load, reforms on hover
- Subtext: typewriter effect (role titles cycle)
- `AuraBackground` blobs drifting slowly behind everything
- Scroll-hint arrow bouncing at bottom

### 3. About
- Two-column: bio text left, `FractalTree` growing on scroll right
- `ParallaxLayer`: text at 0.8× scroll speed, tree at 1.2×
- `FadeSection`: content fades in from below on enter, reverses on exit
- Key facts (location, year, interests) in `BorderGlowCard` chips

### 4. Skills
- Full-width section, scroll-triggered
- Tags float in by category with staggered Framer Motion delays
- Category headings colored with per-section accent (light mode only)
- Dark mode: all tags monochrome, one teal highlight per active category

### 5. Experience
- Vertical centered timeline
- Timeline line draws itself via `scaleY` as you scroll (`useScroll` + `useTransform`)
- Cards slide in from alternating left/right
- Node circles pulse on entry

### 6. Projects — Rotating Cube
- Centered R3F canvas: box geometry, 6 project faces
- Each face: `<Html>` overlay (Drei) — project name + stack chips + one-liner
- Auto-rotates slowly; click a face → lerp snap to center
- Ambient glow around canvas matches current face's project color
- Below: selected project detail panel with `FadeSection` + `BorderGlowCard`
- Mobile fallback: horizontal scroll card strip

### 7. Contact
- `AuraBackground` at maximum intensity — the most atmospheric section
- Simple form (name, email, message) — Formspree endpoint
- Social row with hover glow on each icon
- `BorderGlowCard` around the form container

---

## Component Details

### `ParticlePortrait`
- Raw canvas API — sample portrait pixels → spawn particles at sampled positions
- Idle: particles drift ±2px with sine wave
- Hover: scatter burst outward (velocity + friction), reform over 1.5s
- Color: `--particle-color` from active theme

### `FractalTree`
- p5.js sketch via `react-p5-wrapper` — recursive branch function, transparent canvas
- Angle oscillates with `sin(frameCount)` for a breathing, alive feel
- Wrapped in `IntersectionObserver`: p5 sketch only runs when section is in view
- Light: stroke in `--accent-green` tones. Dark: dim white / muted `--accent-primary`

### `RotatingCube` (React Three Fiber)
- `<mesh>` + `<boxGeometry args={[2, 2, 2]}>`
- 6 `<meshStandardMaterial>` faces with `<Html>` project overlays (Drei)
- `useFrame`: lerp `mesh.rotation` toward target on each tick
- Click handler: sets target rotation to snap to clicked face
- Lighting: `<ambientLight>` + `<pointLight>` — intensity responds to theme

### `AuraBackground`
- 3–5 `motion.div` blobs, `position: absolute`, `z-index: -1`, `pointer-events: none`
- `radial-gradient` with theme accent colors
- Framer Motion `animate` keyframes: slow drift (8–14s loop) + scale pulse
- Light: multi-color blobs (blue, green, yellow). Dark: single teal + near-invisible others

### `BorderGlowCard`
- Wrapper with `position: relative`, `overflow: hidden`, `border-radius`
- `::before` pseudo-element: `conic-gradient` rotates on hover
- Framer Motion: `whileHover` → glow opacity 0.6, scale 1.02

### `FadeSection`
- `motion.div` + `useInView({ once: false, margin: "-10% 0px" })`
- `initial: { opacity: 0, y: 30 }` → `animate: { opacity: 1, y: 0 }`
- Exit via `AnimatePresence` — reverses on scroll-out

### `ParallaxLayer`
- Thin wrapper: `useScroll` + `useTransform` mapped to `y`
- Props: `speed: number` (1.0 = normal, 0.5 = slow, 1.5 = fast)

### `ClickSpark`
- Overlay canvas that covers the full page (`position: absolute, pointer-events: none`)
- `ResizeObserver` on parent keeps canvas dimensions in sync
- Each click: spawns N line sparks radiating at evenly-spaced angles from click point
- Each spark animates outward using an easing function, fades out, then is removed
- Color, spark count, radius, duration all configurable via props
- Wraps children so it can be dropped at app root level

---

## Animation Principles

| Type | Approach |
|---|---|
| Section entrance | Staggered fade-up, 0.1s delay increments |
| Scroll-driven | `useScroll` + `useTransform` (parallax, timeline draw) |
| Hover | Scale 1.02 + glow; color shift on links |
| Theme switch | 300ms CSS `transition` on all `--var` |
| 3D cube | `useFrame` lerp — never hard snap |
| Particles | Custom velocity + friction, no heavy lib |

**Performance rules:**
- R3F: `frameloop="demand"` unless actively animating
- Particle portrait canvas: `will-change: transform`
- Heavy sections (R3F, particles): `React.lazy` + `Suspense`
- `prefers-reduced-motion`: disable all non-essential animations

---

## Data Shape

```typescript
// data/projects.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  url?: string;
  github?: string;
  accentColor: string;     // per-project glow color
  face: CubeFace;
}

type CubeFace = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
```

---

## Dependencies

```json
{
  "@react-three/fiber": "^8.x",
  "@react-three/drei": "^9.x",
  "three": "^0.170.x",
  "@types/three": "^0.170.x",
  "framer-motion": "^11.x",
  "react-p5-wrapper": "^4.x",
  "tailwindcss": "^3.x",
  "lucide-react": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

No tsParticles — custom canvas keeps the bundle lean and behavior fully controlled.

---

## Build Order

```
Phase 1 — Foundation
  ├── Vite + React 18 + TS scaffold
  ├── Tailwind + CSS token system
  ├── ThemeContext + ThemeToggle
  └── Navbar + scroll behavior

Phase 2 — Core UI Primitives
  ├── BorderGlowCard
  ├── FadeSection
  ├── ParallaxLayer
  ├── AuraBackground
  └── ClickSpark (global)

Phase 3 — Sections (top → bottom)
  ├── Hero (layout + typewriter + aura)
  ├── About (text + parallax columns)
  ├── Skills (scroll-triggered tags)
  ├── Experience (timeline)
  ├── Projects (cube + detail panel)
  └── Contact (form + aura peak)

Phase 4 — Complex Components
  ├── ParticlePortrait (canvas)
  ├── FractalTree (SVG)
  └── RotatingCube (R3F)

Phase 5 — Polish
  ├── ClickRipple tuning
  ├── Theme transition smoothing
  ├── Responsive (mobile fallbacks)
  └── Performance audit + lazy loading
```

---

## Responsive Strategy

| Breakpoint | Changes |
|---|---|
| Desktop >1024px | Full layout as described |
| Tablet 768–1024px | Single column, cube scales to 60vw |
| Mobile <768px | Cube → horizontal scroll card strip; FractalTree hidden; ParticlePortrait → static image + CSS filter effect |