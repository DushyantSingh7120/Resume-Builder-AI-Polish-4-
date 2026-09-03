import React from 'react'
import { Link } from 'react-router-dom'
import { FileTextIcon, SparklesIcon, GitHubIcon, LinkedInIcon } from '../components/Icons'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-3 sm:px-4 md:px-8 h-16 shrink-0 flex items-center justify-between z-20 w-full max-w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 hover:opacity-90 transition-opacity min-w-0 shrink">
            <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shadow-xs shrink-0">
              <FileTextIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2 truncate">
              <span className="font-sans font-bold text-base sm:text-lg text-[#0F172A] tracking-tight">ResumeBuilder</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                <SparklesIcon className="w-3 h-3" />
                AI Polish
              </span>
            </div>
          </Link>

          {/* Discoverable GitHub and LinkedIn icon buttons beside logo */}
          <div className="flex items-center gap-0.5 sm:gap-1 pl-1.5 sm:pl-2.5 border-l border-[#E2E8F0] shrink-0">
            <a
              href="https://github.com/DushyantSingh7120/Resume-Builder-AI-Polish-4-"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Repository"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              aria-label="GitHub Repository"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/dushyant-singh-764235332"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A66C2] hover:bg-[#EFF6FF] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Back to home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          {/* Title Header */}
          <div className="border-b border-[#E2E8F0] pb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
              Legal & Privacy
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Last updated: August 2026 • Plain language, zero marketing fluff
            </p>
          </div>

          {/* Section 1: What We Collect */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">1</span>
              Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              We only collect information that you explicitly type into the application. There is no background tracking, passive scraping, or silent collection of personal data. Specifically, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#475569]">
              <li><strong>Account Information:</strong> Your email address and authentication credentials (managed via Firebase Authentication).</li>
              <li><strong>Resume Content:</strong> Contact details (full name, email, phone number, location, portfolio/LinkedIn links), professional summary, work experiences, education history, and skills list.</li>
            </ul>
          </section>

          {/* Section 2: Storage & Security */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">2</span>
              Where Your Data Is Stored & How It Is Protected
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Your resume data is stored in Google Cloud Firestore under a private document tied strictly to your individual user ID (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">users/&#123;uid&#125;</code>).
            </p>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Firestore security rules enforce that only your authenticated user session can read or write to your resume document. No other user can view or query your saved documents.
            </p>
          </section>

          {/* Section 3: Third-Party AI Services */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">3</span>
              Third-Party Services & AI Processing
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              When you use the <strong>Polish with AI</strong> feature, the specific text of the section you are polishing is sent to the selected AI provider:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-1.5">
                <h3 className="font-semibold text-xs text-[#0F172A]">Default (Google Gemini Flash)</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  The excerpt is sent securely through our serverless backend to the Google Gemini API to generate rewritten bullet points. It is subject to Google's standard API data policies.
                </p>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-1.5">
                <h3 className="font-semibold text-xs text-[#0F172A]">Puter.js (BYO Account)</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  The excerpt is routed client-side directly through your personal Puter.com account session, governed by Puter's own terms and privacy policy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: What We Do NOT Do */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">4</span>
              What We Do NOT Do
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#475569]">
              <li>We <strong>do not sell</strong>, rent, or trade your personal data or resume content to third parties.</li>
              <li>We <strong>do not run advertisements</strong> or behavioral tracking scripts.</li>
              <li>We only use standard privacy-respecting Vercel Analytics for aggregate page views (no personally identifiable information).</li>
            </ul>
          </section>

          {/* Section 5: Data Retention & User Control */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">5</span>
              User Control & Data Deletion
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Your resume data persists in your cloud account until you overwrite it or request account deletion. If you would like your account and all associated Firestore records permanently purged from our database, please contact us at <a href="mailto:atulsingh7120@gmail.com" className="text-[#0F766E] font-medium underline">atulsingh7120@gmail.com</a>.
            </p>
          </section>

          {/* Section 6: Contact */}
          <section className="space-y-2 border-t border-[#E2E8F0] pt-6">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
              Contact
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              For any questions regarding your data or this policy, reach out directly to{' '}
              <a href="mailto:atulsingh7120@gmail.com" className="text-[#0F766E] font-semibold underline">
                atulsingh7120@gmail.com
              </a>.
            </p>
          </section>

          {/* Honest Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-xs text-[#64748B] italic">
              This is a personal/student project, not a substitute for professional legal advice.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
