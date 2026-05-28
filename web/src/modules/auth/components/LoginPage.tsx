'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-text">Sign in</h2>
        <p className="mt-2 text-xs font-semibold text-slate-400">
          Or{' '}
          <Link href="/register" className="font-bold text-primary hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-600 tracking-wider">
            Email Address
          </label>
          <div className="mt-1.5">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue="arthur.p@kyur.com"
              className="block w-full h-11 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-brand-text outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-bold text-slate-600 tracking-wider">
              Password
            </label>
            <div className="text-xs">
              <a href="#" className="font-bold text-primary hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-1.5 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              defaultValue="password123"
              className="block w-full h-11 rounded-xl border border-slate-200 pl-3.5 pr-10 text-xs font-medium text-brand-text outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-650 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded-sm border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-500">
              Remember me
            </label>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/patient/dashboard"
            className="flex w-full h-11 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-dark hover:scale-102 transition-all duration-150"
          >
            Sign In as Patient
          </Link>
          <Link
            href="/doctor/dashboard"
            className="flex w-full h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:scale-102 transition-all duration-150"
          >
            Sign In as Doctor
          </Link>
        </div>
      </form>

      {/* Social Provider Sign In */}
      <div className="mt-6 border-t border-slate-100 pt-6">
        <span className="block text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Or Continue With
        </span>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="flex h-10 items-center justify-center rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Google
          </button>
          <button className="flex h-10 items-center justify-center rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Apple
          </button>
        </div>
      </div>
    </div>
  );
}
