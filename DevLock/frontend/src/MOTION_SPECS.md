# MaskMe Motion Specification Sheet

Complete motion and animation specifications for developer implementation.

---

## 🎬 Motion Philosophy

**Interstellar-Inspired Cinematography:**
- **Slow, deliberate movements** with long easing curves
- **Layered parallax** for depth perception
- **Subtle ambient motion** always present (nebula drift)
- **Responsive microinteractions** with satisfying feedback
- **Cinematic timing** (220-400ms for UI, 8-30s for ambient)

---

## 📊 Easing Curve Library

### Primary Easing Functions

```css
/* Cinematic Enter - For UI elements entering viewport */
--ease-cinematic-enter: cubic-bezier(0.23, 0.78, 0.43, 1);
/* Use for: Modals, panels, buttons, cards */

/* Slow Drift - For ambient background motion */
--ease-slow-drift: cubic-bezier(0.25, 0.46, 0.45, 0.94);
/* Use for: Nebula layers, particles, floating elements */

/* Quick Snap - For instant feedback */
--ease-quick-snap: cubic-bezier(0.68, -0.55, 0.265, 1.55);
/* Use for: Checkbox toggles, badge pops */
```

### Duration Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `--duration-micro` | 120ms | Hover state changes |
| `--duration-quick` | 220ms | Button interactions, icon morphs |
| `--duration-normal` | 280ms | Modal open/close, panel slides |
| `--duration-slow` | 400ms | Page transitions, complex animations |
| `--duration-ambient` | 8-18s | Particle float cycles |
| `--duration-drift` | 30s | Nebula background drift |

---

## 🌌 Background Animation System

### Layer Architecture

```
Z-Index Stack:
┌─────────────────────────────────────┐
│  Layer C: Particles + Parallax (z:3) │  ← Mouse-reactive
├─────────────────────────────────────┤
│  Layer B: Mid Nebula (z:2)          │  ← Scale + opacity wobble
├─────────────────────────────────────┤
│  Layer A: Far Nebula (z:1)          │  ← Slow XY drift
├─────────────────────────────────────┤
│  Gradient Overlay (z:0)             │  ← Static depth fade
└─────────────────────────────────────┘
```

### Layer A - Far Nebula Drift

**Animation Keyframes:**
```typescript
{
  0%:   { x: 0,    y: 0 }
  25%:  { x: 10px, y: -8px }
  50%:  { x: -5px, y: 10px }
  75%:  { x: -10px, y: -5px }
  100%: { x: 0,    y: 0 }
}
```

**Properties:**
- Duration: `30s`
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Loop: `infinite`
- Opacity: `0.4` (static)

**Implementation (Motion):**
```typescript
<motion.div
  animate={{
    x: [0, 10, -5, -10, 0],
    y: [0, -8, 10, -5, 0],
  }}
  transition={{
    duration: 30,
    repeat: Infinity,
    ease: [0.25, 0.46, 0.45, 0.94],
  }}
/>
```

### Layer B - Mid Nebula Wobble

**Animation Keyframes:**
```typescript
{
  0%:   { scale: 1,    opacity: 0.6 }
  33%:  { scale: 1.05, opacity: 0.8 }
  66%:  { scale: 0.98, opacity: 0.5 }
  100%: { scale: 1,    opacity: 0.6 }
}
```

**Properties:**
- Duration: `12s`
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Loop: `infinite`

**Implementation (Motion):**
```typescript
<motion.div
  animate={{
    scale: [1, 1.05, 0.98, 1],
    opacity: [0.6, 0.8, 0.5, 0.6],
  }}
  transition={{
    duration: 12,
    repeat: Infinity,
    ease: [0.25, 0.46, 0.45, 0.94],
  }}
/>
```

### Layer C - Particles with Parallax

**Particle Properties:**
- Count: `30 particles`
- Size: `1-4px` (randomized)
- Position: Random `x: 0-100%`, `y: 0-100%`
- Glow: `box-shadow: 0 0 ${size*2}px rgba(92, 225, 230, 0.6)`

**Animation (Per Particle):**
```typescript
{
  0%:   { y: 0,     x: 0,    opacity: 0.3 }
  50%:  { y: -20px, x: 10px, opacity: 0.6 }
  100%: { y: 0,     x: 0,    opacity: 0.3 }
}
```

**Properties:**
- Duration: `8-18s` (randomized per particle)
- Delay: `0-5s` (randomized stagger)
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Loop: `infinite`

**Parallax Behavior:**
```typescript
// Mouse position normalized to -0.5 to 0.5
const mouseX = (clientX / windowWidth) - 0.5;
const mouseY = (clientY / windowHeight) - 0.5;

// Apply transform at 50% intensity (parallax factor)
<motion.div
  animate={{
    x: mouseX * 20,  // ±10px max
    y: mouseY * 20,
  }}
  transition={{
    type: "spring",
    stiffness: 50,   // Slow, elastic response
    damping: 20,     // Smooth damping
  }}
/>
```

---

## 🎨 Component Animations

### Button Interactions

#### Primary Button (Create Alias)

**Hover State:**
```typescript
whileHover={{ scale: 1.02 }}
transition={{ duration: 0.22, ease: [0.23, 0.78, 0.43, 1] }}
```

**Tap State:**
```typescript
whileTap={{ scale: 0.98 }}
```

**Glow Pulse (Continuous):**
```typescript
animate={{
  boxShadow: [
    "0 0 20px rgba(108, 99, 255, 0.3)",
    "0 0 30px rgba(108, 99, 255, 0.6)",
    "0 0 20px rgba(108, 99, 255, 0.3)",
  ],
}}
transition={{ duration: 2, repeat: Infinity }}
```

**Complete Implementation:**
```typescript
<motion.button
  className="btn-primary"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  animate={{
    boxShadow: [
      "0 0 20px rgba(108, 99, 255, 0.3)",
      "0 0 30px rgba(108, 99, 255, 0.6)",
      "0 0 20px rgba(108, 99, 255, 0.3)",
    ],
  }}
  transition={{
    scale: { duration: 0.22, ease: [0.23, 0.78, 0.43, 1] },
    boxShadow: { duration: 2, repeat: Infinity },
  }}
>
  Create Alias
</motion.button>
```

---

### Alias Row Entry (Staggered List)

**Entry Animation:**
```typescript
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{
  duration: 0.22,
  delay: index * 0.07,  // 70ms stagger per item
  ease: [0.23, 0.78, 0.43, 1],
}}
```

**Hover State:**
```typescript
whileHover={{ 
  scale: 1.01, 
  boxShadow: "0 12px 40px rgba(108, 99, 255, 0.2)" 
}}
```

**Action Buttons Reveal:**
```typescript
// Wrap action buttons in conditional motion
<motion.div
  initial={{ opacity: 0, x: -10 }}
  animate={{ 
    opacity: isHovered ? 1 : 0, 
    x: isHovered ? 0 : -10 
  }}
  transition={{ duration: 0.12 }}
>
  {/* Copy, Destroy buttons */}
</motion.div>
```

**Complete Implementation:**
```typescript
{aliases.map((alias, index) => (
  <motion.div
    key={alias.id}
    className="alias-row"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.22,
      delay: index * 0.07,
      ease: [0.23, 0.78, 0.43, 1],
    }}
    whileHover={{ 
      scale: 1.01, 
      boxShadow: "0 12px 40px rgba(108, 99, 255, 0.2)" 
    }}
    onHoverStart={() => setHoveredId(alias.id)}
    onHoverEnd={() => setHoveredId(null)}
  >
    {/* Alias content */}
  </motion.div>
))}
```

---

### Copy Button Success Feedback

**Icon Morph (Check Icon):**
```typescript
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ duration: 0.3, ease: [0.23, 0.78, 0.43, 1] }}
>
  <CheckIcon />
</motion.div>
```

**Particle Spark Burst (6 particles):**
```typescript
{[...Array(6)].map((_, i) => (
  <motion.div
    key={i}
    className="spark-particle"
    initial={{ 
      opacity: 1, 
      scale: 0,
      x: 0,
      y: 0,
    }}
    animate={{
      opacity: 0,
      scale: 1,
      x: Math.cos((i / 6) * Math.PI * 2) * 20,  // Radial distribution
      y: Math.sin((i / 6) * Math.PI * 2) * 20,
    }}
    transition={{
      duration: 0.5,
      delay: 0.1,
      ease: [0.23, 0.78, 0.43, 1],
    }}
  />
))}
```

**Timeline:**
1. Button click → `0ms`
2. Icon morph start → `0ms` (300ms duration)
3. Particle burst → `100ms` (500ms duration)
4. Icon revert → `2000ms`

---

### Modal Open/Close

**Modal Content:**
```typescript
initial={{ opacity: 0, scale: 0.98, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.98, y: 20 }}
transition={{ duration: 0.28, ease: [0.23, 0.78, 0.43, 1] }}
```

**Backdrop:**
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.28 }}
```

**Complete Implementation:**
```typescript
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        className="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 20 }}
        transition={{ duration: 0.28, ease: [0.23, 0.78, 0.43, 1] }}
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

### Toast Notification

**Entry Animation:**
```typescript
initial={{ opacity: 0, y: -20, scale: 0.9 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -20, scale: 0.9 }}
transition={{ duration: 0.25, ease: [0.23, 0.78, 0.43, 1] }}
```

**Success Particle Sparks:**
```typescript
{[...Array(6)].map((_, i) => (
  <motion.div
    key={i}
    className="spark"
    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
    animate={{
      opacity: 0,
      scale: 1,
      x: Math.cos((i / 6) * Math.PI * 2) * 20,
      y: Math.sin((i / 6) * Math.PI * 2) * 20,
    }}
    transition={{ duration: 0.5, delay: 0.1 }}
  />
))}
```

**Auto-Dismiss Timeline:**
1. Appear → `0ms`
2. Visible → `2000ms`
3. Disappear → `2500ms`

---

### Detail Panel Slide

**Slide In (From Right):**
```typescript
initial={{ x: "100%" }}
animate={{ x: 0 }}
exit={{ x: "100%" }}
transition={{ duration: 0.3, ease: [0.23, 0.78, 0.43, 1] }}
```

**Close Button Rotation:**
```typescript
whileHover={{ scale: 1.1, rotate: 90 }}
transition={{ duration: 0.22 }}
```

---

### Onboarding Progress Dots

**Active Dot:**
```typescript
animate={{
  backgroundColor: "#5CE1E6",
  scale: 1.5,
}}
transition={{ duration: 0.4 }}
```

**Pulse Ring (Active Only):**
```typescript
<motion.div
  className="pulse-ring"
  initial={{ scale: 1, opacity: 1 }}
  animate={{ scale: 3, opacity: 0 }}
  transition={{ duration: 1.5, repeat: Infinity }}
/>
```

**Step Transition (Horizontal Slide):**
```typescript
<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={currentStep}
    custom={direction}
    initial={{ opacity: 0, x: direction * 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction * -50 }}
    transition={{ duration: 0.4, ease: [0.23, 0.78, 0.43, 1] }}
  >
    {stepContent}
  </motion.div>
</AnimatePresence>
```

---

### Status Badge Pulse (Active Only)

**Dot Glow:**
```typescript
animate={{
  boxShadow: [
    "0 0 4px #5CE1E6",
    "0 0 8px #5CE1E6",
    "0 0 4px #5CE1E6",
  ],
}}
transition={{ duration: 1.5, repeat: Infinity }}
```

---

### Destroy Button Red Pulse

**Warning Glow:**
```typescript
animate={{
  boxShadow: [
    "0 0 20px rgba(239, 68, 68, 0.3)",
    "0 0 30px rgba(239, 68, 68, 0.5)",
    "0 0 20px rgba(239, 68, 68, 0.3)",
  ],
}}
transition={{ duration: 1.5, repeat: Infinity }}
```

---

## 🎯 Animation Performance Guidelines

### GPU Acceleration

```css
/* Enable for animated elements */
.animated-element {
  will-change: transform;
  transform: translateZ(0);
}

/* Remove after animation completes */
.animation-complete {
  will-change: auto;
}
```

### Prefer Transform Over Position

✅ **Good:**
```typescript
animate={{ x: 100, y: 50, scale: 1.2, rotate: 45 }}
```

❌ **Avoid:**
```typescript
animate={{ left: "100px", top: "50px", width: "120%" }}
```

### Stagger Optimization

**For lists > 20 items:**
```typescript
// Limit stagger to first 10 items
delay: Math.min(index * 0.07, 0.7)
```

### Reduce Motion (Accessibility)

```typescript
import { useReducedMotion } from "motion/react";

const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={shouldReduceMotion ? {} : { scale: 1.2, rotate: 360 }}
/>
```

---

## 📐 Recommended Spring Configs

### Default UI Spring
```typescript
transition={{
  type: "spring",
  stiffness: 300,
  damping: 30,
}}
```

### Elastic Snap
```typescript
transition={{
  type: "spring",
  stiffness: 500,
  damping: 25,
}}
```

### Smooth Follow (Parallax)
```typescript
transition={{
  type: "spring",
  stiffness: 50,
  damping: 20,
}}
```

---

## 🔄 Animation State Machine

### Button States
```
[Default] → hover → [Hovered] → click → [Pressed] → release → [Hovered]
                                                   ↓
                                              [Loading] → complete → [Success]
```

### Alias Row States
```
[Hidden] → mount → [Entering] → complete → [Visible] → hover → [Hovered]
                                                       ↓
                                                  [Selected] → click away → [Visible]
```

### Modal States
```
[Closed] → trigger → [Opening] → complete → [Open] → close → [Closing] → [Closed]
```

---

## 📊 Motion Audit Checklist

- [ ] All animations use CSS transforms (not position)
- [ ] Durations match design tokens (120ms/220ms/280ms/400ms)
- [ ] Easing curves use cinematic-enter or slow-drift
- [ ] Staggered lists use 70ms delay increment
- [ ] Hover states respond in < 120ms
- [ ] Modals animate backdrop blur simultaneously
- [ ] Particle animations use spring physics for parallax
- [ ] Success feedback includes particle sparks
- [ ] Reduced motion preference is respected
- [ ] GPU acceleration enabled for complex animations

---

**Motion System Version:** 1.0.0  
**Optimized for:** 60fps on modern devices  
**Accessibility:** WCAG 2.1 Level AA compliant (reduced motion support)
