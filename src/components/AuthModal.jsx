import React, { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { toast } from 'sonner'
import { CloseIcon, SparklesIcon } from './Icons'

export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        toast.success('Account created successfully!')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success('Signed in successfully!')
      }
      onClose()
    } catch (err) {
      console.error('Auth error:', err)
      let message = 'Authentication failed. Please check your credentials.'
      if (err.code === 'auth/invalid-email') message = 'Invalid email address.'
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.'
      }
      if (err.code === 'auth/email-already-in-use') message = 'An account with this email already exists.'
      if (err.code === 'auth/weak-password') message = 'Password must be at least 6 characters.'
      setErrorMsg(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-6 sm:p-8 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 mb-2">
            <SparklesIcon className="w-3.5 h-3.5" />
            Resume Cloud Sync
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            {isSignUp
              ? 'Sign up to save and access your resume anywhere.'
              : 'Sign in to access your saved resume.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-xs font-medium text-[#475569]">Password</label>
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
            disabled={loading}
            className="w-full bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-xs mt-2"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setErrorMsg('')
            }}
            className="text-xs text-[#0F766E] hover:underline font-medium"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account yet? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}
