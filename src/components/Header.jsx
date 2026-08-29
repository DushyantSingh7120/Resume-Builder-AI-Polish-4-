import React from 'react'
import { Link } from 'react-router-dom'
import { SparklesIcon, DownloadIcon, EyeIcon, FileTextIcon, UserIcon } from './Icons'

export default function Header({
  mobileView,
  setMobileView,
  currentUser,
  onOpenAuth,
  onSaveResume,
  onSignOut,
  isSaving,
  onExportPDF,
  isExporting,
  isExportDisabled = false
}) {
  return (
    <header className="bg-white border-b border-[#E2E8F0] px-3 sm:px-4 md:px-8 h-16 shrink-0 flex items-center justify-between z-20 w-full max-w-full overflow-hidden">
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

      <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
        {/* Mobile View Toggle */}
        <div className="flex md:hidden bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
              mobileView === 'editor'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${
              mobileView === 'preview'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <EyeIcon className="w-3 h-3" />
            Preview
          </button>
        </div>

        {/* Save Resume Button */}
        {currentUser && (
          <button
            type="button"
            onClick={onSaveResume}
            disabled={isSaving}
            className="inline-flex items-center gap-1 sm:gap-1.5 bg-white border border-[#CBD5E1] hover:border-[#0F766E] text-[#0F172A] hover:text-[#0F766E] text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors shadow-2xs disabled:opacity-50 cursor-pointer shrink-0"
          >
            <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-spin' : 'bg-[#0F766E]'}`}></span>
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        )}

        {/* Download PDF Action */}
        <button
          type="button"
          onClick={onExportPDF}
          disabled={isExporting || isExportDisabled}
          title={isExportDisabled ? 'Add some details before downloading.' : 'Download print-ready PDF'}
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <DownloadIcon className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Exporting PDF...' : 'Download PDF'}
        </button>

        {/* Auth controls */}
        {currentUser ? (
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-[#E2E8F0] shrink-0">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[11px] font-semibold text-[#0F172A] truncate max-w-[120px]">
                {currentUser.email?.split('@')[0]}
              </span>
              <span className="text-[9px] text-[#64748B]">Signed in</span>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="text-xs font-medium text-[#64748B] hover:text-red-600 px-1.5 sm:px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-1.5 bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-blue-200 transition-colors shrink-0"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </button>
        )}
      </div>
    </header>
  )
}
