# ResumeBuilder + AI Polish

Build a clean, formatted resume by filling in standard form fields and watching your document take shape in real time. Whenever you're stuck on wording, click **Polish with AI** to instantly elevate your summaries and experience bullet points without inventing facts or breaking flow.

**Live Demo:** [https://resume-builder-ai-polish.vercel.app](https://resume-builder-ai-polish.vercel.app)

---

## ✨ Features

- **Live Split-Screen Preview:** Real-time updates as you type — no manual generation or waiting.
- **Dual AI Polish Engines:**
  - **Default (Gemini 3.6 Flash):** Free built-in AI polishing with server-side per-user rate limiting.
  - **Puter.js (BYO Account):** Run unlimited polish calls using your personal Puter account quota.
- **Repeatable Work & Education Entries:** Add, reorder, or delete experience entries with full reactivity.
- **One-Click PDF Export:** Download a print-perfect PDF formatted identically to the on-screen preview.
- **Per-User Cloud Sync:** Firebase Authentication with email verification and private Firestore resume storage.
- **Responsive Layout:** Desktop two-column layout with mobile bottom-sheet preview drawer.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4
- **AI Integration:** Google Gemini API (via serverless proxy) + Puter.js SDK
- **Backend / BaaS:** Firebase Auth & Cloud Firestore
- **Export & Feedback:** `html2pdf.js`, `sonner` (toasts), `vaul` (drawers)
- **Deployment:** Vercel

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/resume-builder-ai-polish.git
cd resume-builder-ai-polish
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example environment file:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```
*(Also ensure Firebase client credentials in `src/config/firebaseConfig.js` match your Firebase project).*

### 4. Start local development server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
