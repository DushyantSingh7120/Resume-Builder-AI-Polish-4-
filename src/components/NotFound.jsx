import React from 'react'
import { FileTextIcon, SparklesIcon } from './Icons'
import Footer from './Footer'

export default function NotFound({ onReturnHome }) {
  const handleGoHome = () => {
    if (onReturnHome) {
      onReturnHome()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-[#E2E8F0] px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shadow-xs">
            <FileTextIcon className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-bold text-lg text-[#0F172A] tracking-tight">ResumeBuilder</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-blue-100">
              <SparklesIcon className="w-3 h-3" />
              AI Polish
            </span>
          </div>
        </div>
      </header>

      {/* 404 Hero Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F766E]">
            <FileTextIcon className="w-8 h-8 opacity-80" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
              404 Error
            </span>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed">
              The page you're looking for doesn't exist or may have moved. Head back to the resume builder to continue crafting your document.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 w-full bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Return to Resume Builder
          </button>
        </div>
      </main>

      {/* Global Footer with Credit & Links */}
      <Footer />
    </div>
  )
}
