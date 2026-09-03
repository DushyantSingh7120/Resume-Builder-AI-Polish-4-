import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { toast } from 'sonner'
import { FileTextIcon, SparklesIcon, UserIcon, GitHubIcon, LinkedInIcon } from '../components/Icons'
import Footer from '../components/Footer'

export default function AuthPage({ isSignUp = false, currentUser = null, isAuthLoading = false }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  // Redirect if user is already authenticated
  React.useEffect(() => {
    if (!isAuthLoading && currentUser) {
      navigate('/app', { replace: true })
    }
  }, [currentUser, isAuthLoading, navigate])

  // Google OAuth Popup Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMsg('')
    setGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      toast.success(`Welcome, ${result.user.displayName || result.user.email}!`)
      navigate('/app')
    } catch (err) {
      console.error('Google sign-in error:', err)
      if (err.code === 'auth/popup-closed-by-user') {
        return
      }
      let message = 'Google sign-in failed. Please try again.'
      if (err.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.'
      }
      setErrorMsg(message)
      toast.error(message)
    } finally {
      setGoogleLoading(false)
    }
  }

  // Password reset submit handler
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email) {
      setErrorMsg('Please enter your email address to reset your password.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset link sent! Check your inbox.')
      setIsForgotPassword(false)
    } catch (err) {
      console.error('Password reset error:', err)
      let message = 'Failed to send password reset email. Please try again.'
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email address.'
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address format.'
      }
      setErrorMsg(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Email/Password Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      if (isSignUp) {
        // Register new user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // Send email verification link
        await sendEmailVerification(userCredential.user)
        toast.success('Account created! A verification email has been sent to your inbox.')
        navigate('/app')
      } else {
        // Existing user sign in
        await signInWithEmailAndPassword(auth, email, password)
        toast.success('Welcome back!')
        navigate('/app')
      }
    } catch (err) {
      console.error('Auth error:', err)
      let message

      switch (err.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email. Please check your email or sign up.'
          break
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          message = 'Incorrect email or password. Please try again.'
          break
        case 'auth/email-already-in-use':
          message = 'An account already exists with this email. Please log in instead.'
          break
        case 'auth/weak-password':
          message = 'Password is too weak. Please use at least 6 characters.'
          break
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.'
          break
        case 'auth/too-many-requests':
          message = 'Too many unsuccessful attempts. Please wait a few moments and try again.'
          break
        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection.'
          break
        default:
          message = err.message || 'Authentication failed. Please try again.'
      }

      setErrorMsg(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen md:h-screen w-full max-w-full overflow-x-hidden md:overflow-hidden bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between font-sans">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-[#E2E8F0] px-3 sm:px-4 md:px-8 h-16 shrink-0 flex items-center justify-between w-full max-w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 hover:opacity-90 transition-opacity min-w-0 shrink">
            <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shadow-xs shrink-0">
              <FileTextIcon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2 truncate">
              <span className="font-sans font-bold text-base sm:text-lg text-[#0F172A] tracking-tight">ResumeBuilder</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                <SparklesIcon className="w-3 h-3" />
                AI Polish
              </span>
            </div>
          </Link>

          {/* Discoverable GitHub and LinkedIn icon buttons beside logo */}
          <div className="flex items-center gap-0.5 sm:gap-1 pl-1.5 sm:pl-2.5 border-l border-[#E2E8F0] shrink-0">
            <a
              href="https://github.com/DushyantSingh7120/Resume-Builder-AI-Polish-4-"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Repository"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              aria-label="GitHub Repository"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/dushyant-singh-764235332"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A66C2] hover:bg-[#EFF6FF] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <Link to="/" className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0">
          ← Back to home
        </Link>
      </header>

      {/* Auth Form Card */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 w-full max-w-full box-border">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xs border border-[#E2E8F0] p-5 sm:p-7">
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 mb-2">
              <UserIcon className="w-3.5 h-3.5" />
              {isForgotPassword ? 'Password Recovery' : isSignUp ? 'Create New Account' : 'Account Access'}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              {isForgotPassword
                ? 'Reset your password'
                : isSignUp
                ? 'Get started with ResumeBuilder'
                : 'Welcome back'}
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              {isForgotPassword
                ? 'Enter your email address to receive a secure password reset link.'
                : isSignUp
                ? 'Sign up to create, polish, and cloud-sync your professional resume.'
                : 'Sign in to access your saved resume and AI Polish tools.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg animate-in fade-in duration-150">
              {errorMsg}
            </div>
          )}

          {/* Google Sign In Option */}
          {!isForgotPassword && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold py-2.5 px-4 border border-[#CBD5E1] rounded-lg transition-colors shadow-2xs disabled:opacity-60 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {googleLoading ? 'Connecting...' : 'Continue with Google'}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E2E8F0]"></div>
                <span className="text-[11px] font-medium text-[#94A3B8] uppercase">Or with email</span>
                <div className="flex-1 h-px bg-[#E2E8F0]"></div>
              </div>
            </div>
          )}

          {/* Form */}
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#475569]">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100 rounded-lg px-3.5 py-2 text-sm text-[#0F172A] outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                {loading ? 'Sending link...' : 'Send Password Reset Link'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false)
                    setErrorMsg('')
                  }}
                  className="text-xs text-[#0F766E] hover:underline font-medium cursor-pointer"
                >
                  ← Back to sign in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#475569]">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100 rounded-lg px-3.5 py-2 text-sm text-[#0F172A] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-[#475569]">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true)
                        setErrorMsg('')
                      }}
                      className="text-xs text-[#0F766E] hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100 rounded-lg px-3.5 py-2 text-sm text-[#0F172A] outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-xs mt-2 cursor-pointer"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Switch Route Link */}
          {!isForgotPassword && (
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
              {isSignUp ? (
                <p className="text-xs text-[#64748B]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#0F766E] hover:underline font-semibold">
                    Log in
                  </Link>
                </p>
              ) : (
                <p className="text-xs text-[#64748B]">
                  Don't have an account yet?{' '}
                  <Link to="/signup" className="text-[#0F766E] hover:underline font-semibold">
                    Sign up
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Real Footer with Credit & Links */}
      <Footer />
    </div>
  )
}
