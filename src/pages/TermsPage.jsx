import React from 'react'
import { Link } from 'react-router-dom'
import { FileTextIcon, SparklesIcon, GitHubIcon, LinkedInIcon } from '../components/Icons'
import Footer from '../components/Footer'

export default function TermsPage() {
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
              Terms & Conditions
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Last updated: August 2026 • Plain language agreement
            </p>
          </div>

          {/* Section 1: Project Scope */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">1</span>
              Project Nature & Purpose
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              ResumeBuilder + AI Polish is a free, non-commercial personal and student project developed for educational and portfolio demonstration purposes. It is not an incorporated commercial business, enterprise software, or funded entity.
            </p>
          </section>

          {/* Section 2: No Warranty & "As-Is" Service */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">2</span>
              No Warranty & Disclaimer of AI Accuracy
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              This application is provided completely <strong>"as-is"</strong> and <strong>"as-available"</strong> without warranties of any kind, whether express or implied.
            </p>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              The AI Polish feature uses large language models (Google Gemini and Puter.js) to rephrase and refine your phrasing. While it is engineered not to hallucinate facts, AI-generated suggestions are not guaranteed to be error-free, complete, or suitable for any specific hiring process. <strong>You are solely responsible for reviewing and editing all resume content before submitting it to real job applications.</strong>
            </p>
          </section>

          {/* Section 3: User Responsibility */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">3</span>
              Account & Content Responsibility
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              You are responsible for safeguarding your login credentials and for the factual truthfulness and legality of all text you enter into the application. You agree not to use this service to store malicious payloads, spam, or unlawful material.
            </p>
          </section>

          {/* Section 4: Service Modifications & Availability */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold border border-teal-100">4</span>
              Right to Modify or Discontinue
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Because this is an evolving portfolio project without a Service Level Agreement (SLA), we reserve the right to modify, pause, rate-limit, or discontinue any feature (including AI Polish quotas and PDF exports) at any time without liability or prior notice.
            </p>
          </section>

          {/* Section 5: Inquiries */}
          <section className="space-y-2 border-t border-[#E2E8F0] pt-6">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
              Questions & Feedback
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              If you have any questions regarding these terms, please contact{' '}
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
