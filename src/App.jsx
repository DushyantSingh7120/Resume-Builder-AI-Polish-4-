import React, { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, sendEmailVerification } from 'firebase/auth'
import { toast, Toaster } from 'sonner'
import { auth } from './config/firebase'
import {
  loadResumeFromFirestore,
  saveResumeToFirestore,
  testCrossUserRead,
  DEFAULT_EMPTY_RESUME,
  SAMPLE_RESUME
} from './services/resumeService'
import { exportResumeToPDF } from './services/pdfExportService'
import { clearPuterSession } from './services/puterService'
import Header from './components/Header'
import FormEditor from './components/FormEditor'
import ResumePreview from './components/ResumePreview'
import ResumeSkeleton from './components/ResumeSkeleton'
import AuthModal from './components/AuthModal'
import NotFound from './components/NotFound'
import { CloseIcon, MailIcon } from './components/Icons'

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : '/'))
  const [currentUser, setCurrentUser] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [resumeData, setResumeData] = useState(DEFAULT_EMPTY_RESUME)
  const [mobileView, setMobileView] = useState('editor') // 'editor' | 'preview'
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState(null)
  const [isEmailBannerDismissed, setIsEmailBannerDismissed] = useState(false)
  const [isSendingVerification, setIsSendingVerification] = useState(false)

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsDataLoading(true)
      setCurrentUser(user)

      if (user) {
        // User logged in: load their real Firestore document
        try {
          const savedData = await loadResumeFromFirestore(user.uid)
          if (savedData) {
            setResumeData(savedData)
            setLastSavedTime(new Date())
            toast.success('Loaded your saved resume from cloud!')
          } else {
            // New account: empty template
            setResumeData(DEFAULT_EMPTY_RESUME)
            toast.info('New account created. Fill in your details and click Save!')
          }
        } catch (error) {
          console.error('Error loading resume:', error)
          toast.error('Could not load resume data from cloud.')
          setResumeData(DEFAULT_EMPTY_RESUME)
        }
      } else {
        // Logged out visitor: show standard sample template
        setResumeData(SAMPLE_RESUME)
        setLastSavedTime(null)
      }
      setIsDataLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Automatic Auth State Refresh when user verifies email in another tab
  useEffect(() => {
    if (!currentUser || currentUser.emailVerified) return

    let isChecking = false
    const checkVerification = async () => {
      if (isChecking || !auth.currentUser) return
      isChecking = true
      try {
        await auth.currentUser.reload()
        if (auth.currentUser.emailVerified) {
          const fresh = auth.currentUser
          const userClone = Object.assign(Object.create(Object.getPrototypeOf(fresh)), fresh)
          userClone.getIdToken = (...args) => fresh.getIdToken(...args)
          userClone.reload = (...args) => fresh.reload(...args)
          setCurrentUser(userClone)
          toast.success('Email verified! Free Default AI Polish is now unlocked.')
        }
      } catch (err) {
        console.warn('[Auth Reload]:', err)
      } finally {
        isChecking = false
      }
    }

    const handleFocus = () => checkVerification()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkVerification()
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    const interval = setInterval(checkVerification, 4000)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
      clearInterval(interval)
    }
  }, [currentUser])

  // Expose security testing helper on window for Phase 7
  useEffect(() => {
    window.testCrossUserRead = testCrossUserRead
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
      clearPuterSession()
      setResumeData(SAMPLE_RESUME)
      setIsEmailBannerDismissed(false)
      toast.success('Signed out successfully.')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out.')
    }
  }

  // Resend email verification handler
  const handleResendVerification = async () => {
    if (!currentUser) return
    setIsSendingVerification(true)
    try {
      await sendEmailVerification(currentUser)
      toast.success(`Verification email sent to ${currentUser.email}!`)
    } catch (err) {
      console.error('Error sending verification email:', err)
      if (err.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait a moment before trying again.')
      } else {
        toast.error('Could not send verification email. Please try again later.')
      }
    } finally {
      setIsSendingVerification(false)
    }
  }

  // 404 Handler for unmatched paths
  if (currentPath !== '/' && currentPath !== '' && currentPath !== '/index.html') {
    return (
      <NotFound
        onReturnHome={() => {
          window.history.pushState({}, '', '/')
          setCurrentPath('/')
        }}
      />
    )
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

      {/* Non-blocking Email Verification Banner */}
      {currentUser && !currentUser.emailVerified && !isEmailBannerDismissed && (
        <div className="bg-amber-50/90 border-b border-amber-200 px-4 md:px-8 py-2 text-xs text-amber-900 flex items-center justify-between gap-3 shrink-0 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 flex-wrap">
            <MailIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              Please verify your email address (<strong>{currentUser.email}</strong>). Check your spam or promotions folder if you don't see the email.
            </span>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isSendingVerification}
              className="underline font-semibold text-amber-900 hover:text-amber-950 disabled:opacity-50 ml-1 cursor-pointer"
            >
              {isSendingVerification ? 'Sending link...' : 'Resend verification email'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsEmailBannerDismissed(true)}
            className="text-amber-600 hover:text-amber-950 p-1 rounded transition-colors cursor-pointer shrink-0"
            title="Dismiss banner"
            aria-label="Dismiss verification banner"
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {isDataLoading ? (
          <ResumeSkeleton />
        ) : (
          <>
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
              <FormEditor
                resumeData={resumeData}
                setResumeData={setResumeData}
                currentUser={currentUser}
              />
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
          </>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}
