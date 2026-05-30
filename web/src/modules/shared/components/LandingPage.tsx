import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Shield, Video, Calendar, Sparkles, 
  Users, Star, Award 
} from 'lucide-react';
import PublicLayout from '@/components/layouts/PublicLayout';

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-[linear-gradient(180deg,#ffffff_0%,#F5F9FF_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(#56CCF2_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left side text content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Next-Generation Telehealth Platform
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text leading-tight sm:leading-none">
                Your Health, Connected <br className="hidden sm:inline" />
                <span className="text-primary bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Instantly</span>
              </h1>
              
              <p className="max-w-xl text-base sm:text-lg text-slate-500 leading-relaxed mx-auto lg:mx-0">
                Consult with certified doctors via secure video sessions, manage prescriptions, track vitals, and take control of your health from anywhere.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/patient/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-102 hover:shadow-xl transition-all duration-200"
                >
                  Enter Patient Portal <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/doctor/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                >
                  Doctor Workspace
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/50 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="block text-2xl font-bold text-brand-text">99.8%</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Satisfaction Rate</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-brand-text">15k+</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Active Doctors</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-brand-text">500k+</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Consultations</span>
                </div>
              </div>
            </div>

            {/* Right side interactive card mockup */}
            <div className="relative mx-auto max-w-md lg:max-w-none w-full flex justify-center lg:justify-end">
              <div className="relative w-full aspect-square max-w-[450px] rounded-3xl bg-linear-to-br from-primary/10 to-secondary/30 p-8 shadow-inner flex items-center justify-center">
                
                {/* Main Doctor Card */}
                <div className="absolute z-10 w-4/5 bg-white rounded-2xl p-5 shadow-xl border border-slate-50 animate-in fade-in-50 slide-in-from-bottom-6 duration-700">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-primary-light flex items-center justify-center text-primary text-xl font-bold">
                      DR
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm">Dr. Evelyn Adams</h4>
                      <span className="text-[10px] text-accent bg-accent-light px-2 py-0.5 rounded font-bold">Online Now</span>
                      <p className="text-[11px] text-slate-400 mt-1">Cardiologist · 12 yrs exp</p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-50 pt-3 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Consultation Fee</span>
                    <span className="font-bold text-brand-text">$45.00</span>
                  </div>
                  <Link 
                    href="/patient/dashboard" 
                    className="mt-4 block w-full text-center rounded-xl bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary-dark transition-colors"
                  >
                    Start Video Consultation
                  </Link>
                </div>

                {/* Sub Vitals Indicator (Accent Box) */}
                <div className="absolute top-8 left-0 z-20 bg-white rounded-xl p-3 shadow-lg border border-slate-100 flex items-center gap-2.5 animate-bounce [animation-duration:3s]">
                  <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Health Score</span>
                    <span className="text-xs font-extrabold text-brand-text">98% Excellent</span>
                  </div>
                </div>

                {/* Patient Queue Box */}
                <div className="absolute bottom-8 right-0 z-20 bg-white rounded-xl p-3.5 shadow-lg border border-slate-100 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold">A</div>
                    <div className="h-6 w-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[9px] font-bold">B</div>
                    <div className="h-6 w-6 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[9px] font-bold">C</div>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Wait Time</span>
                    <span className="text-xs font-bold text-primary">~ 5 Mins</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section id="services" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Features & Benefits</h2>
            <h3 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
              A Complete Medical Suite In Your Pocket
            </h3>
            <p className="text-sm text-slate-500">
              Discover premium solutions that make healthcare scheduling, consulting, and recording seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-lg hover:border-primary/20 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-text mb-2">HD Video Consultation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect instantly with certified doctors. Safe, encrypted one-on-one virtual visits with file sharing and audio chat capability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-lg hover:border-accent/20 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-accent-light flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-text mb-2">Smart Scheduling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book appointments that fit your schedule. Real-time availability sync, automatic notifications, and easy rescheduling features.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-lg hover:border-secondary/20 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-secondary-light flex items-center justify-center text-[#0284c7] mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-brand-text mb-2">Encrypted Records</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Store prescriptions, history, and medical records securely. Fully HIPAA-compliant cloud storage accessible anywhere, anytime.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Steps Callout */}
      <section id="how-it-works" className="py-20 bg-brand-bg/50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">How It Works</h2>
              <h3 className="text-3xl font-bold tracking-tight text-brand-text">
                Three Simple Steps to Professional Care
              </h3>
              <p className="text-sm text-slate-500">
                Getting medical advice shouldn't be difficult. KYURA streamlines the process to just a few clicks.
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-brand-text text-sm">Select Your Practitioner</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Filter by experience, ratings, fees, or language.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-brand-text text-sm">Attend Virtual Session</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Use our integrated HD browser-based clinic. No downloads required.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-brand-text text-sm">Get Digital Prescription</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Receive immediate diagnostic notes and pharmacy-compatible scripts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Panel */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-6">
              <div className="flex gap-1 text-amber-400">
                <Star className="fill-amber-400 h-4.5 w-4.5" />
                <Star className="fill-amber-400 h-4.5 w-4.5" />
                <Star className="fill-amber-400 h-4.5 w-4.5" />
                <Star className="fill-amber-400 h-4.5 w-4.5" />
                <Star className="fill-amber-400 h-4.5 w-4.5" />
              </div>
              <blockquote className="text-sm font-semibold text-brand-text leading-relaxed">
                "KYURA completely changed how I manage my diabetes. I can send blood sugar charts to Dr. Adams and jump on a 5-minute video call to adjust my dosage. I saved hours of driving and waiting at clinics!"
              </blockquote>
              <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold">
                  MC
                </div>
                <div>
                  <span className="block text-xs font-bold text-brand-text">Maria Calis</span>
                  <span className="text-[10px] text-slate-400">Patient since Jan 2025</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Call To Action */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#56CCF2_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-10" />
        <div className="mx-auto max-w-5xl px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to Experience Premium Virtual Care?
          </h2>
          <p className="max-w-xl text-blue-100 text-sm mx-auto leading-relaxed">
            Create your account today and gain immediate access to online clinics, medical record storage, and certified practitioners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/patient/dashboard"
              className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-lg shadow-black/10 hover:bg-slate-50 hover:scale-102 transition-all"
            >
              Sign Up As Patient
            </Link>
            <Link
              href="/doctor/dashboard"
              className="rounded-xl border border-blue-400 bg-primary-dark px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-900 hover:border-blue-900 transition-all"
            >
              Join As Provider
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
