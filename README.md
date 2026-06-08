# A3 Productions 

A high-end, scroll-driven portfolio website for A3 Productions. Light mode by default, with cinematic motion design, cascading card animations, and meticulous typographic hierarchy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build tool | Vite 5 |
| Framework | React 18 + TypeScript 5 |
| Styling | Tailwind CSS 3 + custom CSS |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Images | Pexels (stock) |
| Database | Supabase (available, not yet wired) |

---

## Project Structure

```
project/
├── public/
│   └── image.png              # Brand logo used throughout (inverted via CSS filter)
├── src/
│   ├── App.tsx                # All components, data, and page layout (single-file architecture)
│   ├── index.css              # Custom CSS: holographic text, grain overlay, ticker, card styles
│   ├── main.tsx               # React entry point (StrictMode + createRoot)
│   └── vite-env.d.ts          # Vite client type declarations
├── index.html                 # HTML shell with OG meta tags
├── vite.config.ts             # Vite config (React plugin, lucide-react excluded from optimizeDeps)
├── tailwind.config.js         # Tailwind config (default, content paths only)
├── postcss.config.js          # PostCSS with tailwindcss + autoprefixer
├── tsconfig.json              # Root TS config (references app + node configs)
├── tsconfig.app.json          # App TS config (JSX preserve, ES2020 target)
├── tsconfig.node.json         # Node/Vite TS config
├── eslint.config.js           # Flat ESLint config with React hooks + refresh plugins
└── package.json               # Dependencies and scripts
```

---

## Architecture

The entire UI lives in `src/App.tsx` as a single-file architecture. This keeps the component graph flat and makes the motion choreography easy to reason about, since all scroll-linked animations share the same coordinate space.

### Component Tree

```
App
├── grain-overlay-light          (fixed, pointer-events: none)
├── <nav>                        (fixed, scroll-reactive background)
│   └── AnimatePresence          (mobile menu)
├── Hero                         (full-viewport, parallax logo + text)
├── SectionBlur > Ticker         (infinite horizontal scroll marquee)
├── SectionBlur > Stats          (2x2 / 4-col grid, staggered reveals)
├── <section#work>
│   ├── Work heading             (Reveal animation)
│   └── CascadingCards           (scroll-pinned card stack)
│       └── CascadeCard x4       (individual peel-away cards)
├── SectionBlur > Services       (divided list, hover-reveal descriptions)
├── SectionBlur > Studio         (two-column: holo text + logo)
├── SectionBlur > CTA            (full-width call to action)
└── SectionBlur > Footer         (three-column footer)
```

---

## Key Components

### `SectionBlur`

A scroll-aware wrapper that applies edge blur, opacity fade, and subtle scale compression to every content section. Each section tracks its own `scrollYProgress` relative to the viewport, producing these effects:

- **Blur**: 8px Gaussian at viewport edges, 0px when fully visible
- **Opacity**: Dips to 0.25 at edges, full 1.0 in the center
- **Scale**: Compresses to 0.97 at edges, 1.0 in the center

All values are spring-smoothed (stiffness: 80, damping: 22) for a cinematic feel. The footer variant omits blur and only applies fade/scale.

### `Reveal`

A viewport-triggered entrance animation. Supports four directional variants:

| Variant | Direction | Use case |
|---|---|---|
| `REVEAL_UP` | Bottom to center | Stats, general content |
| `REVEAL_LEFT` | Left to center | Section headings |
| `REVEAL_RIGHT` | Right to center | Accent elements, CTAs |
| `REVEAL_SCALE` | Scale up from 92% | Project cards |

Each variant includes a simultaneous blur-from-12px-to-0 effect. Elements trigger once when they enter the viewport with a -80px margin, and support staggered delays via the `delay` prop (in milliseconds).

### `CascadingCards` + `CascadeCard`

The signature interaction of the portfolio. Four project cards are stacked on top of each other, pinned to the viewport via `position: sticky`. As the user scrolls through the tall container (5x viewport height), each card peels away in sequence:

**Mechanics:**
- The container is `(totalCards + 1) * 100vh` tall, providing scroll distance
- A `sticky` inner div pins the card stack to the viewport
- Each card gets an equal slice of the total scroll progress (0-0.25, 0.25-0.5, etc.)
- Within each slice: first 40% the card is stationary, last 60% it peels away
- Odd-indexed cards peel left, even-indexed peel right (alternating cascade)
- Peel animation includes horizontal translation (+/-300px), rotation (+/-8 degrees), upward drift (-200px), scale-down (to 0.88), and opacity fade (to 0)
- All transforms are spring-smoothed for organic motion
- z-index ordering ensures the topmost card (index 0) is always visually in front

### `Hero`

Full-viewport landing section with multiple parallax layers:

- **Logo**: Large brand image positioned bottom-right, drifts down 140px and fades as user scrolls
- **Heading**: "We Scale Systems." with holographic gradient on "Systems.", moves up 60px and fades
- **Cursor glow**: Follows the mouse on desktop with an indigo radial gradient (340px diameter)
- **Ambient haze**: Subtle multi-color radial gradient creating depth
- The entire section blurs to 16px and fades to 10% opacity as the user scrolls past it

---

## Design System

### Color Palette (Light Mode)

| Role | Value | Usage |
|---|---|---|
| Background | `#FFFFFF` / `white` | All section backgrounds |
| Primary text | `#000000` / `black` | Headings, strong content |
| Secondary text | `#4B5563` / `gray-600` | Body copy, descriptions |
| Tertiary text | `#6B7280` / `gray-500` | Labels, metadata |
| Subtle text | `#9CA3AF` / `gray-400` | Section headings, watermarks |
| Faint text | `#D1D5DB` / `gray-300` | Decorative, separators |
| Borders | `#E5E7EB` / `gray-200` | Card borders, dividers |
| Card surfaces | `#F9FAFB` / `gray-50` | Card backgrounds |
| Accent gradient | Indigo -> Blue -> Purple -> Pink -> Cyan -> Teal | Holographic text |

### Typography

- **Font**: Inter (Google Fonts), weights 300-900
- **Headings**: `font-black` (900), `tracking-tight`, `leading-[0.82-0.85]`
- **Hero**: `clamp(56px, 8.5vw, 128px)` responsive sizing
- **Section headings**: `text-6xl md:text-8xl`
- **Body**: `text-sm` to `text-xl`, `font-light` to `font-medium`
- **Labels**: `text-[9-11px]`, `tracking-[0.22-0.35em]`, `uppercase`
- **Line height**: 150% body, 82-85% headings

### Spacing

- **8px grid system** via Tailwind's default spacing scale
- Section padding: `py-28` to `py-44`, `px-8 md:px-16`
- Component gaps: `gap-5` (cards), `gap-16` (stats), `gap-20` (studio grid)

---

## CSS Custom Effects (`index.css`)

### `holo-text-light`

A multi-stop gradient applied via `background-clip: text` that cycles through indigo, blue, purple, pink, cyan, and teal. The `background-size: 300% 300%` with a 7-second infinite animation creates a shifting holographic shimmer on key words like "Systems.", "Built", and "Build?".

### `grain-overlay-light`

A fixed, full-viewport SVG noise texture at 3% opacity with `mix-blend-mode: multiply`. Adds subtle film grain for a premium print feel. Pointer-events are disabled so it never blocks interaction.

### `cursor-glow`

A 340px circular radial gradient (indigo at 8% opacity) that follows the mouse cursor. Only visible on `lg:` breakpoints. Creates a subtle spotlight effect on the hero section.

### `nav-link-light`

Navigation links with an underline that expands from left on hover using a `::after` pseudo-element, animated with a cubic-bezier easing.

### `ticker`

An infinite horizontal marquee animation. The `.ticker-track` translates -50% over 25 seconds, creating a seamless loop of capability keywords. The content is duplicated to prevent gaps.

### `project-card-light`

Hover state transitions: `translateY(-5px)`, multi-layered box-shadow with an indigo glow component, and smooth 500ms easing. The inner image transitions from grayscale to color over 700ms.

### `service-desc`

Description text in the services list that is hidden by default (`max-height: 0, opacity: 0`) and expands on hover of the parent row (`max-height: 60px, opacity: 1`) with a 450ms cubic-bezier transition.

---

## Animation Patterns

### Easing Curve

All custom animations use `[0.16, 1, 0.3, 1]` -- an aggressive ease-out that starts fast and decelerates slowly, giving a snappy yet elegant feel.

### Spring Physics

Scroll-linked transforms use spring smoothing to prevent jank:

| Context | Stiffness | Damping |
|---|---|---|
| Section blur/opacity/scale | 80 | 22 |
| Card peel transforms | 120 | 30 |
| Card peel opacity | 200 | 30 |

### Scroll-Linked vs. Scroll-Triggered

- **Scroll-linked**: Hero parallax, nav background, cascading cards, section blur -- these continuously update as the user scrolls, creating a 1:1 mapping between scroll position and visual state.
- **Scroll-triggered**: Reveal animations fire once when an element enters the viewport, then stay in their final state. This is managed by Framer Motion's `useInView` hook with `once: true`.

---

## Data

All content is defined as typed constant arrays at the top of `App.tsx`:

- **`projects`**: 4 items with `num`, `title`, `category`, `tags`, `desc`, `year`, `image` (Pexels URLs)
- **`services`**: 4 items with `num`, `title`, `desc`
- **`stats`**: 4 items with `value`, `label`

No backend or database is connected yet. Supabase is available in the environment if persistence is needed later.

---

## Navigation

- **Desktop**: Horizontal nav with four links (Work, Studio, Services, Contact) that anchor-scroll to their respective sections. Background transitions from transparent to white with backdrop-blur on scroll.
- **Mobile**: Hamburger icon animates into an X. Menu drops down with staggered link animations. Backdrop-blurred white panel.

---

## Responsive Breakpoints

| Breakpoint | Tailwind | Layout changes |
|---|---|---|
| < 640px | default | Single column, compact spacing, mobile nav |
| 640px+ | `sm` | Service descriptions side-by-side, taller card images |
| 768px+ | `md` | Desktop nav visible, 2-col stats grid, larger typography |
| 1024px+ | `lg` | Cursor glow visible, full parallax depth |

---

## Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run lint       # ESLint check
npm run typecheck  # TypeScript type checking (no emit)
```

---

## Key Design Decisions

1. **Single-file architecture** -- All components in one file to keep the motion choreography coherent and avoid prop-drilling scroll progress values across module boundaries.

2. **Light mode only** -- White backgrounds, dark text, no dark theme toggle. The holographic gradients and indigo accents are specifically tuned for light surfaces.

3. **Logo inversion** -- The brand logo (`image.png`) is dark-on-transparent. It is inverted via CSS `filter: invert` to appear as a light silhouette on the hero, and again inverted for the white-background nav/footer.

4. **Grayscale-to-color images** -- Project card images start in grayscale and transition to full color on hover, creating a premium editorial aesthetic.

5. **Edge blur sections** -- Content blurs and fades at the viewport edges, creating a "camera focus" effect that draws attention to the center of the screen.

6. **Sticky card stack** -- The work section pins the card stack to the viewport while the user scrolls through, ensuring the cascade animation is always visible without the cards scrolling off-screen.

7. **Spring smoothing on scroll transforms** -- Raw scroll-linked values can feel jittery. All scroll-driven properties pass through `useSpring` with tuned stiffness/damping for organic motion.

---

## Browser Support

Targets modern evergreen browsers via Vite's default build targets. The site uses:

- CSS `backdrop-filter` (widely supported, graceful degradation)
- CSS `mix-blend-mode` (full support in modern browsers)
- SVG feTurbulence for noise texture (full support)
- Framer Motion scroll tracking (uses IntersectionObserver + scroll events)
- `position: sticky` (full support in modern browsers)

---

## License

Private project. All rights reserved.
