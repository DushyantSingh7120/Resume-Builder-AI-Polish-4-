import React from 'react'
import { Navigate } from 'react-router-dom'
import ResumeSkeleton from './ResumeSkeleton'

export default function ProtectedRoute({ currentUser, isAuthLoading, children }) {
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        {/* Loading header */}
        <header className="bg-white border-b border-[#E2E8F0] px-4 md:px-8 h-16 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 animate-pulse"></div>
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </header>
        <div className="flex-1">
          <ResumeSkeleton />
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}
