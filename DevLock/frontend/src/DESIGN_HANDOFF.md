# MaskMe Design System - Developer Handoff

## 📦 Deliverables Overview

This prototype demonstrates a complete, production-ready design system for MaskMe - a privacy-preserving disposable identity platform with Interstellar-inspired cinematography.

---

## 🎨 Design Token Reference

### Color Palette (CSS Variables)

```css
:root {
  /* Primary Colors */
  --primary: #6C63FF;        /* Violet Blue - primary actions */
  --accent: #5CE1E6;          /* Aqua - highlights & active states */
  --deep: #0D0D0D;            /* Near-Black - backgrounds */
  --muted: #EDEDED;           /* Light Neutral - text */
  --secondary: #3A2EFF;       /* Deep Purple - secondary accents */
  
  /* Semantic Colors */
  --status-active: #5CE1E6;
  --status-expired: #F59E0B;
  --status-destroyed: #EF4444;
}
```

### Motion Tokens

```css
:root {
  /* Easing Functions */
  --ease-cinematic-enter: cubic-bezier(0.23, 0.78, 0.43, 1);
  --ease-slow-drift: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Durations */
  --duration-micro: 120ms;    /* Hover states */
  --duration-quick: 220ms;    /* Button interactions */
  --duration-normal: 280ms;   /* Modal open/close */
  --duration-slow: 400ms;     /* Page transitions */
  --duration-drift: 30s;      /* Nebula background loop */
}
```

### Typography Scale

```css
:root {
  --h1: 34px;     /* Page titles */
  --h2: 24px;     /* Section headers */
  --h3: 20px;     /* Card titles */
  --body: 16px;   /* Main text */
  --small: 14px;  /* Labels */
  --tiny: 12px;   /* Captions */
}
```

**Font Stack:**
- Primary: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Monospace: `'SF Mono', Consolas, 'Liberation Mono', Courier`

---

## 🧩 Component Library

### Core Components (All Located in `/components/`)

| Component | File | Variants | Key Props |
|-----------|------|----------|-----------|
| **Button** | `Button.tsx` | Primary, Secondary, Text | `variant`, `size`, `icon`, `disabled` |
| **GlassCard** | `GlassCard.tsx` | Default, Hoverable | `hover`, `onClick` |
| **StatusBadge** | `StatusBadge.tsx` | Active, Expired, Destroyed | `status` |
| **CopyInput** | `CopyInput.tsx` | Default | `value`, `label` |
| **AliasRow** | `AliasRow.tsx` | Default | `alias`, `onCopy`, `onDestroy`, `onViewDetails` |
| **Modal** | `Modal.tsx` | sm, md, lg sizes | `isOpen`, `onClose`, `title`, `size` |
| **Toast** | `Toast.tsx` | Success, Error, Info | `isVisible`, `message`, `type` |
| **NebulaBackground** | `NebulaBackground.tsx` | Default (3-layer animated) | None (auto-render) |

---

## 🌀 Animation Specifications

### Nebula Background System (Multi-Layer)

**Layer A - Far Nebula (Slow Drift)**
- **Transform:** `translate(X: ±10px, Y: ±10px)`
- **Duration:** `30s`
- **Easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Loop:** Infinite
- **Implementation:** Radial gradient with continuous translate animation

**Layer B - Mid Nebula (Wobble)**
- **Transform:** `scale(0.98 - 1.05)`, `opacity(0.5 - 0.8)`
- **Duration:** `12s`
- **Easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Loop:** Infinite

**Layer C - Particles + Parallax**
- **Count:** 30 particles
- **Transform:** `translateY(-20px)`, `translateX(10px)`, `opacity(0.3 - 0.6)`
- **Duration:** `8-18s` (staggered per particle)
- **Parallax:** Mouse-based transform at 0.5x intensity
- **Easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Microinteractions

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| **Create Alias Button** | Hover | `scale(1 → 1.02)` + glow pulse | 220ms | cinematic-enter |
| **Alias Row Entry** | Mount | `opacity(0→1)`, `translateY(12px→0)` | 220ms | cinematic-enter |
| **Alias Row Stagger** | List render | Delay increment | 70ms/item | — |
| **Copy Button Success** | Click | Icon morph + 6 radial particle sparks | 300ms + 500ms | cinematic-enter |
| **Modal Open** | User action | `scale(0.98→1)` + backdrop blur fade | 280ms | cinematic-enter |
| **Toast Notification** | Event | `opacity(0→1)`, `translateY(-20→0)`, `scale(0.9→1)` | 250ms | cinematic-enter |
| **Detail Panel Slide** | Click alias | `translateX(100%→0)` | 300ms | cinematic-enter |
| **Destroy Button** | Hover | Red glow pulse (400ms loop) | 1.5s | — |

---

## 🖼️ Screen Specifications

### 1. Extension Popup (360×640px)
**File:** `ExtensionPopup.tsx`

**Layout:**
- Animated nebula bar (1px height, gradient pulse)
- Header: Logo + Settings icon
- Create Alias CTA (primary button, full width)
- Scrollable alias list (compact cards)
- Footer: History link + Dashboard link

**Key Features:**
- Compact glassmorphism cards
- Staggered list entry animations
- Toast notifications for actions
- Hover-reveal action buttons (Copy, Destroy)

### 2. Dashboard (900×700px)
**File:** `Dashboard.tsx`

**Layout:**
- **Sidebar (256px):** Logo, navigation (Overview/Aliases/Settings), stats card
- **Main Content:** Responsive to active view
  - **Overview:** Create CTA card + recent aliases
  - **Aliases:** Search/filter bar + full alias grid
  - **Settings:** Expiry defaults, API key, premium options
- **Detail Panel (320px slide-in):** Alias details with logs

**Key Features:**
- Parallax navigation transitions
- Search with real-time filtering
- Modal confirmations (destroy action)
- Sliding detail panel from right

### 3. Landing Splash (Full Screen)
**File:** `LandingSplash.tsx`

**Layout:**
- Centered hero with animated shield icon
- Headline: "MaskMe" (gradient text)
- Tagline + description
- Dual CTAs: "Open Extension Popup" / "Go to Dashboard"
- Feature cards (3-column grid)

**Key Features:**
- Full nebula background with floating particles
- Pulsing glow on hero icon
- Staggered feature card entry

### 4. Onboarding (Full Screen, 3 Steps)
**File:** `Onboarding.tsx`

**Steps:**
1. **Create Disposable Identities** (Shield icon)
2. **Set Expiry Times** (Clock icon)
3. **Monitor Activity** (Eye icon)

**Layout:**
- Centered glass card with icon, title, description
- Progress dots (animated active state)
- Back/Next navigation buttons

**Key Features:**
- Horizontal slide transitions between steps
- Pulsing progress indicator
- Icon glow animation

---

## 🎬 Lottie Export Recommendations

For performance optimization and smoother background loops, consider exporting these elements as Lottie JSON:

### Recommended Lottie Assets

1. **nebula-loop.json**
   - 3-layer nebula background with 30s loop
   - Usage: Replace CSS-based NebulaBackground for mobile/low-power devices

2. **particle-field.json**
   - 30 floating particles with staggered animation
   - Usage: Ambient background layer

3. **button-glow.json**
   - Pulsing glow for primary buttons (2s loop)
   - Usage: Create Alias button enhancement

4. **copy-success-spark.json**
   - 6 radial particles burst (500ms, play once)
   - Usage: Copy action feedback

### Export Settings (After Effects → Bodymovin)
- Export as JSON (Bodymovin v5.7.0+)
- Enable compression
- Set `loop: true` for background elements
- Set `autoplay: true` for ambient animations

---

## 🛠️ Implementation Guide

### Tech Stack
- **Framework:** React 18+ with TypeScript
- **Animation:** Motion (formerly Framer Motion)
- **Styling:** Tailwind CSS v4.0
- **Icons:** Lucide React

### Glassmorphism Implementation

```css
.glass-card {
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(236, 236, 236, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(108, 99, 255, 0.15);
}
```

### Parallax Mouse Tracking

```typescript
// Track mouse position
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };
  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);

// Apply with Motion spring animation
<motion.div
  animate={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
  transition={{ type: "spring", stiffness: 50, damping: 20 }}
>
  {/* Particle layer */}
</motion.div>
```

### Performance Optimization Tips

1. **Use CSS Transforms** over absolute positioning
2. **Enable GPU Acceleration:**
   ```css
   will-change: transform;
   transform: translateZ(0);
   ```
3. **Limit Active Animations** to visible viewport
4. **Memoize Static Components:**
   ```typescript
   const MemoizedCard = React.memo(AliasRow);
   ```
5. **Throttle Mouse Events** for parallax (use requestAnimationFrame)
6. **Consider Lottie** for complex background loops on lower-end devices

---

## 📁 File Structure

```
/
├── App.tsx                          # Main app with view router
├── styles/
│   └── globals.css                  # Design tokens + global styles
├── components/
│   ├── NebulaBackground.tsx         # 3-layer animated background
│   ├── GlassCard.tsx                # Glassmorphism card component
│   ├── Button.tsx                   # Primary/Secondary/Text button
│   ├── StatusBadge.tsx              # Active/Expired/Destroyed badge
│   ├── CopyInput.tsx                # Input with copy-to-clipboard
│   ├── AliasRow.tsx                 # Alias list item component
│   ├── Modal.tsx                    # Modal overlay component
│   ├── Toast.tsx                    # Toast notification with sparks
│   ├── ExtensionPopup.tsx           # 360×640 popup view
│   ├── Dashboard.tsx                # 900×700 dashboard view
│   ├── LandingSplash.tsx            # Landing page view
│   ├── Onboarding.tsx               # 3-step onboarding flow
│   └── DesignSystemDocs.tsx         # Design system documentation
└── DESIGN_HANDOFF.md                # This file
```

---

## 🎯 Naming Conventions

- **Components:** `component/[name]/v[version]`
  - Example: `component/alias-row/v1`
  
- **Tokens:** `token/[category]/[name]`
  - Example: `token/color/primary`, `token/duration/quick`
  
- **Motion:** `motion/[element]/[action]`
  - Example: `motion/create-alias/enter`, `motion/modal/open`
  
- **Icons:** `icon/[name]-[size]`
  - Example: `icon/shield-24`, `icon/copy-16`

---

## 📝 Usage Example

```typescript
import { Button } from "./components/Button";
import { GlassCard } from "./components/GlassCard";
import { StatusBadge } from "./components/StatusBadge";
import { NebulaBackground } from "./components/NebulaBackground";

function MyComponent() {
  return (
    <div className="relative">
      <NebulaBackground />
      
      <GlassCard hover onClick={() => console.log("clicked")}>
        <h3>My Alias</h3>
        <StatusBadge status="active" />
        <Button variant="primary" icon={<PlusIcon />}>
          Create Alias
        </Button>
      </GlassCard>
    </div>
  );
}
```

---

## 🚀 Next Steps for Developers

1. **Review Design System Docs** (`/docs` view in prototype)
2. **Copy CSS Variables** from `/styles/globals.css`
3. **Extract Components** from `/components/` directory
4. **Implement Motion Tokens** using provided easing curves
5. **Test Responsive Behavior** (popup: 360×640, dashboard: 900×700)
6. **Optimize Animations** for target devices
7. **Export Lottie Assets** if needed for performance

---

## 📞 Design System Support

For questions about motion specifications, component variants, or implementation details:
- **Review the live prototype** using the demo navigation
- **Check the Design System Docs** view for complete specifications
- **Reference component source code** in `/components/` for implementation details

---

**Design System Version:** 1.0.0  
**Last Updated:** November 25, 2025  
**Framework:** React + Motion + Tailwind CSS  
**Theme:** Interstellar-inspired Cinematic UI
