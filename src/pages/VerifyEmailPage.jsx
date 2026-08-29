import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendEmailVerification, signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { toast } from 'sonner'
import { FileTextIcon, SparklesIcon, MailIcon } from '../components/Icons'
import Footer from '../components/Footer'

export default function VerifyEmailPage({ currentUser, setCurrentUser, isAuthLoading = false }) {
  const navigate = useNavigate()
  const [isSending, setIsSending] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Auth state management & redirection
  useEffect(() => {
    if (isAuthLoading) return
    if (!currentUser && !auth.currentUser) {
      navigate('/login', { replace: true })
    } else if (currentUser?.emailVerified) {
      navigate('/', { replace: true })
    }
  }, [currentUser, isAuthLoading, navigate])

  // Resend verification email
  const handleResend = async () => {
    if (!auth.currentUser) {
      toast.error('Session expired. Please sign in again.')
      navigate('/login')
      return
    }

    setIsSending(true)
    try {
      await sendEmailVerification(auth.currentUser)
      toast.success(`Verification email sent to ${auth.currentUser.email}!`)
    } catch (err) {
      console.error('Error sending verification email:', err)
      if (err.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait a moment before trying again.')
      } else {
        toast.error('Could not send verification email. Please try again.')
      }
    } finally {
      setIsSending(false)
    }
  }

  // Check verification status & redirect to "/"
  const handleCheckStatus = async () => {
    if (!auth.currentUser) {
      navigate('/login')
      return
    }

    setIsChecking(true)
    try {
      await auth.currentUser.reload()
      if (auth.currentUser.emailVerified) {
        if (setCurrentUser) setCurrentUser({ ...auth.currentUser })
        toast.success('Email verified successfully! Full AI Polish is unlocked.')
        navigate('/')
      } else {
        toast.info('Email is not verified yet. Please check your inbox and spam folder.')
      }
    } catch (err) {
      console.error('Status check error:', err)
      toast.error('Could not check status. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const userEmail = currentUser?.email || auth.currentUser?.email || 'your email'

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-4 md:px-8 h-16 shrink-0 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shadow-xs">
            <FileTextIcon className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-bold text-lg text-[#0F172A] tracking-tight">ResumeBuilder</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-blue-100">
              <SparklesIcon className="w-3 h-3" />
              AI Polish
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-xs font-semibold text-[#64748B] hover:text-red-600 transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xs border border-[#E2E8F0] p-6 sm:p-8 text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <MailIcon className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              Email Verification Required
            </span>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Verify your email address
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-md mx-auto">
              We've sent a verification link to <strong className="text-[#0F172A]">{userEmail}</strong>. Please click the link to verify your account and unlock free Gemini AI Polish.
            </p>
          </div>

          {/* Spam / Promotions Reminder Alert */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs rounded-xl text-left leading-relaxed">
            <p className="font-semibold mb-0.5">⚠️ Can't find the email?</p>
            <p>
              Automated verification emails are frequently filtered into the <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> tab. Please check those folders or click resend below.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isChecking ? 'Checking status...' : "I've verified — check again"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isSending}
              className="w-full bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold py-2.5 px-4 border border-[#CBD5E1] rounded-lg transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {isSending ? 'Sending new link...' : 'Resend Verification Email'}
            </button>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                Continue with Puter for now (no verification required) →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Real Footer with Credit & Links */}
      <Footer />
    </div>
  )
}
