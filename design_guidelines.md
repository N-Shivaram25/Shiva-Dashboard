# Design Guidelines: Personal Wellness & Productivity Tracker

## Design Approach

**Selected Approach:** Design System (Utility-Focused)
**Primary Inspiration:** Notion, Todoist, and Linear for productivity interfaces
**Rationale:** This is a daily tracking and productivity tool where efficiency, clarity, and consistent interaction patterns are paramount. The design should fade into the background, letting users focus on their daily entries.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Background: 0 0% 100% (pure white)
- Surface: 210 20% 98% (soft gray)
- Border: 214 15% 91%
- Text Primary: 222 47% 11%
- Text Secondary: 215 16% 47%
- Primary Brand: 217 91% 60% (calming blue for actions)
- Success: 142 71% 45% (completed tasks)
- Warning: 38 92% 50% (energy/eyesight alerts)
- Accent (subtle): 262 83% 58% (wellness/positive entries)

**Dark Mode:**
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Border: 217 19% 27%
- Text Primary: 210 20% 98%
- Text Secondary: 215 16% 65%
- (Same primary, success, warning, accent hues with adjusted lightness)

### B. Typography

**Font Families:**
- Primary: 'Inter', system-ui, sans-serif (Google Fonts)
- Monospace: 'JetBrains Mono' (for data/numbers)

**Scale:**
- Headings: font-semibold to font-bold
- Section Titles: text-xl (20px)
- Body: text-base (16px)
- Labels: text-sm (14px), uppercase tracking-wide for section headers
- Timestamps: text-xs (12px), text-secondary

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Card padding: p-6
- Section gaps: space-y-8
- Component spacing: gap-4
- Micro spacing: gap-2

**Container Structure:**
- Max-width: max-w-7xl mx-auto
- Responsive padding: px-4 md:px-6 lg:px-8
- Sections in 1-2 column grid: grid-cols-1 lg:grid-cols-2

### D. Component Library

**Dashboard Layout:**
- Date selector with calendar icon at top (sticky header)
- Grid layout: 2-column on desktop, single column on mobile
- Each section as an independent card with clear visual boundaries

**Section Cards:**
- White/Surface background with subtle border
- Rounded corners: rounded-xl
- Shadow: shadow-sm hover:shadow-md transition
- Header with icon + title + action buttons
- Input areas with proper focus states

**Input Components:**
- Text inputs: Clean, minimal borders, focus:ring-2 with primary color
- Textareas: Auto-expanding for thoughts/notes
- Checkboxes: Large, easy-to-tap for task completion
- Time pickers: Native or custom with clear AM/PM indicators

**Icons:**
- Use Heroicons (outline style) via CDN
- Section-specific icons: Target (Goals), CheckSquare (Tasks), Cloud (Thoughts), Zap (Energy), Heart (Wellness), ChatBubble (Communication), Film (Entertainment)
- Consistent 20px size for section headers

**Data Display:**
- Completed tasks with strikethrough + success color
- Negative thoughts with subtle warning background (not alarming)
- Energy tracking with visual indicators (bars or icons)
- Daily summary stats in compact badges

**Navigation:**
- Date navigation: Previous/Today/Next buttons with keyboard shortcuts
- Visual indicator for current day
- Quick filters: "Today", "This Week" tabs

### E. Interaction Patterns

**Micro-interactions:**
- Checkbox animations on task completion
- Smooth height transitions for expanding/collapsing sections
- Subtle success toast notifications for saved entries
- Loading skeleton states for data persistence

**Entry Management:**
- Quick-add inputs at top of each section
- Inline editing for existing entries
- Swipe-to-delete on mobile
- Bulk actions via multi-select (optional)

### F. Section-Specific Design

**Goals Section:**
- Clear input with priority indicators (high/medium/low via color dots)
- Progress visualization if goals have sub-tasks

**Works to Complete:**
- Checkbox list with due time indicators
- Drag handles for reordering priorities

**Negative Thoughts:**
- Calming, non-judgmental design language
- Optional tags for thought categorization
- Subtle prompt for reframing (optional)

**Energy/Eyesight Tracking:**
- Time-based entries with activity descriptions
- Visual graph/timeline showing eyesight impact throughout day
- Color coding: green (positive), yellow (neutral), red (negative impact)

**Wellness:**
- Quick-log buttons for common activities (water, exercise, meditation)
- Counter badges for recurring items

**Communication:**
- Task-style entries with person/context tags
- Priority flagging for urgent communications

**Entertainment:**
- Planned vs completed toggle
- Optional mood/satisfaction rating post-completion

### G. Accessibility & Polish

- Dark mode toggle in header (persistent preference)
- Consistent focus indicators (ring-2 ring-primary)
- ARIA labels for all interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Mobile-first responsive breakpoints
- Empty states with helpful illustrations/prompts

### Images

**No hero images required** - This is a productivity tool where immediate functionality matters most. Optional: Subtle abstract background pattern in header area (10% opacity geometric shapes) for visual interest without distraction.

**Summary:** A clean, efficient wellness tracker with Notion-inspired clarity, soft color psychology for different section types, and seamless daily entry workflows. Every interaction should feel instantaneous and intentional.