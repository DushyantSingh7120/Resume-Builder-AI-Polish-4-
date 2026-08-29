# Rules — Resume Builder + AI Polish
*(Project-specific, on top of the global GEMINI.md rules already in effect.)*

## Cost boundary
Firebase free tier, Gemini free tier, html2pdf.js (free/open-source), Puter (free by design — usage runs on the user's own account, not yours). Flag before adding anything else with a cost.

## Secrets
Gemini API key isolated in a gitignored config file, with a matching example file (placeholder values) committed — same pattern as Scribe. Puter requires no key at all; don't add one.

## AI honesty constraint
Every AI Polish prompt, under both providers, must explicitly instruct the model to rephrase only — no invented job titles, numbers, dates, or achievements not present in the user's original text. This is a correctness requirement, not a style preference: fabricated resume content is a real harm to the person using the app, not just a bug.

## Prompting discipline / build order
Each phase isolated and tested before the next:
1. Form + live preview with static dummy data only — no AI, no database.
2. Firebase Auth + Firestore save/load on the same static form.
3. Gemini AI Polish wired to one section, then all sections.
4. Repeatable add/remove rows for Experience and Education.
5. PDF export.
6. Puter as an alternate provider — added last, since it's the newest and least-proven piece.

## Error handling
Same as always: exact console error text before any fix attempt, no guessing from a vague description.

## Provider-switch scope discipline
The Puter integration is additive only. If it causes friction (sign-in flow issues, inconsistent output, auth confusion), it is acceptable to ship V1 with Default-only and add Puter as a fast-follow — it must not block the core resume builder from shipping.
