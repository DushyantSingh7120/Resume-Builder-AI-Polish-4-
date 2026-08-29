import React from 'react'

export default function Footer({ className = '' }) {
  return (
    <footer className={`border-t border-[#E2E8F0] bg-white py-5 px-4 text-xs text-[#64748B] shrink-0 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Copyright & Tagline */}
        <p className="text-[11px] text-[#94A3B8]">
          © 2026 ResumeBuilder + AI Polish. Zero paywalls, privacy first.
        </p>

        {/* Creator & Links */}
        <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          <span>
            Built by{' '}
            <span className="font-semibold text-[#0F172A]">Dushyant Singh Bhati</span>
          </span>
          <span className="text-[#CBD5E1] hidden sm:inline">•</span>
          <a
            href="https://github.com/DushyantSingh7120"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F766E] hover:text-[#115E59] hover:underline font-medium transition-colors"
          >
            GitHub
          </a>
          <span className="text-[#CBD5E1]">•</span>
          <a
            href="https://github.com/DushyantSingh7120/Resume-Builder-AI-Polish-4-"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F766E] hover:text-[#115E59] hover:underline font-medium transition-colors"
          >
            View Source
          </a>
          <span className="text-[#CBD5E1]">•</span>
          <a
            href="https://www.linkedin.com/in/dushyant-singh-764235332"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F766E] hover:text-[#115E59] hover:underline font-medium transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
