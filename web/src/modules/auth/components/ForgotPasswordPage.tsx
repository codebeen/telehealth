'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  const validate = (value: string) => {
    if (!value.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return 'Please enter a valid email address.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setStatus('loading');
    // Simulate network delay
    setTimeout(() => setStatus('sent'), 1800);
  };

  if (status === 'sent') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-brand-text">Check your inbox</h2>
            <p className="mt-2 text-xs font-semibold text-slate-400 max-w-xs mx-auto leading-relaxed">
              We sent a password reset link to{' '}
              <span className="text-slate-600 font-bold">{email}</span>. It may take a minute to arrive.
            </p>
          </div>

          <div className="w-full pt-2 space-y-3">
            <button
              type="button"
              onClick={() => { setStatus('idle'); setEmail(''); }}
              className="flex w-full h-11 items-center justify-center rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] transition-all duration-150"
            >
              Try a different email
            </button>
            <Link
              href="/login"
              className="flex w-full h-11 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-dark hover:scale-[1.02] transition-all duration-150"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-text">Forgot password?</h2>
        <p className="mt-2 text-xs font-semibold text-slate-400 leading-relaxed">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          id="forgot-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          icon={Mail}
          error={emailError}
          required
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-dark hover:scale-[1.02] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending reset link…
              </>
            ) : (
              'Send reset link'
            )}
          </button>
        </div>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
