import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer({ className = '' }) {
  return (
    <footer className={`border-t border-[#E2E8F0] bg-white py-5 px-4 text-xs text-[#64748B] shrink-0 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Copyright & Legal Links */}
        <div className="flex items-center flex-wrap justify-center md:justify-start gap-x-3 gap-y-1 text-[11px] text-[#94A3B8]">
          <span>© 2026 ResumeBuilder + AI Polish. Zero paywalls, privacy first.</span>
          <span className="text-[#CBD5E1] hidden sm:inline">•</span>
          <Link
            to="/privacy"
            className="text-[#64748B] hover:text-[#0F766E] hover:underline transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-[#CBD5E1]">•</span>
          <Link
            to="/terms"
            className="text-[#64748B] hover:text-[#0F766E] hover:underline transition-colors"
          >
            Terms of Service
          </Link>
        </div>

        {/* Creator & Social Links */}
        <div className="flex items-center flex-wrap justify-center md:justify-end gap-x-3 gap-y-1 text-xs">
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
