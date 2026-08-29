import React from 'react'

export default function ResumeSkeleton() {
  return (
    <div className="flex-1 flex overflow-hidden animate-pulse">
      {/* Left Column Skeleton: Form Editor */}
      <div className="flex-1 overflow-y-auto border-r border-[#E2E8F0] p-6 space-y-6 max-w-2xl mx-auto">
        <div className="h-14 bg-slate-200/70 rounded-xl"></div>
        <div className="h-64 bg-slate-200/70 rounded-xl"></div>
        <div className="h-72 bg-slate-200/70 rounded-xl"></div>
      </div>

      {/* Right Column Skeleton: Preview Paper */}
      <div className="hidden md:flex flex-1 items-center justify-center p-6 bg-[#F1F5F9]/60">
        <div className="w-full max-w-[760px] h-[800px] bg-white border border-[#E2E8F0] rounded-xs p-10 space-y-6 shadow-xs">
          <div className="h-10 w-1/2 mx-auto bg-slate-200/80 rounded"></div>
          <div className="h-4 w-1/3 mx-auto bg-slate-100 rounded"></div>
          <div className="border-b border-slate-200 my-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-16 bg-slate-100 rounded"></div>
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
            <div className="h-20 bg-slate-100 rounded"></div>
            <div className="h-20 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
