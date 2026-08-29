import React, { useState, useEffect, useRef } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { toast, Toaster } from 'sonner'
import { auth } from './config/firebase'
import {
  loadResumeFromFirestore,
  saveResumeToFirestore,
  DEFAULT_EMPTY_RESUME,
  SAMPLE_RESUME
} from './services/resumeService'
import { exportResumeToPDF } from './services/pdfExportService'
import Header from './components/Header'
import FormEditor from './components/FormEditor'
import ResumePreview from './components/ResumePreview'
import AuthModal from './components/AuthModal'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [resumeData, setResumeData] = useState(SAMPLE_RESUME)
  const [mobileView, setMobileView] = useState('editor') // 'editor' | 'preview'
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState(null)

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setAuthLoading(false)

      if (user) {
        // User logged in: attempt to load saved resume from Firestore
        try {
          const savedData = await loadResumeFromFirestore(user.uid)
          if (savedData) {
            setResumeData(savedData)
            setLastSavedTime(new Date())
            toast.success('Loaded your saved resume from cloud!')
          } else {
            // Brand new account: start with empty template
            setResumeData(DEFAULT_EMPTY_RESUME)
            toast.info('New account created. Fill in your details and click Save!')
          }
        } catch (error) {
          console.error('Error loading resume:', error)
          toast.error('Could not load resume data from cloud.')
        }
      } else {
        // Logged out
        setLastSavedTime(null)
      }
    })

    return () => unsubscribe()
  }, [])

  // Manual Save Resume handler
  const handleSaveResume = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true)
      toast.info('Please sign in or create an account to save your resume.')
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

  // PDF Export handler
  const handleExportPDF = async () => {
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

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setResumeData(SAMPLE_RESUME)
      toast.success('Signed out successfully.')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Toaster richColors position="top-right" />

      <Header
        mobileView={mobileView}
        setMobileView={setMobileView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSaveResume={handleSaveResume}
        onSignOut={handleSignOut}
        isSaving={isSaving}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Form Editor */}
        <div
          className={`flex-1 overflow-y-auto border-r border-[#E2E8F0] ${
            mobileView === 'preview' ? 'hidden md:block' : 'block'
          }`}
        >
          {/* Quick status banner for logged-in user */}
          {currentUser && (
            <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-2 flex items-center justify-between text-xs text-[#64748B]">
              <span>
                Account: <strong className="text-[#0F172A]">{currentUser.email}</strong>
              </span>
              <span>
                {lastSavedTime
                  ? `Last saved: ${lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Unsaved changes'}
              </span>
            </div>
          )}
          <FormEditor resumeData={resumeData} setResumeData={setResumeData} />
        </div>

        {/* Right Column: Live Resume Preview */}
        <div
          className={`flex-1 overflow-y-auto bg-[#F1F5F9]/60 ${
            mobileView === 'editor' ? 'hidden md:block' : 'block'
          }`}
        >
          <ResumePreview
            resumeData={resumeData}
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
          />
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}
