'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';
import { login } from '@/modules/auth/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const { accessToken, user } = await login({ email, password });
        
        // Save to localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on role
        if (user.role === 'DOCTOR') {
          router.push('/doctor/dashboard');
        } else {
          router.push('/patient/dashboard');
        }
      } catch (err: any) {
        const apiMessage = err.response?.data?.message;
        const message = Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage;
        setErrors({ submit: message || err.message || 'Authentication failed. Please check your credentials.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-text">Sign in</h2>
        <p className="mt-2 text-xs font-semibold text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="p-3.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errors.submit}</span>
          </div>
        )}

        <TextField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email || errors.submit) setErrors((prev) => ({ ...prev, email: '', submit: '' }));
          }}
          icon={Mail}
          error={errors.email}
          required
        />

        <TextField
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password || errors.submit) setErrors((prev) => ({ ...prev, password: '', submit: '' }));
          }}
          icon={Lock}
          error={errors.password}
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded-sm border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-xs font-semibold text-slate-500">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full h-11 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-dark hover:scale-[1.02] transition-all duration-150 disabled:opacity-75 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
