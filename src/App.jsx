import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { Toaster, toast } from 'sonner'
import { auth } from './config/firebase'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import BuilderPage from './pages/BuilderPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  // Central Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setIsAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Auto-reload auth state when user verifies email in another tab
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
          toast.success('Email verified! Free Gemini AI Polish is unlocked.')
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

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage currentUser={currentUser} />} />

        {/* Dedicated Auth Screens */}
        <Route
          path="/login"
          element={
            !isAuthLoading && currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage isSignUp={false} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthLoading && currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage isSignUp={true} />
            )
          }
        />

        {/* Dedicated Email Verification Screen */}
        <Route
          path="/verify-email"
          element={
            <VerifyEmailPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        />

        {/* Protected Resume Builder Route */}
        <Route
          path="/app"
          element={
            <ProtectedRoute currentUser={currentUser} isAuthLoading={isAuthLoading}>
              <BuilderPage currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
