'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, Menu, X, Heart, Shield, Activity, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Find Doctor', href: '/patient/doctor-discovery' },
    { name: 'Services', href: '#services' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'For Doctors', href: '/doctor/dashboard' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-sans">
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-text">
              KY<span className="text-primary">UR</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-600 hover:text-primary transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-dark hover:scale-102 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-6 py-6 md:hidden animate-in slide-in-from-top duration-200">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-semibold text-slate-700 hover:text-primary py-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-base font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-dark transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* 3. Footer */}
      <footer className="w-full border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                  <Stethoscope className="h-4.5 w-4.5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-brand-text">
                  KY<span className="text-primary">UR</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with leading medical professionals instantly. Convenient, safe, and secure consultations from the comfort of your home.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/patient/doctor-discovery" className="text-xs font-medium text-slate-400 hover:text-primary">Find a Doctor</Link></li>
                <li><Link href="#services" className="text-xs font-medium text-slate-400 hover:text-primary">Medical Services</Link></li>
                <li><Link href="/doctor/dashboard" className="text-xs font-medium text-slate-400 hover:text-primary">For Professionals</Link></li>
                <li><Link href="#pricing" className="text-xs font-medium text-slate-400 hover:text-primary">Pricing Plans</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Help & Trust</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-xs font-medium text-slate-400 hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="text-xs font-medium text-slate-400 hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="text-xs font-medium text-slate-400 hover:text-primary">Support Center</Link></li>
                <li><Link href="#" className="text-xs font-medium text-slate-400 hover:text-primary">Contact FAQ</Link></li>
              </ul>
            </div>

            {/* Contacts & Badges */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">24/7 Hotline</h3>
              <div className="flex items-center gap-3 rounded-xl bg-primary-light/50 border border-primary-light p-3">
                <PhoneCall className="h-4.5 w-4.5 text-primary" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Emergency Support</span>
                  <span className="text-sm font-bold text-primary">1-800-VITAL-APP</span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent-light px-2 py-1 rounded">
                  <Shield className="h-3 w-3" /> HIPAA Compliant
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary-light px-2 py-1 rounded">
                  <Activity className="h-3 w-3" /> 256-bit Encrypted
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} KYURA. All rights reserved.
            </span>
            <div className="flex gap-4">
              <span className="text-[11px] font-medium text-slate-400">Made with ❤️ for better health.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
