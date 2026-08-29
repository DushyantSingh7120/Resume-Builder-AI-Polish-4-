# Design — Resume Builder + AI Polish

## Token system
- **Palette:** light, calm, professional — same spirit as Scribe's `#F6F5F1` base. No full-dark UI, no default purple gradients.
- **Two-tone approach:** the form panel uses a neutral app-UI look (your own product styling); the preview panel is styled to look like an actual printed resume (tighter spacing, more "paper" than "app").
- **Type:** one clean sans for the app UI; a separate, more traditional resume-appropriate font for the preview content itself. This contrast is intentional — it signals "this is the real document, not just app chrome."
- **Layout:** two-column split-screen on desktop (form left, preview right); stacked with a tab/toggle on mobile.
- **Signature element:** a persistent small provider indicator near the AI Polish buttons — "Polishing with: Default" / "Polishing with: Puter" — so it's never ambiguous which provider is active.

## UI libraries
- **sonner** — toast notifications for every async action: resume saved, AI Polish succeeded/failed, PDF downloaded, Puter connected. Every wait-on-network moment in this app should end in a toast, not silence.
- **vaul** — drawer component for the mobile layout. On small screens, the preview slides up as a bottom sheet instead of a plain tab switch — install `vaul` alongside `sonner` at the same time as the base React/Vite/Tailwind setup.

## Design process (before writing any component code)
1. **Brainstorm a token system first:** 4–6 named hex colors, 2+ deliberately paired typefaces (one characterful display face used with restraint, one body face, one utility face for captions/dates), a one-paragraph layout concept, and one signature element unique to this product.
2. **Critique the plan against AI-generated defaults before building anything:** don't land on (a) cream background + serif + terracotta accent near #D97757, (b) near-black background + single neon accent, or (c) broadsheet hairlines with zero border-radius — unless deliberately chosen and justified, not landed on by default. Revise anything that matches one of these by accident.
3. **Spend boldness in one place.** The signature element is the one memorable thing; everything else stays quiet and disciplined. Responsive down to mobile, visible keyboard focus, reduced motion respected — these are the quality floor, not optional extras.
4. **Install the design-engineering skill pack in Antigravity** before building UI: `npx skills add emilkowalski/skills`. This applies animation-decision rules, easing curves, and typography discipline (65ch line-length cap, tabular numbers, origin-aware transforms) automatically while code is being generated, not just at review time.

## Anti-slop checklist (from global rules, applied here)
- No purple gradients, no sparkle/emoji icons in headings.
- No decorative animation without function. The one place motion is justified is the live preview updating — a subtle transition, not a bounce or confetti effect.
- Consistent border-radius and spacing across form and preview.
- Real loading state on the AI Polish button (both providers) and on the PDF export action — these are the two points the user actually waits on something.
- The preview panel must look print-safe by design, not just screen-safe — check it under print-preview during the design pass, not after everything is built.
