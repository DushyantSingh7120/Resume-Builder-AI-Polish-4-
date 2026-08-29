# Architecture — Resume Builder + AI Polish

## Locked stack
- Frontend: React + Vite
- Styling: Tailwind (installed, not CDN — this is a real React build)
- Backend/BaaS: Firebase Auth (email/password) + Firestore
- Default AI: Gemini API (isolated model-name constant, same pattern as Scribe/Project 3)
- Optional AI: Puter.js (`puter.ai.chat()`) — loaded via script tag, used only when a user actively selects "Puter" as their provider
- PDF export: html2pdf.js
- UI feedback: sonner (toasts for save/polish/export/connect events)
- Mobile layout: vaul (drawer/bottom-sheet for the preview panel on small screens)
- Deployment: Vercel

## Data model (Firestore)
```
users/{uid}
  resume: {
    personalInfo: { name, email, phone, location, summary },
    experience: [ { id, company, role, startDate, endDate, description } ],
    education: [ { id, institution, degree, startDate, endDate } ],
    skills: [ string ],
    aiProvider: "default" | "puter",
    updatedAt: timestamp
  }
```
One document per user holding the whole resume. No subcollections needed for V1.

## App flow
1. User signs up/logs in (Firebase Auth).
2. On load, fetch `users/{uid}.resume` from Firestore; populate form state (empty defaults if none exists).
3. Every form input updates central React state; the preview panel re-renders from that same state — it is always live, there is no separate "generate preview" step.
4. Add/remove buttons on Experience and Education push/remove entries from their respective arrays in state.
5. AI Polish button on a section reads `aiProvider` from state:
   - `default` → sends section text to your Gemini config function (same call pattern as Scribe).
   - `puter` → sends section text to `puter.ai.chat()`. Requires `puter.auth.signIn()` to have completed first in that session; if not signed in, trigger the Puter sign-in popup before the call.
   - Either path returns rewritten text and replaces that section's text in state.
6. Save button (or debounced autosave) writes the whole resume object to Firestore.
7. Download PDF button runs html2pdf.js against the preview panel's DOM node.

## External API contracts
- **Gemini:** same call shape as Scribe — one config constant for model name, structured prompt with an explicit "do not invent facts, only rephrase" instruction.
- **Puter:** `puter.ai.chat(prompt)` — no key required, but requires a completed `puter.auth.signIn()`. Wrap the polish call in a signed-in check and prompt sign-in if needed.

## Security summary (plain language)
Firestore rules restrict every read/write on `users/{uid}` to that user's own UID — nobody can see or edit another user's resume. When Puter is selected, that AI usage runs entirely on the user's own Puter account and never touches your Firebase project or your Gemini key — no cost or data exposure on your side from that path.
