'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Video } from 'lucide-react';

export default function DoctorConsultationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Premium Light Navbar */}
      <header className="bg-white border-b border-slate-100/70 h-16 px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
            <Video className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">Consultation Room</h1>
            <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider block mt-1">Practitioner Live Feed</span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/doctor/dashboard"
            className="p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-all cursor-pointer shadow-2xs"
            title="Go to Dashboard"
          >
            <Home className="h-4.5 w-4.5" />
          </Link>
        </div>
      </header>

      {/* Main viewport */}
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
}
