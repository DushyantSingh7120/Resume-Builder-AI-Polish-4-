import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { toast } from 'sonner'
import { auth } from '../config/firebase'
import {
  loadResumeFromFirestore,
  saveResumeToFirestore,
  DEFAULT_EMPTY_RESUME
} from '../services/resumeService'
import { exportResumeToPDF } from '../services/pdfExportService'
import { clearPuterSession } from '../services/puterService'
import Header from '../components/Header'
import FormEditor from '../components/FormEditor'
import ResumePreview from '../components/ResumePreview'
import ResumeSkeleton from '../components/ResumeSkeleton'
import Footer from '../components/Footer'
import { SparklesIcon, CloseIcon } from '../components/Icons'

export default function BuilderPage({ currentUser }) {
  const navigate = useNavigate()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [resumeData, setResumeData] = useState(DEFAULT_EMPTY_RESUME)
  const [mobileView, setMobileView] = useState('editor') // 'editor' | 'preview'
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState(null)
  const [showFirstRunHint, setShowFirstRunHint] = useState(false)

  // Load user resume on mount (Firestore + Local Draft Fallback)
  useEffect(() => {
    let isMounted = true
    const initUserData = async () => {
      if (!currentUser) return
      setIsDataLoading(true)
      try {
        const savedData = await loadResumeFromFirestore(currentUser.uid)
        const draftRaw = localStorage.getItem(`resume_draft_${currentUser.uid}`)
        let localDraft = null
        if (draftRaw) {
          try {
            localDraft = JSON.parse(draftRaw)
          } catch (e) {
            console.warn('[Draft Restore Notice]: Invalid local draft JSON', e)
          }
        }

        if (isMounted) {
          if (savedData) {
            setResumeData(savedData)
            setLastSavedTime(new Date())
          } else if (localDraft) {
            setResumeData(localDraft)
            toast.info('Restored your unsaved local draft.')
          } else {
            setResumeData(DEFAULT_EMPTY_RESUME)
          }

          // First run hint check from localStorage or resumeData
          const hasSeen = localStorage.getItem(`hasSeenIntro_${currentUser.uid}`)
          if (!hasSeen) {
            setShowFirstRunHint(true)
          }
        }
      } catch (err) {
        console.error('Error loading resume:', err)
        // Check if local draft is available during cloud error
        const draftRaw = localStorage.getItem(`resume_draft_${currentUser.uid}`)
        if (draftRaw) {
          try {
            setResumeData(JSON.parse(draftRaw))
            toast.info('Loaded your local draft (cloud connection unavailable).')
          } catch (draftErr) {
            console.warn('[Draft Fallback Error]:', draftErr)
            toast.error('Could not load resume data from cloud.')
          }
        } else {
          toast.error('Could not load resume data from cloud.')
        }
      } finally {
        if (isMounted) setIsDataLoading(false)
      }
    }

    initUserData()
    return () => {
      isMounted = false
    }
  }, [currentUser])

  // Continuous local draft backup to prevent accidental data loss
  useEffect(() => {
    if (!currentUser || isDataLoading) return
    const draftKey = `resume_draft_${currentUser.uid}`
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(resumeData))
      } catch (err) {
        console.warn('[Draft Backup]:', err)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [resumeData, currentUser, isDataLoading])

  // Dismiss First Run Hint
  const handleDismissHint = () => {
    setShowFirstRunHint(false)
    if (currentUser?.uid) {
      localStorage.setItem(`hasSeenIntro_${currentUser.uid}`, 'true')
    }
  }

  // Save Resume to Firestore
  const handleSaveResume = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    setIsSaving(true)
    try {
      await saveResumeToFirestore(currentUser.uid, resumeData)
      setLastSavedTime(new Date())
      toast.success('Resume saved successfully to cloud!')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Failed to save resume. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Check if resume contains real content
  const hasContactInfo =
    resumeData.personalInfo?.email?.trim() ||
    resumeData.personalInfo?.phone?.trim() ||
    resumeData.personalInfo?.location?.trim()

  const hasExperience = Array.isArray(resumeData.experience) && resumeData.experience.some(
    (exp) => exp.company?.trim() || exp.role?.trim() || exp.description?.trim()
  )

  const hasEducation = Array.isArray(resumeData.education) && resumeData.education.some(
    (edu) => edu.institution?.trim() || edu.degree?.trim()
  )

  const hasSkills = Array.isArray(resumeData.skills) && resumeData.skills.some((s) => s && s.trim())

  const hasAnyContent = Boolean(
    resumeData.personalInfo?.name?.trim() ||
    hasContactInfo ||
    resumeData.personalInfo?.summary?.trim() ||
    hasExperience ||
    hasEducation ||
    hasSkills
  )

  // Export PDF (html2pdf.js)
  const handleExportPDF = async () => {
    if (!hasAnyContent) {
      toast.error('Add some details before downloading.')
      return
    }

    setIsExporting(true)
    try {
      await exportResumeToPDF('resume-document-preview', resumeData.personalInfo?.name)
      toast.success('Resume downloaded as PDF!')
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error(error.message || 'Failed to generate PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Print or Save as Vector ATS-compliant PDF
  const handlePrintVectorPDF = () => {
    if (!hasAnyContent) {
      toast.error('Add some details before printing.')
      return
    }
    window.print()
  }

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      clearPuterSession()
      toast.success('Signed out successfully.')
      navigate('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out.')
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header
        mobileView={mobileView}
        setMobileView={setMobileView}
        currentUser={currentUser}
        onOpenAuth={() => navigate('/login')}
        onSaveResume={handleSaveResume}
        onSignOut={handleSignOut}
        isSaving={isSaving}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
        isExportDisabled={!hasAnyContent}
      />

      {/* Optional First-Run Feature Discovery Callout */}
      {showFirstRunHint && (
        <div className="bg-teal-50 border-b border-teal-200 px-4 md:px-8 py-2.5 text-xs text-[#0F766E] flex items-center justify-between gap-3 shrink-0 animate-in fade-in duration-200 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <SparklesIcon className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span className="break-words">
              <strong>Welcome to ResumeBuilder!</strong> Fill in your details on the left to see live formatting. Use <strong>Polish with AI</strong> on any section to enhance your phrasing.
            </span>
          </div>
          <button
            type="button"
            onClick={handleDismissHint}
            className="text-teal-700 hover:text-teal-950 p-1 rounded transition-colors cursor-pointer shrink-0 font-medium text-xs flex items-center gap-1"
            title="Dismiss hint"
          >
            <span>Got it</span>
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 flex overflow-hidden w-full max-w-full">
        {isDataLoading ? (
          <ResumeSkeleton />
        ) : (
          <>
            {/* Left Column: Form Editor */}
            <div
              className={`flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full min-w-0 border-r border-[#E2E8F0] ${
                mobileView === 'preview' ? 'hidden md:block' : 'block'
              }`}
            >
              {/* Quick status bar */}
              {currentUser && (
                <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-[#64748B] w-full max-w-full overflow-hidden">
                  <span className="truncate mr-2">
                    Account: <strong className="text-[#0F172A]">{currentUser.email}</strong>
                  </span>
                  <span className="shrink-0 text-[11px]">
                    {lastSavedTime
                      ? `Last saved: ${lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'Unsaved changes'}
                  </span>
                </div>
              )}
              <FormEditor
                resumeData={resumeData}
                setResumeData={setResumeData}
                currentUser={currentUser}
              />
            </div>

            {/* Right Column: Live Resume Preview */}
            <div
              className={`flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full min-w-0 bg-[#F1F5F9]/60 ${
                mobileView === 'editor' ? 'hidden md:block' : 'block'
              }`}
            >
              <ResumePreview
                resumeData={resumeData}
                onExportPDF={handleExportPDF}
                isExporting={isExporting}
                onPrintVectorPDF={handlePrintVectorPDF}
              />
            </div>
          </>
        )}
      </main>

      {/* Global Footer with Credit & Links */}
      <Footer />
    </div>
  )
}
