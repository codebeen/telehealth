import React from 'react';
import Link from 'next/link';
import { Stethoscope, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="grid h-screen grid-cols-1 lg:grid-cols-[40%_60%] bg-brand-bg font-sans overflow-hidden">
          {/* Left side: branding/benefits (hidden on mobile) */}
          <div className="relative hidden items-center justify-center bg-primary lg:flex lg:flex-col h-full overflow-hidden">
              {/* Decorative Grid Patterns */}
              <div className="absolute inset-0 bg-[radial-gradient(#56CCF2_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

              <div className="relative z-10 w-full max-w-lg px-8 text-white space-y-8">
                  <Link href="/" className="inline-flex items-center gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-lg shadow-black/10">
                          <Stethoscope className="h-6 w-6" />
                      </div>
                      <span className="text-2xl font-bold tracking-tight">
                          KY<span className="text-secondary">UR</span>
                      </span>
                  </Link>

                  <div className="space-y-4">
                      <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                          Connecting You to Premium Care, Anytime.
                      </h1>
                      <p className="text-base text-blue-100">
                          Join thousands of patients and doctors consulting
                          securely, tracking health indicators, and saving
                          valuable clinic waiting time.
                      </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-blue-400/30">
                      <div className="flex items-center gap-3.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20 text-secondary">
                              <ShieldCheck className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-medium">
                              Secure patient profiles, medical history, and
                              consultation records
                          </span>
                      </div>
                      <div className="flex items-center gap-3.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20 text-secondary">
                              <Clock className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-medium">
                              Book appointments, manage schedules, and join
                              virtual consultations
                          </span>
                      </div>
                      <div className="flex items-center gap-3.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20 text-secondary">
                              <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-medium">
                              Doctor-created consultation notes, advice, and
                              medication summaries
                          </span>
                      </div>
                  </div>
              </div>

              {/* Footer branding */}
              <div className="absolute bottom-6 left-8 z-10 text-xs text-blue-200">
                  © {new Date().getFullYear()} KYUR.
              </div>
          </div>

          {/* Right side: form containers */}
          <div className="flex flex-col px-4 py-12 sm:px-6 lg:px-16 xl:px-20 bg-white shadow-2xl h-full overflow-y-auto">
              <div className="mx-auto w-full max-w-3xl my-auto">
                  {/* Mobile Brand Display */}
                  <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                          <Stethoscope className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-lg font-bold text-brand-text">
                          KY<span className="text-primary">UR</span>
                      </span>
                  </div>

                  {/* Form Content */}
                  <div className="mt-4">{children}</div>
              </div>
          </div>
      </div>
  );
}
