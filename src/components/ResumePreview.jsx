import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  DownloadIcon
} from './Icons'

// Helper function to format YYYY-MM to readable Month Year
function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const [year, month] = dateStr.split('-')
    if (!year || !month) return dateStr
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function ResumePreview({ resumeData, onExportPDF, isExporting }) {
  const { personalInfo = {}, experience = [], education = [], skills = [], aiProvider = 'default' } = resumeData || {}

  // Filter out ghost / empty entries
  const validExperience = (experience || []).filter(
    (exp) => exp.role?.trim() || exp.company?.trim() || exp.description?.trim()
  )

  const validEducation = (education || []).filter(
    (edu) => edu.degree?.trim() || edu.institution?.trim()
  )

  const validSkills = (skills || []).filter((s) => s && s.trim())

  const hasContactInfo =
    personalInfo.email?.trim() ||
    personalInfo.phone?.trim() ||
    personalInfo.location?.trim()

  const hasAnyContent =
    personalInfo.name?.trim() ||
    hasContactInfo ||
    personalInfo.summary?.trim() ||
    validExperience.length > 0 ||
    validEducation.length > 0 ||
    validSkills.length > 0

  return (
    <div className="w-full flex flex-col items-center py-6 px-4 md:px-6">
      {/* Contextual Utility Bar above Paper Document */}
      <div className="w-full max-w-[760px] flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
          <span className="text-xs font-semibold text-[#0F172A]">
            Polishing with: <span className="text-[#2563EB] font-bold">{aiProvider === 'default' ? 'Default (Gemini)' : 'Puter.js'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportPDF}
            disabled={isExporting || !hasAnyContent}
            className="inline-flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <DownloadIcon className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Generating PDF...' : 'Download PDF'}
          </button>

          <span className="hidden sm:inline-block px-2 py-1 bg-[#F1F5F9] rounded text-[10px] font-bold uppercase tracking-wider text-[#475569]">
            8.5 × 11
          </span>
        </div>
      </div>

      {/* The Printable Resume Paper Document */}
      <article
        id="resume-document-preview"
        className="w-full max-w-[760px] bg-white border border-[#E2E8F0] rounded-xs p-6 sm:p-10 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.08),0_2px_6px_-1px_rgba(15,23,42,0.04)] transition-all flex flex-col text-[#0F172A]"
        style={{ fontFamily: 'var(--font-serif, "Source Serif 4", Georgia, serif)' }}
      >
        {/* Document Header */}
        {(personalInfo.name?.trim() || hasContactInfo) ? (
          <header className="pdf-avoid-break border-b-2 border-[#0F172A] pb-5 mb-6 text-center">
            {personalInfo.name?.trim() && (
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mb-2 font-serif">
                {personalInfo.name.trim()}
              </h1>
            )}

            {hasContactInfo && (
              <div
                className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1 text-xs text-[#475569]"
                style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
              >
                {personalInfo.email?.trim() && (
                  <span className="inline-flex items-center gap-1.5">
                    <MailIcon className="w-3.5 h-3.5 text-[#0F766E]" />
                    {personalInfo.email.trim()}
                  </span>
                )}
                {personalInfo.phone?.trim() && (
                  <span className="inline-flex items-center gap-1.5">
                    <PhoneIcon className="w-3.5 h-3.5 text-[#0F766E]" />
                    {personalInfo.phone.trim()}
                  </span>
                )}
                {personalInfo.location?.trim() && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#0F766E]" />
                    {personalInfo.location.trim()}
                  </span>
                )}
              </div>
            )}
          </header>
        ) : null}

        {/* Professional Summary */}
        {personalInfo.summary?.trim() && (
          <section className="resume-section pdf-avoid-break mb-6">
            <h2
              className="text-[12px] font-bold uppercase tracking-widest text-[#0F172A] border-b border-[#E2E8F0] pb-1 mb-2.5"
              style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
            >
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-[#1E293B] text-justify font-normal">
              {personalInfo.summary.trim()}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {validExperience.length > 0 && (
          <section className="resume-section mb-6">
            <h2
              className="text-[12px] font-bold uppercase tracking-widest text-[#0F172A] border-b border-[#E2E8F0] pb-1 mb-3.5 pdf-avoid-break"
              style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
            >
              Work Experience
            </h2>

            <div className="space-y-4">
              {validExperience.map((exp, index) => {
                const startDateFormatted = formatDate(exp.startDate)
                const endDateFormatted = exp.current ? 'Present' : formatDate(exp.endDate)
                const dateString = [startDateFormatted, endDateFormatted].filter(Boolean).join(' – ')

                // Split descriptions into bullet lines
                const bullets = exp.description
                  ? exp.description
                      .split('\n')
                      .map((line) => line.replace(/^[-•*]\s*/, '').trim())
                      .filter(Boolean)
                  : []

                return (
                  <div key={exp.id || index} className="resume-entry pdf-avoid-break space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      {exp.role?.trim() && (
                        <h3 className="text-sm sm:text-[15px] font-bold text-[#0F172A]">
                          {exp.role.trim()}
                        </h3>
                      )}
                      {dateString && (
                        <span
                          className="text-xs text-[#64748B] font-medium sm:text-right"
                          style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
                        >
                          {dateString}
                        </span>
                      )}
                    </div>

                    {exp.company?.trim() && (
                      <div
                        className="text-xs font-semibold text-[#0F766E]"
                        style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
                      >
                        {exp.company.trim()}
                      </div>
                    )}

                    {bullets.length > 0 ? (
                      <ul className="list-disc ml-4 text-xs sm:text-[13px] leading-relaxed text-[#334155] space-y-1 mt-1">
                        {bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    ) : (
                      exp.description?.trim() && (
                        <p className="text-xs sm:text-[13px] leading-relaxed text-[#334155] mt-1">
                          {exp.description.trim()}
                        </p>
                      )
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {validEducation.length > 0 && (
          <section className="resume-section mb-6">
            <h2
              className="text-[12px] font-bold uppercase tracking-widest text-[#0F172A] border-b border-[#E2E8F0] pb-1 mb-3 pdf-avoid-break"
              style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
            >
              Education
            </h2>

            <div className="space-y-3">
              {validEducation.map((edu, index) => {
                const startDateFormatted = formatDate(edu.startDate)
                const endDateFormatted = formatDate(edu.endDate)
                const dateString = [startDateFormatted, endDateFormatted].filter(Boolean).join(' – ')

                return (
                  <div key={edu.id || index} className="resume-entry pdf-avoid-break flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      {edu.degree?.trim() && (
                        <h3 className="text-sm font-bold text-[#0F172A]">
                          {edu.degree.trim()}
                        </h3>
                      )}
                      {edu.institution?.trim() && (
                        <div
                          className="text-xs text-[#64748B]"
                          style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
                        >
                          {edu.institution.trim()}
                        </div>
                      )}
                    </div>

                    {dateString && (
                      <span
                        className="text-xs text-[#64748B] font-medium sm:text-right"
                        style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
                      >
                        {dateString}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Skills */}
        {validSkills.length > 0 && (
          <section className="resume-section pdf-avoid-break pt-1">
            <h2
              className="text-[12px] font-bold uppercase tracking-widest text-[#0F172A] border-b border-[#E2E8F0] pb-1 mb-2.5"
              style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
            >
              Skills & Expertise
            </h2>

            <div
              className="flex flex-wrap gap-1.5 text-xs text-[#1E293B]"
              style={{ fontFamily: 'var(--font-sans, "Inter", sans-serif)' }}
            >
              {validSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 rounded text-xs font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Empty placeholder canvas notice if nothing has been typed yet */}
        {!hasAnyContent && (
          <div className="py-24 text-center text-[#94A3B8] font-sans">
            <p className="text-sm font-medium">Your resume preview will take shape live as you fill in the form.</p>
          </div>
        )}
      </article>
    </div>
  )
}
