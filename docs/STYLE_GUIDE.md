# Guildustry Style Guide

## Design Philosophy

**Clean • Minimal • Professional • Elegant**

Guildustry follows a clean, functional design that prioritizes clarity and user experience. The interface uses a restrained color palette with strategic accent colors to guide user attention and create visual hierarchy.

---

## Color System

### Theme Structure

The application uses a **CSS variable-based theming system** that automatically adapts to light and dark modes via the `data-theme` attribute on the HTML element.

**Never use Tailwind's `dark:` prefix.** Instead, use theme-aware utility classes that adapt automatically.

### Color Variables

#### Dark Mode (Default)

- **Main Background**: `#080808` - Primary page background
- **Surface Background**: `#111111` - Card and elevated surfaces
- **Light Background**: `#1b212c` - Secondary surfaces
- **Main Text**: `#ffffff` - Primary text color
- **Light Text**: `#e5e5e5` - Secondary text color
- **Main Accent**: `#f59f0a` - Brand orange/amber
- **Border Subtle**: `rgba(255, 255, 255, 0.12)` - Subtle borders

#### Light Mode

- **Main Background**: `#e0e0e0` - Light gray background
- **Surface Background**: `#ffffff` - White cards
- **Light Background**: `#ffffff` - White surfaces
- **Main Text**: `#0f172a` - Dark text
- **Light Text**: `#334155` - Secondary text
- **Main Accent**: `#f59f0a` - Same accent color
- **Border Subtle**: `rgba(0, 0, 0, 0.16)` - Dark borders

### Utility Classes

**Backgrounds:**

- `.bg-main-bg` - Primary background
- `.bg-surface` - Card/surface background
- `.bg-light-bg` - Secondary surface background
- `.bg-main-accent` - Accent color background

**Text:**

- `.text-main-text` - Primary text color
- `.text-main-light-text` - Secondary text color
- `.text-main-accent` - Accent color text

**Borders:**

- `.border-subtle` - Theme-aware subtle border

**Grid Backgrounds:**

- `.bg-grid` - Geometric grid pattern overlay
- `.bg-surface/60` - Semi-transparent surface for grid sections

---

## Typography

### Font Pairing

**Titles & Headings**: Red Hat Display

- Weight: Variable (500-700)
- Use for: All headings (h1-h6), display text, buttons

**Body Text**: Cambria

- Weight: 500
- Use for: Paragraphs, labels, descriptions, all body copy

### Font Classes

```tsx
// Titles/Headings
className = "font-title"; // Red Hat Display

// Body text (default)
className = "font-body"; // Cambria (default on body element)
```

### Type Scale

**Headings:**

- `text-6xl` / `lg:text-7xl` - Hero headlines
- `text-4xl` / `sm:text-5xl` / `lg:text-6xl` - Page titles
- `text-3xl` / `sm:text-4xl` - Section headings
- `text-2xl` / `sm:text-3xl` - Subsection headings
- `text-xl` - Card titles
- `text-lg` - Large body text

**Body:**

- `text-lg` / `sm:text-xl` - Large paragraphs
- `text-base` / `sm:text-lg` - Standard paragraphs
- `text-sm` - Small text, captions
- `text-xs` - Labels, metadata

---

## Layout Patterns

### Container Structure

```tsx
<section className="bg-main-bg text-main-text">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
    {/* Content */}
  </div>
</section>
```

**Spacing:**

- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Vertical padding: `py-16 lg:py-20` (sections) or `py-24 sm:py-28 lg:py-36` (hero sections)

### Grid Background Sections

```tsx
<section className="relative bg-grid bg-surface/60 text-main-text">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-grid opacity-30" />
  </div>
  <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
    {/* Content */}
  </div>
</section>
```

---

## Component Patterns

### Cards

```tsx
<div className="rounded-2xl border border-subtle bg-surface p-6 hover:shadow-lg transition-shadow">
  {/* Card content */}
</div>
```

**Variations:**

- Standard: `bg-surface`
- With shadow: `shadow-elevated`
- Popular/Featured: `border-main-accent shadow-lg`

### Buttons

Use the `Button` component with variants:

- `variant="accent"` - Primary CTA (orange background)
- `variant="outline"` - Secondary action (outlined)
- `size="md"` - Large buttons for CTAs
- `size="sm"` - Small buttons for navigation

### Input Fields

```tsx
<input className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors" />
```

### Form Labels

```tsx
<label className="block text-sm font-medium mb-2 text-main-light-text">
  Label Text
</label>
```

---

## Visual Elements

### Decorative SVGs

Use decorative SVGs in corners or backgrounds with:

- Position: `absolute -right-6 -top-6` or similar
- Size: `h-20 w-20` or `h-40 w-40`
- Opacity: `opacity-10`
- Color: `text-main-accent`

```tsx
<svg
  className="absolute -right-6 -top-6 h-20 w-20 opacity-10 text-main-accent"
  viewBox="0 0 100 100"
  fill="none"
>
  {/* SVG paths */}
</svg>
```

### Icons

Use Iconify React with Lucide icons:

- Standard size: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)
- Extra large: `w-8 h-8` (32px)
- Always use accent color: `text-main-accent`

### Badges/Pills

```tsx
<span className="inline-flex items-center px-4 py-2 rounded-full border border-main-accent bg-surface/80 backdrop-blur-sm">
  <span className="text-main-accent font-medium text-sm">Badge Text</span>
</span>
```

---

## Spacing & Sizing

### Consistent Spacing

- **Gap between grid items**: `gap-6` or `gap-8`
- **Card padding**: `p-6` or `p-8`
- **Section margins**: `mb-10` or `mb-12` for headings
- **Element spacing**: `mt-4`, `mt-6`, `mt-8` for vertical rhythm

### Responsive Breakpoints

- **Mobile**: Default (no prefix)
- **Small**: `sm:` (640px+)
- **Medium**: `md:` (768px+)
- **Large**: `lg:` (1024px+)
- **Extra Large**: `xl:` (1280px+)

### Grid Patterns

```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## Animation Guidelines

### GSAP Animations

Use GSAP with ScrollTrigger for scroll-based animations:

```tsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

useEffect(() => {
  if (typeof window === "undefined") return;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power2.out", duration: 0.6 },
    });
    tl.from(titleRef.current, { y: 20, autoAlpha: 0 }).from(
      textRef.current,
      { y: 16, autoAlpha: 0 },
      "-=0.25"
    );
  }, rootRef);
  return () => ctx.revert();
}, []);
```

### CSS Transitions

Use for hover states and interactive elements:

- `transition-colors` - Color changes
- `transition-all` - Multiple properties
- `hover:shadow-lg` - Elevation on hover

---

## Form Patterns

### Form Structure

```tsx
<form onSubmit={handleSubmit} className="space-y-5">
  <div>
    <label className="block text-sm font-medium mb-2 text-main-light-text">
      Label
    </label>
    <input
      {...register("field")}
      className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
    />
    {errors.field && (
      <p className="mt-1 text-sm text-red-500">{errors.field.message}</p>
    )}
  </div>
</form>
```

### Validation

- Use Zod for schema validation
- Use react-hook-form for form state
- Display errors in red: `text-red-500`
- Error borders: `border-red-500 focus:ring-red-500`

---

## Accessibility

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (`<section>`, `<nav>`, `<article>`, etc.)
- Use `<label>` for form inputs

### ARIA Labels

- Add `aria-label` for icon-only buttons
- Use `aria-hidden="true"` for decorative elements

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use proper focus states: `focus:ring-2 focus:ring-main-accent`

---

## Theme Implementation

### Never Use Tailwind `dark:` Prefix

**❌ Wrong:**

```tsx
<div className="bg-white dark:bg-main-bg text-neutral-900 dark:text-main-text">
```

**✅ Correct:**

```tsx
<div className="bg-main-bg text-main-text">
```

### Theme-Aware Classes Only

Always use utility classes that adapt automatically:

- `bg-main-bg` instead of `bg-white dark:bg-main-bg`
- `text-main-text` instead of `text-neutral-900 dark:text-main-text`
- `text-main-light-text` instead of `text-neutral-600 dark:text-main-light-text`
- `bg-surface` instead of `bg-white dark:bg-surface`
- `border-subtle` instead of `border-neutral-300 dark:border-subtle`

### Background Patterns

For sections with grid backgrounds:

- `bg-grid bg-surface/60` - Grid with semi-transparent surface
- `bg-grid bg-white/60` - Light mode grid (only for specific cases)

---

## Common Patterns

### Hero Sections

```tsx
<section className="relative overflow-hidden bg-grid bg-surface/60 text-main-text">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-grid opacity-30" />
  </div>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36 relative z-10 text-center">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-title font-bold text-main-text">
      Title
    </h1>
    <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-main-light-text">
      Description
    </p>
  </div>
</section>
```

### Feature Cards

```tsx
<div className="group relative overflow-hidden rounded-2xl border border-subtle bg-surface p-6 hover:shadow-lg transition-shadow">
  <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
    <Icon icon="lucide:icon-name" width={44} height={44} />
  </span>
  <h3 className="mt-4 text-xl font-semibold text-main-text">Title</h3>
  <p className="mt-2 text-sm text-main-light-text leading-relaxed">
    Description
  </p>
</div>
```

### Statistics Display

```tsx
<div className="flex items-center gap-4">
  <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
    <Icon icon="lucide:icon" width={65} height={65} />
  </span>
  <div>
    <div className="text-6xl font-extrabold tracking-tight font-title text-main-text">
      10K+
    </div>
    <p className="mt-1 text-sm text-main-light-text">Label</p>
  </div>
</div>
```

---

## Best Practices

1. **Always use theme-aware utility classes** - Never mix Tailwind colors with dark: prefixes
2. **Consistent spacing** - Use the established spacing scale
3. **Mobile-first** - Design for mobile, enhance for larger screens
4. **Semantic HTML** - Use proper HTML elements for accessibility
5. **Performance** - Use `will-change-transform` and `transform-gpu` for animations
6. **Clean code** - Keep components focused and reusable
7. **Accessibility first** - Always consider keyboard navigation and screen readers

---

## Project Structure

```
src/
  app/
    [page]/
      components/     # Page-specific components
      page.tsx       # Page file
  components/        # Shared components
  styles/
    globals.css      # Global styles and theme variables
```

---

## Component Naming

- **PascalCase** for component files: `Hero.tsx`, `Button.tsx`
- **Descriptive names**: `CandidatesHero`, `EmployersHero` (not `Hero1`, `Hero2`)
- **Feature-based**: Group related components together

---

_Last Updated: 2025_
_Version: 1.0_
