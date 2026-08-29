---
name: Professional Clarity
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3d4947'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#924628'
  on-tertiary: '#ffffff'
  tertiary-container: '#b05e3d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system centers on a **Professional Minimalist** aesthetic tailored for high-stakes career documentation. The objective is to reduce cognitive load for users managing complex personal data while evoking a sense of calm, precision, and institutional trust.

The design relies on generous whitespace, a restricted color palette, and high-quality typography to ensure that the user's content remains the focal point. Surfaces are clean and structured, avoiding unnecessary ornamentation in favor of functional clarity. The emotional response should be one of confidence and organized efficiency.

## Colors

The palette is anchored in a "Soft White" environment to minimize eye strain during long editing sessions. 

- **Primary (#0D9488):** A deep teal used for the most important "Success" actions, such as "Download PDF" or "Finalize."
- **Secondary (#2563EB):** A professional slate blue reserved for utility actions like "Polish with AI" or "Add Entry."
- **Neutrals:** We utilize a range of grays to establish hierarchy. Backgrounds use `#F9FAFB` to distinguish the canvas from the white `#FFFFFF` cards. 
- **Interactive States:** Hover states should darken the primary/secondary colors by 10%. Disabled states use `#F3F4F6` with `#9CA3AF` text.

## Typography

The system uses **Inter** exclusively to maintain a systematic, utilitarian feel. 

- **Hierarchy:** Use `display-lg` only for the resume title. `headline-md` serves as the primary section header (e.g., "Experience").
- **Readability:** Body text (`body-md`) must maintain a line height of at least 1.5x to ensure legibility of dense resume descriptions.
- **Labels:** Small caps or increased letter spacing should be applied to `label-md` when used for category identifiers to distinguish them from standard body copy.

## Layout & Spacing

This design system follows a **Fixed Grid** model for the central editing canvas to mimic the constraints of a physical page, while the surrounding UI uses a fluid, container-based approach.

- **Grid:** A 12-column grid is used for desktop layouts. Gutters are fixed at 24px to ensure breathing room between form inputs and the live preview.
- **Rhythm:** Spacing follows a 4px baseline. Components are separated by `stack-md` (16px), while major sections are separated by `stack-lg` (32px).
- **Responsive Behavior:** On mobile, margins reduce to 16px and the layout collapses to a single column, with the "Live Preview" moving to a toggleable floating action or a bottom sheet.

## Elevation & Depth

To maintain a minimalist profile, the design system avoids heavy shadows. Depth is communicated through **Tonal Layers** and subtle ambient occlusion.

- **Level 0 (Base):** `#F9FAFB` – The main application background.
- **Level 1 (Cards):** `#FFFFFF` – Used for white "Paper" containers. These feature a 1px border of `#E5E7EB`.
- **Level 2 (Active/Floating):** Use an extremely soft shadow: `0px 4px 12px rgba(0, 0, 0, 0.05)`. This is reserved for active input fields or dropdown menus.
- **Level 3 (Modals):** A more defined shadow `0px 12px 24px rgba(0, 0, 0, 0.08)` to separate critical overlays from the workspace.

## Shapes

The shape language is **Rounded**, providing a modern, approachable feel that softens the "institutional" nature of a resume builder.

- **Small elements:** Checkboxes and small tags use `rounded-sm` (4px).
- **Standard elements:** Buttons, input fields, and list items use the base `rounded-md` (8px).
- **Large containers:** Cards and modal overlays use `rounded-lg` (16px) to emphasize their role as distinct content areas.

## Components

### Buttons
- **Primary:** Filled `#0D9488` with white text. High emphasis.
- **Secondary ("Polish with AI"):** Outlined with `#2563EB` or light blue tint background `#EFF6FF` with `#2563EB` text.
- **Tertiary:** Ghost style, no background/border until hover. Used for "Cancel" or "Remove."

### Input Fields
- White background, 1px `#E5E7EB` border. On focus, the border changes to `#2563EB` with a 2px soft outer glow (ring). Labels sit clearly above the input in `label-sm`.

### Card-Style Entries
- For repeatable items (Work Experience, Education), use a white container with a subtle border. Include a "drag handle" icon on the left to indicate reorderability.

### Tag Chips
- Used for skills. Use a light gray background `#F3F4F6` with `body-sm` text. Include a "close" icon for removal functionality.

### Progress Indicators
- For "Resume Strength," use a horizontal bar with a primary color fill and a subtle background track of `#F3F4F6`.