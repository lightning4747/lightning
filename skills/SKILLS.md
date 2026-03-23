---
name: lightning-portfolio
description: >
  Use this skill whenever building, editing, or reviewing any component, section,
  hook, or utility for Lightning's personal portfolio site. Triggers on any request
  involving portfolio components, theme tokens, animations, canvas effects, 3D scenes,
  or TypeScript files within the portfolio project. Also use when the user says things
  like "build the hero section", "write the FractalTree component", "add the theme toggle",
  "implement scroll animation", or any reference to the portfolio stack (Framer Motion,
  React Three Fiber, p5.js, CSS variables). This skill encodes the full design system,
  conventions, and architecture so every file stays consistent.
---

# Lightning Portfolio — Component Skill

## Project Overview

Single-page React 18 + TypeScript portfolio. Vite build. No backend.
Two themes: light (energetic, multi-color) and dark (nonchalant, calm, few colors).

---

## Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Animation | `framer-motion` ^11 |
| 3D | `@react-three/fiber` ^8 + `@react-three/drei` ^9 |
| Fractal | `react-p5-wrapper` ^4 |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Icons | `lucide-react` |
| Theme | React Context + `localStorage` |
| Utilities | `clsx`, `tailwind-merge` |

---

## Folder Structure

```
src/
├── components/
│   ├── layout/       Navbar, Footer
│   ├── sections/     Hero, About, Skills, Experience, Projects, Contact
│   └── ui/           Reusable primitives (see below)
├── hooks/            useTheme, useScrollProgress, useMousePosition
├── context/          ThemeContext.tsx
├── styles/           globals.css, tokens.css
├── data/             projects.ts, skills.ts, experience.ts
└── types/            index.ts
```

**Section order (top → bottom):** Hero → About → Skills → Experience → Projects → Contact

---

## CSS Token System

All colors are CSS custom properties. **Never hardcode hex in components.**
Always use `var(--token-name)`.

### Light Theme (`:root`)
```css
--bg-primary:     #F8F7F4;
--bg-secondary:   #F0EDE8;
--bg-tertiary:    #E8E4DE;
--text-primary:   #1A1A1A;
--text-secondary: #5C5C5C;
--text-muted:     #9A9A9A;
--accent-red:     #E8645A;
--accent-yellow:  #F5C842;
--accent-blue:    #5B9CF6;
--accent-green:   #5DBE89;
--accent-primary: var(--accent-blue);
--glow-color:     rgba(91, 156, 246, 0.35);
--border:         rgba(0, 0, 0, 0.08);
--shadow:         0 4px 24px rgba(0,0,0,0.08);
--particle-color: #5B9CF6;
```

### Dark Theme (`[data-theme="dark"]`)
```css
--bg-primary:     #141414;
--bg-secondary:   #1C1C1C;
--bg-tertiary:    #242424;
--text-primary:   #E8E6E0;
--text-secondary: #888880;
--text-muted:     #555550;
--accent-primary: #4ECDC4;
--accent-dim:     #2A7A75;
--accent-red:     #C0544A;
--accent-yellow:  #B8913A;
--accent-blue:    #3D7ABF;
--accent-green:   #3D8F68;
--glow-color:     rgba(78, 205, 196, 0.2);
--border:         rgba(255, 255, 255, 0.06);
--shadow:         0 4px 32px rgba(0,0,0,0.4);
--particle-color: #4ECDC4;
```

---

## Typography

| Role | Font | Weights |
|---|---|---|
| Display / Hero name | Cormorant Garamond | 300, 600 |
| Section headings | DM Serif Display | 400 |
| Body / UI text | DM Sans | 300, 400, 500 |
| Code / mono | JetBrains Mono | 400 |

---

## TypeScript Conventions

- All component props use explicit `interface`, never inline type literals
- All data shapes defined in `src/types/index.ts`
- No `any` — use `unknown` + narrowing if type is truly dynamic
- Framer Motion variants typed with `Variants` from `framer-motion`
- R3F refs typed as `useRef<THREE.Mesh>(null)`

```typescript
// Correct prop interface pattern
interface BorderGlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

// Correct data interface pattern (from types/index.ts)
export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  url?: string;
  github?: string;
  accentColor: string;
  face: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
}
```

---

## Animation Conventions

### Framer Motion

Always define variants outside the component (stable reference):

```typescript
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};
```

**Standard spring config** (use for all physical interactions):
```typescript
const spring = { type: 'spring', stiffness: 300, damping: 30 };
```

**Stagger children pattern:**
```typescript
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
```

**Scroll-driven animation pattern:**
```typescript
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
```

### CSS Transitions

Theme switching: `transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease`
Never transition `all` — it causes perf issues with transforms.

---

## Component Patterns

### FadeSection (scroll-triggered fade)
- Use `useInView` with `{ once: false, margin: '-10% 0px' }`
- `initial="hidden"` → `animate={inView ? 'visible' : 'hidden'}`
- Wrap every major section content block with this

### ParallaxLayer
- Props: `speed: number` (1.0 = normal, 0.5 = slow, 1.5 = fast)
- Internally uses `useScroll` + `useTransform` on `y`

### BorderGlowCard
- `mousemove` → track angle → apply `conic-gradient` on `::before`
- `whileHover`: glow opacity 0 → 0.6, scale 1 → 1.02
- Always `overflow: hidden` + `position: relative` on wrapper

### AuraBackground
- `position: absolute`, `z-index: -1`, `pointer-events: none`
- 3–5 `motion.div` blobs with `radial-gradient`
- Animate: slow drift 8–14s loop + scale pulse
- Light: multi-color blobs. Dark: single teal + near-invisible others

### ParticlePortrait (canvas)
- Raw canvas API — no library
- Samples portrait pixels → line segments at sampled positions
- Hover: scatter outward with velocity + friction, reform over 1.5s
- Color from `--particle-color` token
- Existing implementation in `src/components/ui/ParticlePortrait.tsx`

### FractalTree (p5.js)
- Uses `react-p5-wrapper` — `ReactP5Wrapper` component with a `sketch` prop
- Oscillating angle: `p5.map(p5.sin(p5.frameCount * 0.01), -1, 1, PI/2, PI/16)`
- Only runs when section is in viewport (pause p5 loop when not visible)
- Canvas background: transparent (`p5.clear()` each frame)
- Light stroke: `--accent-green`. Dark stroke: dim white

### RotatingCube (R3F)
- `<mesh>` + `<boxGeometry args={[2, 2, 2]}>`
- 6 faces with `<Html>` overlays from `@react-three/drei`
- `useFrame`: lerp `mesh.rotation` toward target (never hard snap)
- `frameloop="demand"` on Canvas, switch to `"always"` on hover/interaction
- Mobile fallback: horizontal scroll card strip (no R3F on mobile)

### ClickSpark (canvas)
- Full-page canvas overlay, `pointer-events: none`
- `ResizeObserver` keeps dimensions in sync with parent
- Click → N line sparks radiating at evenly-spaced angles
- Each spark eases outward, fades, then is cleaned up
- Wraps `children` at app root level

---

## Theme Context Usage

```typescript
// Reading theme
const { theme, toggleTheme } = useTheme();

// Applying theme
// In JSX — use data attribute on root, CSS vars handle the rest
// <div data-theme={theme}>...</div>  ← set once on App root

// In canvas/p5/R3F — read CSS var at runtime:
const particleColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--particle-color').trim();
```

---

## Performance Rules

- R3F Canvas: `dpr={[1, 1.5]}` cap, `frameloop="demand"` default
- Heavy sections (R3F, particles): `React.lazy` + `Suspense`
- Canvas elements: `will-change: transform` only while animating, remove after
- `prefers-reduced-motion`: wrap all non-essential animations in a check
- Mobile (<768px): disable FractalTree (hidden), reduce particle count to 30%, cube → card strip

```typescript
// Reduced motion check
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## Section-to-Accent Mapping (light mode)

| Section | Accent token |
|---|---|
| Hero | `--accent-blue` |
| About | `--accent-green` |
| Skills | `--accent-green` |
| Experience | `--accent-yellow` |
| Projects | `--accent-yellow` |
| Contact | `--accent-red` |

Dark mode: always `--accent-primary` (teal) regardless of section.

---

## File Naming

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`, prefixed `use`
- Data files: `camelCase.ts`
- CSS: `camelCase.css`
- Never use index files for components — import by full path

---

## What to Always Do

1. Read this skill before writing any portfolio file
2. Use CSS tokens — never hardcode colors
3. Define Framer Motion variants outside the component
4. Type all props with explicit interfaces
5. Check mobile breakpoint — does the component need a fallback?
6. Wrap section content in `FadeSection` for scroll reveal
7. Use `clsx` for conditional class merging, never string concatenation