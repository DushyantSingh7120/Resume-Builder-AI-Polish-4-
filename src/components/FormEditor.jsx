import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  SparklesIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchIcon,
  CloseIcon,
  PlusIcon,
  TrashIcon
} from './Icons'
import {
  polishSummary,
  polishExperienceDescription,
  polishSkills
} from '../services/aiPolishService'

export default function FormEditor({ resumeData, setResumeData }) {
  const [newSkill, setNewSkill] = useState('')
  const [polishingSection, setPolishingSection] = useState(null) // null | 'summary' | 'skills' | `exp-${id}` | 'experience-all'

  // Personal Info change handler
  const handlePersonalInfoChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  // Work Experience change handler
  const handleExperienceChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  // Add Work Experience entry
  const handleAddExperience = () => {
    const newEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newEntry]
    }))
  }

  // Remove Work Experience entry
  const handleRemoveExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id)
    }))
  }

  // Education change handler
  const handleEducationChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  // Add Education entry
  const handleAddEducation = () => {
    const newEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `edu-${Date.now()}`,
      institution: '',
      degree: '',
      startDate: '',
      endDate: ''
    }
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEntry]
    }))
  }

  // Remove Education entry
  const handleRemoveEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id)
    }))
  }

  // Skills handlers
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault()
      const trimmed = newSkill.trim()
      if (trimmed && !resumeData.skills.includes(trimmed)) {
        setResumeData((prev) => ({
          ...prev,
          skills: [...prev.skills, trimmed]
        }))
        setNewSkill('')
      }
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }))
  }

  // AI Polish: Summary
  const handlePolishSummary = async () => {
    if (!resumeData.personalInfo.summary?.trim()) {
      toast.error('Please enter a professional summary to polish.')
      return
    }

    setPolishingSection('summary')
    try {
      const polished = await polishSummary(resumeData.personalInfo.summary)
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          summary: polished
        }
      }))
      toast.success('Professional summary polished!')
    } catch (err) {
      console.error('Polish summary error:', err)
      toast.error(err.message || 'Failed to polish summary.')
    } finally {
      setPolishingSection(null)
    }
  }

  // AI Polish: Specific Experience Entry
  const handlePolishExperienceEntry = async (exp) => {
    if (!exp.description?.trim()) {
      toast.error('Please enter a description for this role before polishing.')
      return
    }

    const sectionKey = `exp-${exp.id}`
    setPolishingSection(sectionKey)
    try {
      const polished = await polishExperienceDescription(exp.description, exp.role, exp.company)
      handleExperienceChange(exp.id, 'description', polished)
      toast.success(`Polished experience at ${exp.company || 'position'}!`)
    } catch (err) {
      console.error('Polish experience error:', err)
      toast.error(err.message || 'Failed to polish experience.')
    } finally {
      setPolishingSection(null)
    }
  }

  // AI Polish: All Experience Entries
  const handlePolishAllExperience = async () => {
    const entriesWithDesc = resumeData.experience.filter((e) => e.description?.trim())
    if (entriesWithDesc.length === 0) {
      toast.error('Please enter job descriptions to polish.')
      return
    }

    setPolishingSection('experience-all')
    try {
      const updatedExperience = await Promise.all(
        resumeData.experience.map(async (exp) => {
          if (!exp.description?.trim()) return exp
          const polished = await polishExperienceDescription(exp.description, exp.role, exp.company)
          return { ...exp, description: polished }
        })
      )
      setResumeData((prev) => ({
        ...prev,
        experience: updatedExperience
      }))
      toast.success('All work experience entries polished!')
    } catch (err) {
      console.error('Polish all experience error:', err)
      toast.error(err.message || 'Failed to polish work experience.')
    } finally {
      setPolishingSection(null)
    }
  }

  // AI Polish: Skills
  const handlePolishSkills = async () => {
    if (!resumeData.skills || resumeData.skills.length === 0) {
      toast.error('Please add some skills to polish.')
      return
    }

    setPolishingSection('skills')
    try {
      const polished = await polishSkills(resumeData.skills)
      setResumeData((prev) => ({
        ...prev,
        skills: polished
      }))
      toast.success('Skills organized and standardized!')
    } catch (err) {
      console.error('Polish skills error:', err)
      toast.error(err.message || 'Failed to polish skills.')
    } finally {
      setPolishingSection(null)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 md:px-6 space-y-8">
      {/* Section 1: Personal Information */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2 text-[#0F172A]">
            <UserIcon className="w-5 h-5 text-[#0F766E]" />
            <h2 className="font-sans font-semibold text-base md:text-lg">Personal Information</h2>
          </div>
          <button
            type="button"
            onClick={handlePolishSummary}
            disabled={polishingSection === 'summary'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-blue-100 disabled:opacity-50 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <SparklesIcon className={`w-3.5 h-3.5 ${polishingSection === 'summary' ? 'animate-spin text-[#2563EB]' : ''}`} />
            {polishingSection === 'summary' ? 'Polishing...' : 'Polish Summary with AI'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#64748B]">Full Name</label>
            <input
              type="text"
              value={resumeData.personalInfo.name}
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#64748B]">Email Address</label>
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              placeholder="e.g. jane.doe@example.com"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#64748B]">Phone Number</label>
            <input
              type="tel"
              value={resumeData.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              placeholder="e.g. +1 (555) 123-4567"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#64748B]">Location</label>
            <input
              type="text"
              value={resumeData.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-[#64748B]">Professional Summary</label>
            <span className="text-[11px] text-[#94A3B8]">Click button above to polish</span>
          </div>
          <textarea
            rows={3}
            value={resumeData.personalInfo.summary}
            onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
            placeholder="Write a concise overview of your background and core strengths..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md p-3 text-sm text-[#0F172A] outline-none transition-all resize-y"
          />
        </div>
      </section>

      {/* Section 2: Work Experience */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2 text-[#0F172A]">
            <BriefcaseIcon className="w-5 h-5 text-[#0F766E]" />
            <h2 className="font-sans font-semibold text-base md:text-lg">Work Experience</h2>
          </div>
          <button
            type="button"
            onClick={handlePolishAllExperience}
            disabled={polishingSection === 'experience-all'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-blue-100 disabled:opacity-50 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <SparklesIcon className={`w-3.5 h-3.5 ${polishingSection === 'experience-all' ? 'animate-spin text-[#2563EB]' : ''}`} />
            {polishingSection === 'experience-all' ? 'Polishing All...' : 'Polish All with AI'}
          </button>
        </div>

        <div className="space-y-4">
          {resumeData.experience.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="border border-[#E2E8F0] bg-[#F8FAFC] rounded-lg p-4 space-y-3.5 transition-colors relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">Position #{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePolishExperienceEntry(exp)}
                    disabled={polishingSection === `exp-${exp.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:text-blue-800 bg-white border border-blue-200 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors"
                  >
                    <SparklesIcon className={`w-3 h-3 ${polishingSection === `exp-${exp.id}` ? 'animate-spin text-[#2563EB]' : ''}`} />
                    {polishingSection === `exp-${exp.id}` ? 'Polishing...' : 'Polish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="text-[#94A3B8] hover:text-red-600 p-1 rounded-md transition-colors"
                    title="Remove this position"
                    aria-label="Remove work experience entry"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#64748B]">Job Title / Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                    placeholder="e.g. Senior Product Designer"
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#64748B]">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                    placeholder="e.g. TechCorp Inc."
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#64748B]">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#64748B]">End Date</label>
                  <div className="space-y-1.5">
                    <input
                      type="month"
                      value={exp.endDate}
                      disabled={exp.current}
                      onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                      className={`w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all ${
                        exp.current ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
                      }`}
                    />
                    <label className="inline-flex items-center gap-1.5 text-xs text-[#64748B] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(exp.current)}
                        onChange={(e) => {
                          handleExperienceChange(exp.id, 'current', e.target.checked)
                          if (e.target.checked) handleExperienceChange(exp.id, 'endDate', '')
                        }}
                        className="rounded border-[#CBD5E1] text-[#0F766E] focus:ring-[#0F766E]"
                      />
                      Currently working here (Present)
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#64748B]">Description & Key Achievements</label>
                <textarea
                  rows={3}
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                  placeholder="- Bullet point 1&#10;- Bullet point 2"
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md p-3 text-sm text-[#0F172A] outline-none transition-all resize-y"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddExperience}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-dashed border-[#CBD5E1] hover:border-[#0F766E] bg-[#F8FAFC] hover:bg-teal-50/50 text-xs font-semibold text-[#0F766E] rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Work Experience
          </button>
        </div>
      </section>

      {/* Section 3: Education */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2 text-[#0F172A]">
            <AcademicCapIcon className="w-5 h-5 text-[#0F766E]" />
            <h2 className="font-sans font-semibold text-base md:text-lg">Education</h2>
          </div>
        </div>

        <div className="space-y-4">
          {resumeData.education.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="border border-[#E2E8F0] bg-[#F8FAFC] rounded-lg p-4 space-y-3.5 transition-colors relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">Education #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(edu.id)}
                  className="text-[#94A3B8] hover:text-red-600 p-1 rounded-md transition-colors"
                  title="Remove this education entry"
                  aria-label="Remove education entry"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#64748B]">Degree / Certification</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                    placeholder="e.g. BFA in Interaction Design"
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#64748B]">School / Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                    placeholder="e.g. California College of the Arts"
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#64748B]">Start Date</label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#64748B]">End Date / Graduation</label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md px-3 py-2 text-sm text-[#0F172A] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEducation}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-dashed border-[#CBD5E1] hover:border-[#0F766E] bg-[#F8FAFC] hover:bg-teal-50/50 text-xs font-semibold text-[#0F766E] rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Education
          </button>
        </div>
      </section>

      {/* Section 4: Skills */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2 text-[#0F172A]">
            <WrenchIcon className="w-5 h-5 text-[#0F766E]" />
            <h2 className="font-sans font-semibold text-base md:text-lg">Skills & Tools</h2>
          </div>
          <button
            type="button"
            onClick={handlePolishSkills}
            disabled={polishingSection === 'skills'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-blue-100 disabled:opacity-50 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <SparklesIcon className={`w-3.5 h-3.5 ${polishingSection === 'skills' ? 'animate-spin text-[#2563EB]' : ''}`} />
            {polishingSection === 'skills' ? 'Polishing...' : 'Polish Skills with AI'}
          </button>
        </div>

        <div className="space-y-3">
          {/* Skill Tag Chips */}
          <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg items-center">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium px-2.5 py-1 rounded-full shadow-2xs"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-[#94A3B8] hover:text-red-600 rounded-full p-0.5 transition-colors"
                  title={`Remove ${skill}`}
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Inline Input */}
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type a skill and press Enter..."
              className="flex-1 min-w-[140px] bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none px-2 py-0.5"
            />
          </div>
          <p className="text-[11px] text-[#64748B]">Tip: Press Enter or type a skill to add it to the resume.</p>
        </div>
      </section>
    </div>
  )
}
