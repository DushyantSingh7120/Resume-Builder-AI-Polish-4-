import React from 'react'
import { Link } from 'react-router-dom'
import { GitHubIcon, LinkedInIcon } from './Icons'

export default function Footer({ className = '' }) {
  return (
    <footer className={`border-t border-[#E2E8F0] bg-white py-3 sm:py-3.5 px-3 sm:px-4 text-xs text-[#64748B] shrink-0 w-full max-w-full overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-center md:text-left w-full">
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

        {/* Creator & Social Links as Icons */}
        <div className="flex items-center flex-wrap justify-center md:justify-end gap-x-3 gap-y-1 text-xs">
          <span>
            Built by{' '}
            <span className="font-semibold text-[#0F172A]">Dushyant Singh Bhati</span>
          </span>
          <span className="text-[#CBD5E1] hidden sm:inline">•</span>
          <div className="inline-flex items-center gap-2">
            <a
              href="https://github.com/DushyantSingh7120/Resume-Builder-AI-Polish-4-"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Repository & Source"
              className="text-[#64748B] hover:text-[#0F172A] p-1 rounded hover:bg-slate-100 transition-colors inline-flex items-center"
              aria-label="GitHub Repository"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/dushyant-singh-764235332"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="text-[#64748B] hover:text-[#0A66C2] p-1 rounded hover:bg-blue-50 transition-colors inline-flex items-center"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
