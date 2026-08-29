import React from 'react'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { clearPuterSession } from '../services/puterService'
import { toast } from 'sonner'
import { FileTextIcon, SparklesIcon, DownloadIcon, EyeIcon, UserIcon } from '../components/Icons'
import Footer from '../components/Footer'

export default function LandingPage({ currentUser }) {

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      clearPuterSession()
      toast.success('Signed out successfully.')
    } catch (err) {
      console.error('Sign out error:', err)
      toast.error('Failed to sign out.')
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-[#E2E8F0] px-3 sm:px-4 md:px-8 h-16 shrink-0 flex items-center justify-between z-20 w-full max-w-full">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity min-w-0 shrink">
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

        {/* Top-Right Nav Area */}
        {currentUser ? (
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-[#0F172A] truncate max-w-[150px]">
                {currentUser.email}
              </span>
              <span className="text-[10px] text-[#64748B]">Signed in</span>
            </div>
            <Link
              to="/app"
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-colors shadow-xs shrink-0"
            >
              <span className="hidden sm:inline">Resume Workspace →</span>
              <span className="sm:hidden">Workspace →</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs font-medium text-[#64748B] hover:text-red-600 px-2 py-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/login"
              className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors shadow-xs shrink-0"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12 md:py-20 text-center max-w-5xl w-full mx-auto space-y-8 box-border">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F766E] bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-100 shadow-2xs">
          <SparklesIcon className="w-3.5 h-3.5 text-[#0F766E]" />
          Instant Live Formatting + AI Polish
        </div>

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0F172A] leading-tight">
            Build and polish your resume in real time with AI.
          </h1>
          <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Fill in your details, watch a formatted resume take shape side-by-side, and rewrite sections with on-demand AI polish that never invents facts.
          </p>
        </div>

        {/* Dynamic CTA buttons based on auth state */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
          {currentUser ? (
            <>
              <Link
                to="/app"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold px-7 py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-sm cursor-pointer"
              >
                Continue to Your Resume
                <FileTextIcon className="w-4 h-4" />
              </Link>
              <span className="text-xs text-[#64748B]">
                Signed in as <strong className="text-[#0F172A]">{currentUser.email}</strong>
              </span>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold px-7 py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-sm cursor-pointer"
              >
                Get Started Free
                <SparklesIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white border border-[#CBD5E1] hover:border-[#0F766E] text-[#0F172A] font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-2xs cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-[#64748B]" />
                Sign in to Existing Resume
              </Link>
            </>
          )}
        </div>

        {/* 3 Core Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left w-full">
          {/* Feature 1 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F766E]">
              <EyeIcon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#0F172A]">Live Real-Time Preview</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Every edit updates instantly in a print-ready resume layout next to your form — no refresh or compilation delay.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#0F172A]">AI Polish Engine</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Elevate bullet points and summaries with Gemini or bring your own Puter account for unlimited free allowance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F766E]">
              <DownloadIcon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#0F172A]">One-Click PDF Export</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Download clean, beautifully structured PDFs formatted precisely like the live preview, ready for job applications.
            </p>
          </div>
        </div>
      </main>

      {/* Real Footer with Credit & Links */}
      <Footer />
    </div>
  )
}
