# ResumeBuilder + AI Polish

Build a clean, beautifully formatted resume in real time. Fill in your details on the left, watch your document update instantly on the right, and use **Polish with AI** to rephrase summaries and bullet points with high-impact professional wording that never hallucinates facts.

**Live Demo:** [https://resume-builder-ai-polish-4.vercel.app](https://resume-builder-ai-polish-4.vercel.app)  
**Author:** [Dushyant Singh Bhati](https://github.com/DushyantSingh7120) • [LinkedIn](https://www.linkedin.com/in/dushyant-singh-764235332)

---

## ✨ Features

- **Dynamic Multi-Screen Architecture:**
  - **Landing Page (`/`):** Clean product overview with live auth state awareness.
  - **Dedicated Auth (`/login` & `/signup`):** One-click **Google Sign-In**, email/password registration, and self-serve **Password Reset**.
  - **Email Verification (`/verify-email`):** Dedicated post-signup screen with spam/promotions guidance, resend link, and Puter bypass.
  - **Protected Builder (`/app`):** Zero-flash route wrapper ensuring authenticated access to your private workspace.
  - **Legal Pages (`/privacy` & `/terms`):** Transparent, plain-English data privacy and terms of service.
- **Dual AI Polish Engines:**
  - **Default (Google Gemini Flash):** Free built-in AI polishing with server-side per-user rate limiting (unlocked via email verification).
  - **Puter.js (BYO Account):** Client-side AI polish powered by your personal Puter.com account quota with zero verification requirement.
- **Real-Time Split-Screen Workspace:** Live typographic formatting with instant reactivity as you type.
- **One-Click PDF Export:** Client-side vector-accurate PDF generation formatted identically to the live on-screen preview.
- **Per-User Cloud Sync:** Secure persistence in Google Cloud Firestore (`users/{uid}`) protected by strict per-user security rules.
- **Responsive Layout:** Desktop split-pane view with mobile drawer preview.

---

## 🛠 Tech Stack

- **Frontend:** React 19, React Router v7 (`react-router-dom`), Vite, Tailwind CSS v4
- **AI Integrations:** Google Gemini API (via serverless proxy) + Puter.js SDK
- **Backend & Auth:** Firebase Authentication (Email/Password & Google OAuth) + Cloud Firestore
- **Utilities & UI:** `html2pdf.js` (PDF export), `sonner` (rich toasts), `vaul` (drawers)
- **Hosting & CI/CD:** Vercel

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/DushyantSingh7120/Resume-Builder-AI-Polish-4-.git
cd Resume-Builder-AI-Polish-4-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the template file:
```bash
cp .env.example .env
```

Populate your `.env` file with your credentials:
```env
# Server-side Gemini API (Used by /api/polish serverless proxy)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash

# Client-side Firebase Configuration (Vite environment variables)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Start the Dev Server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔒 Security & Privacy

- **No Data Selling:** Your resume data is strictly your own and is never sold, tracked, or used for advertising.
- **Firestore Isolation:** Firestore security rules ensure that users can only read and write their own document matching `request.auth.uid`.
- **API Key Protection:** Server-side Gemini API keys are never exposed to the client; all Default AI Polish calls are verified and proxied through `/api/polish`.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
