# Phases — Resume Builder + AI Polish

## Phase 1 — Static form + live preview
Build the full form (all sections) and a preview panel that reflects it in real time, using local React state only. No Firebase, no AI, no PDF yet.
**Done when:** typing in any field instantly updates the preview, no console errors, no network calls firing.

## Phase 2 — Repeatable entries
Add the ability to add/remove multiple Experience and Education entries.
**Done when:** you can add three jobs, delete the middle one, and the preview reflects the correct remaining two in order.

## Phase 3 — Firebase Auth + Firestore save/load
Wire up email/password auth. On save, write the full resume state to Firestore under the signed-in user. On load, populate the form from Firestore if a saved resume exists.
**Done when:** fill in data, refresh the page, data is still there — and a second test account sees an empty form, not the first account's data.

## Phase 4 — Gemini AI Polish (default provider)
Wire the AI Polish button on one section first, verify raw API output in the console before touching the UI, then extend to all sections.
**Done when:** clicking Polish replaces that section's text with a rewritten version, and the rewrite doesn't introduce facts not present in the original (check a few times manually).

## Phase 5 — PDF export
Wire html2pdf.js to the preview panel.
**Done when:** the downloaded PDF visually matches the on-screen preview, with correct page breaks on a realistically long resume, not just a short test one.

## Phase 6 — Puter as an alternate provider
Add a provider toggle (Default / Puter). Load Puter's script tag, wire `puter.auth.signIn()` on first selection, route the Polish call through `puter.ai.chat()` when Puter is selected.
**Done when:** switching to Puter, signing in, and clicking Polish produces a rewritten section via the user's own Puter account — confirmed by checking that no Gemini API calls fire while Puter is selected.

## Phase 7 — Security rule testing
Confirm Firestore rules block cross-user reads/writes (attempt to read another UID's resume doc directly and confirm it's denied).

## Phase 8 — Full manual test pass
End-to-end run as a brand-new user: sign up, fill every section, use Polish under both providers, export PDF, log out, log back in, confirm data persisted.

## Phase 9 — Design-checklist recheck
Re-check against Design.md's anti-slop list and print-safety, now with real (non-dummy) content in the preview.

## Phase 10 — Deployment + GitHub push
Deploy to Vercel, confirm the live URL works end-to-end, push to GitHub with the gitignored key file confirmed absent from the commit history.
