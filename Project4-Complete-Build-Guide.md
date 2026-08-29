# Project 4 Build Guide — Resume Builder + AI Polish
Every step from an empty folder to a deployed, working app. Follow in order. Don't skip a phase to get to the "fun" part faster — that's exactly how earlier projects picked up confusing bugs.

---

## PHASE 0 — Accounts, installs, and file setup
Do all of this before opening Antigravity for real work.

### 0.1 Software you need on your laptop (skip anything already installed)
- **Node.js** (v18 or higher) — download from nodejs.org, run the installer. Confirm it worked by opening a terminal and running:
  ```
  node -v
  npm -v
  ```
  Both should print a version number.
- **Git** — download from git-scm.com if not already installed. Confirm with `git -v`.
- **Antigravity** — already installed, per your setup.
- **VS Code** — already installed (backup editor, not primary).

### 0.2 Accounts you need
- **Google account** — for Firebase and for Stitch (can be the same one).
- **GitHub account** — for pushing the finished code.
- **Vercel account** — sign in with GitHub, no separate signup needed.
- Puter needs no account from you right now — users connect their own Puter account later, inside the app.

### 0.3 Create the Firebase project
1. Go to console.firebase.google.com, sign in.
2. Click **Add project**, name it (e.g. `resume-builder-ai`), continue through the prompts (disable Google Analytics for this — not needed).
3. Once created, click the **Web** icon (`</>`) to register a web app inside the project. Name it anything.
4. Firebase shows you a `firebaseConfig` object (apiKey, authDomain, projectId, etc.). **Copy this somewhere safe** — you'll paste it into a config file in Phase 3.
5. In the left sidebar: **Build → Authentication → Get started → Email/Password → Enable → Save.**
6. In the left sidebar: **Build → Firestore Database → Create database → Start in production mode → choose a region close to you → Enable.**

### 0.4 Get a Gemini API key
1. Go to aistudio.google.com.
2. Sign in, click **Get API key → Create API key**.
3. Copy the key (starts with `AIzaSy...`). **This is the AI Studio key type — the one you want**, not a Cloud Console key.

### 0.5 Create the project folder and drop in the planning files
1. Create a folder on your laptop, e.g. `resume-builder-ai`.
2. Put these five files (already generated) straight into that folder's root:
   - `PRD.md`
   - `Architecture.md`
   - `Design.md`
   - `Rules.md`
   - `Phases.md`
3. Open a terminal **inside that folder** and run:
   ```
   git init
   ```
   This starts version control from day one, before any code exists.
4. Create an empty repository on GitHub (github.com → New repository → name it the same as your folder → don't add a README, you'll push your own). Copy the repo URL it gives you — you'll use it at the very end (Phase 10), not now.

### 0.6 Install the design-engineering skill pack
Still inside that same folder, in the terminal, run:
```
npx skills add emilkowalski/skills
```
This drops a set of `SKILL.md` files into the folder that Antigravity auto-discovers — animation rules, easing curves, and typography discipline, applied automatically while it builds UI later.

**Phase 0 done when:** the folder has the five planning files + a `.git` folder + the new skill files, Firebase project exists with Auth and Firestore enabled, you have your Gemini key saved somewhere, and Node/Git both respond to version checks.

---

## PHASE 1 — Design the screens in Stitch
This happens in the browser, before Antigravity touches any code.

### 1.1 Open Stitch
Go to stitch.withgoogle.com, sign in with your Google account. No install needed.

### 1.2 Generate the Form screen
Start a new project in Stitch and paste a prompt like this (adjust freely, but keep the specificity — vague prompts give generic results):

```
Design a clean, professional resume-builder web app screen — the "Form" side
of a split-screen layout. Left side of the eventual screen will be this form;
right side (design separately) will be a live resume preview.

Style: light, calm, professional palette — no purple gradients, no near-black
backgrounds, no neon accents. Think a modern productivity tool, not a landing
page. Clear typography hierarchy, generous whitespace, one accent color used
sparingly for primary actions only.

Sections in the form, top to bottom: Personal Info (name, email, phone,
location, short summary), Work Experience (repeatable card-style entries,
each with an "Add another" button and a small delete icon per entry), 
Education (same repeatable pattern), Skills (tag-style input where typed
skills appear as removable chips).

Each section has a small "Polish with AI" button near its heading, styled
as a secondary button, not the primary action.

Make it responsive-aware: design the desktop version primarily, but keep
elements simple enough to reasonably stack on mobile.
```

### 1.3 Generate the Preview screen
New generation, same project:

```
Design the "Preview" side of the same resume-builder app — this is what a
finished, printable resume looks like, rendered live next to the form from
the previous screen. It should look like an actual resume document, not
app UI: use a more traditional, print-appropriate typeface for the resume
content itself, tighter spacing than the form side, clear section headers
(Experience, Education, Skills), and a header block with name and contact
info at the top. Include a small "Download PDF" button and a small
provider indicator text near the top ("Polishing with: Default") in a
muted, unobtrusive style. Match the same overall color palette as the
form screen from this same project, but this panel should read as "paper,"
not "app."
```

### 1.4 Refine
Use Stitch's direct-edit / re-prompt tools if anything looks generic or off — ask it to adjust specific elements rather than regenerating from scratch each time.

### 1.5 Export
1. In Stitch, open the **Export / More options** menu on each finished screen.
2. Export the **code** (HTML/CSS/Tailwind) for both screens.
3. If Stitch offers a `DESIGN.md` export for the project, grab that too — it's a portable design-system file.
4. Download the exported files as a zip.

### 1.6 Bring the export into your project folder
1. Unzip the download.
2. Inside your `resume-builder-ai` folder, create a new folder called `design-reference`.
3. Drop the exported HTML/CSS files (and `DESIGN.md` if you got one) into `design-reference`.

**Important:** this is a reference for Antigravity to build from — it is not the final app code. Treat it like a mockup, not a deliverable.

**Phase 1 done when:** you have a form-screen design and a preview-screen design you're happy with, exported and sitting inside `design-reference/`.

---

## PHASE 2 — Scaffold the project in Antigravity

### 2.1 Open the folder in Antigravity
Open Antigravity, open the `resume-builder-ai` folder as your project.

### 2.2 Confirm it's read your planning files
First prompt to Antigravity:

```
Before we do anything else: read PRD.md, Architecture.md, Design.md,
Rules.md, and Phases.md in this project's root, and look at the exported
designs inside /design-reference. Confirm back to me in your own words:
what this app does, the tech stack, and what the two Stitch-exported
screens show. Don't write any code yet.
```

Read its summary. If it's missed or misunderstood anything, correct it before moving on.

### 2.3 Scaffold React + Vite
In Antigravity's terminal (or ask Antigravity to run it):
```
npm create vite@latest . -- --template react
npm install
```
(The `.` means "scaffold into the current folder" since your planning files are already here — confirm it doesn't overwrite them; if it complains about a non-empty folder, let it merge, don't let it delete your `.md` files.)

### 2.4 Install Tailwind CSS (v4)
```
npm install tailwindcss @tailwindcss/vite
```
Then either ask Antigravity to wire it up, or do it yourself:
- In `vite.config.js`, add the Tailwind plugin alongside the React plugin.
- In `src/index.css`, replace the contents with:
  ```
  @import "tailwindcss";
  ```

### 2.5 Install the other libraries locked in Architecture.md
```
npm install firebase sonner vaul html2pdf.js
```

### 2.6 Run the design brainstorm-and-critique pass
Prompt:
```
Following the design process in Design.md: propose a token system (colors,
type, layout, signature element) based on the Stitch designs in
/design-reference. Then critique your own proposal against the three
generic AI-design defaults named in Design.md, and revise anything that
matches one of them by accident. Show me the final token system before
writing any component code.
```
Review and approve before continuing.

### 2.7 Start Phase 1 of Phases.md — static form + live preview
Prompt:
```
Begin Phase 1 from Phases.md only: build the full form (all sections, no
add/remove-row logic yet) and a preview panel that updates live from the
same React state, styled to match the approved token system and the
Stitch reference designs. No Firebase, no AI calls, no PDF export yet —
those come in later phases. Confirm when done, matching Phase 1's "done
when" criteria exactly.
```
Test it yourself in the browser before moving on: type in fields, confirm the preview updates instantly, check the browser console for errors.

**Phase 2 done when:** the app runs locally (`npm run dev`), the form and live preview both work with dummy typing, and it visually resembles the Stitch designs.

---

## PHASE 3 — Repeatable entries
Prompt:
```
Begin Phase 2 from Phases.md: add the ability to add and remove multiple
Work Experience and Education entries. Test by adding three experience
entries, deleting the middle one, and confirming the preview shows the
correct remaining two in the right order.
```
Do that exact test yourself once it says it's done.

---

## PHASE 4 — Firebase Auth + Firestore

### 4.1 Add your Firebase config safely
Ask Antigravity to set this up following Rules.md's secret-handling pattern:
```
Create a gitignored config file for the Firebase config values (not
hardcoded into any component), plus a matching example file with
placeholder values that gets committed. Use the config values I'll paste
in next.
```
Paste in the `firebaseConfig` object you saved from Phase 0.3.

### 4.2 Wire up Auth + Firestore
```
Begin Phase 3 from Phases.md: wire up Firebase email/password
authentication (signup and login), and connect Firestore so that on save,
the full resume state writes to that user's document, and on load, it's
fetched and used to populate the form. Test by filling in data, refreshing
the page, and confirming the data is still there.
```

### 4.3 Set Firestore security rules
In the Firebase console → Firestore → Rules tab, use:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
This is the row-level lock — each user can only touch their own document. Publish the rules.

**Phase 4 done when:** you can sign up, fill in data, refresh, and see it persist — and a second test account sees an empty form, not the first account's data.

---

## PHASE 5 — Gemini AI Polish (default provider)

### 5.1 Add the Gemini key safely
Same secret pattern as the Firebase key — gitignored config file, example file with a placeholder.

### 5.2 Wire the AI Polish button
```
Begin Phase 4 from Phases.md: wire the "Polish with AI" button using the
Gemini API. Isolate the model name into a single config constant. First,
wire just the Personal Info section and log the raw API response to the
console before touching the UI. Once that's confirmed working, extend it
to the remaining sections. Every polish prompt must explicitly instruct
the model to rephrase only — no invented job titles, numbers, dates, or
achievements not present in the original text.
```
Check the console output on the very first section before letting it extend to the rest — this is the isolation-first pattern.

**Phase 5 done when:** every section's Polish button rewrites that section's text, and none of the rewrites invent new facts (spot-check a few).

---

## PHASE 6 — PDF export
```
Begin Phase 5 from Phases.md: wire html2pdf.js to export the preview
panel as a downloadable PDF. Test with a realistically long, multi-entry
resume, not just a short test one, and confirm page breaks look correct.
```

---

## PHASE 7 — Puter as an alternate provider
No setup needed on your end beforehand — this is entirely wired inside the app.

```
Begin Phase 6 from Phases.md: add a provider toggle (Default / Puter) near
the AI Polish buttons, matching the small provider-indicator element from
Design.md. Load Puter's script tag. When "Puter" is selected and Polish is
clicked, first check if the user has completed puter.auth.signIn(); if
not, trigger that sign-in flow, then route the polish call through
puter.ai.chat() instead of Gemini. Confirm with a console check that no
Gemini API calls fire while Puter is selected.
```
Test it yourself: switch to Puter, sign in when prompted (a Puter account is free to create on the spot), click Polish, confirm it works and that your Gemini usage dashboard shows no new activity from that click.

---

## PHASE 8 — Security rule testing
```
Begin Phase 7 from Phases.md: attempt to read another user's resume
document directly (using a second test account's UID) and confirm
Firestore denies it.
```

---

## PHASE 9 — Full manual test pass
Do this yourself, not just Antigravity: as a brand-new user, sign up, fill in every section, use Polish under both providers, export a PDF, log out, log back in, confirm everything persisted. Note anything that feels off.

---

## PHASE 10 — Design recheck
```
Begin Phase 9 from Phases.md: recheck the app against Design.md's
anti-slop checklist and print-safety, now that real content (not dummy
text) is in the preview. Flag anything that needs adjusting.
```

---

## PHASE 11 — Deploy and push

### 11.1 Push to GitHub
```
git add .
git commit -m "Project 4: Resume Builder + AI Polish — initial complete build"
git remote add origin <your GitHub repo URL from Phase 0.5>
git push -u origin main
```
Before this: double check your `.gitignore` actually excludes both config files with real keys — open the repo on GitHub afterward and confirm neither key is visible in any file.

### 11.2 Deploy to Vercel
1. Go to vercel.com, sign in with GitHub.
2. **Add New → Project**, select your `resume-builder-ai` repo.
3. Vercel auto-detects Vite — accept the defaults.
4. Add your environment variables (Firebase config values, Gemini key) in Vercel's project settings under **Environment Variables**, matching whatever names your config file uses.
5. Click **Deploy**.

### 11.3 Final check
Open the live Vercel URL. Repeat the Phase 9 manual test pass on the live version, not just localhost — sign up fresh, fill in a resume, polish under both providers, export a PDF, refresh, confirm persistence.

**Project done when:** the live URL works end-to-end with no console errors, on a brand-new account.
