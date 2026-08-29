# PRD — Resume Builder + AI Polish (Project 4)

## One-line pitch
Build a resume by filling in a form and watching a formatted resume take shape live next to it, with an AI button that polishes your wording on demand.

## Problem
People writing resumes either freeze on formatting or freeze on wording. This handles formatting automatically and gives an on-demand rewrite so wording isn't a blocker either.

## Target users
Portfolio piece — first real use case is your own resume. Generic audience if positioned as a freelance sample: students / early-career job-seekers.

## V1 feature list
1. Auth (Firebase Auth — email/password), each user's resume tied to their account.
2. Form sections: Personal Info, Work Experience (repeatable entries), Education (repeatable entries), Skills.
3. Live preview panel — updates instantly as the form is filled in, rendered as a single clean resume template.
4. AI Polish button per section — rewrites that section's text to sound more professional, without inventing facts.
5. AI provider choice: **Default** (your built-in Gemini setup, works automatically) or **Puter** (user connects their own Puter account; their AI Polish calls run on their own allowance instead of yours).
6. Save/load — resume data saved to Firestore under the user's account, reopens where they left off.
7. PDF export — one-click download of the current preview as a PDF (html2pdf.js).

## Explicitly NOT in V1
- Multiple resume templates/themes
- Multiple saved resumes per user
- Drag-to-reorder sections
- ATS-score checker
- Cover-letter generator
- Bring-your-own raw API key for any provider other than Puter — Puter is the only alternate provider in V1

## Style anchor
Zety/Novoresume's live-preview mechanic, single clean template, no paywalls.

## Done criteria
A user can sign up, fill in a complete resume across all sections, use AI Polish on at least one section under both providers (Default and Puter), refresh the page and see their data still there, and download a correctly formatted PDF — all without console errors.
