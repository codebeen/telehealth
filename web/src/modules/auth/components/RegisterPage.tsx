'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-text">Create your account</h2>
        <p className="mt-2 text-xs font-semibold text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Role Selector Card Buttons */}
      <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-50 border border-slate-100">
        <button
          onClick={() => setRole('patient')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            role === 'patient'
              ? 'bg-white text-primary shadow-xs'
              : 'text-slate-500 hover:text-brand-text'
          }`}
        >
          I am a Patient
        </button>
        <button
          onClick={() => setRole('doctor')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            role === 'doctor'
              ? 'bg-white text-primary shadow-xs'
              : 'text-slate-500 hover:text-brand-text'
          }`}
        >
          I am a Doctor
        </button>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
            Full Name
          </label>
          <div className="mt-1.5">
            <input
              id="name"
              name="name"
              type="text"
              required
              className="block w-full h-11 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-brand-text outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
              placeholder={role === 'doctor' ? 'Dr. John Doe' : 'Jane Smith'}
            />
          </div>
        </div>

        {role === 'doctor' && (
          <div>
            <label htmlFor="license" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Medical License Number
            </label>
            <div className="mt-1.5">
              <input
                id="license"
                name="license"
                type="text"
                required
                className="block w-full h-11 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-brand-text outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
                placeholder="LIC-123456789"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
            Email Address
          </label>
          <div className="mt-1.5">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full h-11 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-brand-text outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
            Password
          </label>
          <div className="mt-1.5">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full h-11 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-brand-text outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded-sm border-slate-300 text-primary focus:ring-primary"
          />
          <label htmlFor="terms" className="ml-2 block text-xs font-semibold text-slate-500">
            I agree to the{' '}
            <a href="#" className="font-bold text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-bold text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <div className="pt-2">
          <Link
            href={role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
            className="flex w-full h-11 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-dark hover:scale-102 transition-all duration-150"
          >
            Create {role === 'doctor' ? 'Doctor' : 'Patient'} Account
          </Link>
        </div>
      </form>
    </div>
  );
}
