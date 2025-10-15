# Design Guidelines: ADHD Task Card App

## Design Approach

**Selected Approach:** Design System (Utility-Focused)

Drawing inspiration from **Todoist's simplicity**, **Notion's clean aesthetics**, and **Streaks' visual feedback system**, optimized specifically for ADHD users who need minimal cognitive load and maximum clarity.

**Core Principles:**
- Radical simplicity to prevent overwhelm
- Immediate visual feedback for accomplishment
- Calming, focused color palette
- Consistent, predictable patterns

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 222 15% 12% (deep charcoal)
- Surface: 222 14% 18% (card backgrounds)
- Primary Action: 142 76% 36% (calming sage green - for completion/success)
- Accent: 262 52% 47% (soft purple - for streaks/gamification)
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 65%
- Border: 0 0% 25%

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary Action: 142 71% 45%
- Accent: 262 52% 55%
- Text Primary: 0 0% 15%
- Text Secondary: 0 0% 45%
- Border: 0 0% 88%

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - clean, legible for all UI
- Monospace: 'JetBrains Mono' (Google Fonts) - for streaks/stats

**Hierarchy:**
- Large Headings: text-3xl font-bold (current date, streak numbers)
- Section Headings: text-xl font-semibold
- Big Task: text-lg font-medium
- Small Tasks: text-base font-normal
- Metadata: text-sm font-normal text-secondary

### C. Layout System

**Spacing Primitives:** Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section gaps: gap-4 to gap-6
- Page margins: p-6 to p-8
- Card spacing: space-y-4

**Container Strategy:**
- Max width: max-w-3xl (optimal focus width for ADHD)
- Centered layout: mx-auto
- Single column flow (no multi-column distractions)

### D. Component Library

**Daily Card (Hero Component):**
- Large, centered card with subtle shadow
- Date header with current day prominence
- "Big One" input: Larger text field, green accent border on focus
- 2-3 smaller task inputs: Standard size, stacked vertically
- Checkbox interactions: Smooth scale animation, satisfying checkmark
- Card background: Elevated surface color with rounded-2xl borders

**Progress Dashboard:**
- Streak Counter: Large numerical display with flame/fire icon, monospace font
- Weekly Calendar Grid: 7-day visual showing completed days (green dots)
- Stats Cards: Compact cards showing "Tasks Completed This Week", "Current Streak", "Best Streak"
- Completion Graph: Simple bar chart showing tasks completed per day (last 7 days)

**Navigation:**
- Bottom tab bar (mobile-first): "Today" | "Progress" | "History"
- Minimal top bar: App name/logo, settings icon
- No hamburger menus - keep it flat and accessible

**Interactive Elements:**
- Primary Button: Rounded-full, bg-primary with white text, subtle hover lift
- Checkbox: Large touch targets (min 44x44px), green fill on complete
- Task Inputs: Clean text inputs with focus rings, no excessive borders
- "Destroy Card" button: End of day, red outline button with satisfying animation

**Gamification Elements:**
- Confetti animation on task completion (subtle, brief)
- Streak flame icon that grows with streak count
- Progress rings around weekly completion rate
- Achievement badges (unlocked at milestones: 7-day, 30-day, etc.)

### E. Animation Strategy

**Use Sparingly:**
- Task completion: Scale checkbox + green fade (200ms)
- Card destruction: Slide down + fade out (300ms)
- Streak increment: Pulse animation on number (150ms)
- Page transitions: Simple fade (200ms)

**Never Animate:**
- Background colors
- Text content
- Navigation elements
- Form inputs (except focus states)

---

## Page-Specific Guidelines

**Today View:**
- Full-screen daily card as primary focus
- Date at top: "Monday, January 20"
- Card destruction CTA at bottom after 6pm
- No clutter - just the card and minimal chrome

**Progress View:**
- Streak counter at top (largest element)
- Weekly calendar grid below
- Stats cards in 2-column grid (mobile: stack)
- Completion graph at bottom
- All within max-w-3xl container

**History View:**
- Scrollable list of past cards (read-only)
- Grouped by week with headers
- Show completion status (checkmarks for done tasks)
- Muted styling (less prominent than Today)

---

## Accessibility & ADHD-Specific Considerations

- Maintain consistent dark mode across all inputs/fields
- Use large, well-spaced touch targets (min 44x44px)
- Avoid rapid animations or flashing elements
- Keep visual hierarchy extremely clear
- Limit color palette to 3-4 colors maximum
- Use icons sparingly, always with text labels
- Ensure high contrast ratios (WCAG AAA where possible)
- Single-column layouts to prevent scanning fatigue

---

## Images

No hero images required. This is a utility app focused on clarity and function. Use icons from **Heroicons** (via CDN) for:
- Checkbox/checkmark icons
- Flame icon for streaks
- Calendar icons for history
- Settings/user icons

All icons should be outlined style, consistent stroke width, matching the minimal aesthetic.