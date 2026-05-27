'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, Calendar, FileText, Activity, ShieldCheck, 
  Search, Sparkles, Plus, ChevronRight, Stethoscope 
} from 'lucide-react';

export default function PatientDashboard() {
  // Mock data for Patient dashboard
  const vitals = [
    { name: 'Heart Rate', value: '72 bpm', status: 'Normal', icon: Heart, color: 'text-rose-500 bg-rose-50' },
    { name: 'Blood Pressure', value: '120/80', status: 'Optimal', icon: Activity, color: 'text-primary bg-primary-light' },
    { name: 'Active Energy', value: '420 kcal', status: 'Goal: 500', icon: Sparkles, color: 'text-amber-500 bg-amber-50' },
    { name: 'Sleep Score', value: '82%', status: 'Good Sleep', icon: ShieldCheck, color: 'text-accent bg-accent-light' }
  ];

  const upcomingConsultations = [
    { id: 1, doctor: 'Dr. Evelyn Adams', specialty: 'Cardiology', date: 'Tomorrow, May 28th', time: '10:00 AM', avatar: 'EA', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. Sarah Connor', specialty: 'General Practice', date: 'June 3rd, 2026', time: '02:30 PM', avatar: 'SC', status: 'Pending Approval' }
  ];

  const prescriptions = [
    { id: 1, medication: 'Lisinopril 10mg', doctor: 'Dr. Evelyn Adams', date: 'May 10, 2026', dosage: '1 tablet daily', status: 'Active' },
    { id: 2, medication: 'Metformin 500mg', doctor: 'Dr. Sarah Connor', date: 'April 22, 2026', dosage: '2 tablets daily with meals', status: 'Refill Needed' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome & Quick Search Bar */}
      <div className="rounded-3xl bg-linear-to-r from-primary to-secondary p-6 md:p-8 text-white shadow-lg shadow-primary/15 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hello, Arthur!</h1>
            <p className="text-xs md:text-sm text-blue-50">
              Get instant medical advice or check your schedule. We hope you're feeling great today.
            </p>
          </div>

          {/* Integrated search doctor bar */}
          <div className="relative max-w-lg">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search doctors by name, specialty, or condition..."
              className="h-12 w-full rounded-2xl bg-white pl-11 pr-4 text-xs font-medium text-slate-800 outline-hidden border border-transparent shadow-md placeholder-slate-400 focus:ring-2 focus:ring-white/20 transition-all duration-200"
            />
            <Link 
              href="/patient/doctor-discovery"
              className="absolute right-1.5 top-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-accent-dark transition-colors"
            >
              Search
            </Link>
          </div>
        </div>
      </div>

      {/* Vitals Summary Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {vitals.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.name}</span>
                  <span className="text-lg font-black text-brand-text leading-tight mt-0.5 block">{item.value}</span>
                </div>
              </div>
              <div className="mt-3 border-t border-slate-50 pt-2 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span>Status:</span>
                <span className={item.status === 'Optimal' || item.status === 'Normal' || item.status === 'Good Sleep' ? 'text-accent font-bold' : 'text-amber-500 font-bold'}>
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashboard Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Consultations & Prescriptions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Consultations */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-brand-text">Scheduled Appointments</h2>
                <p className="text-[11px] text-slate-400">Your upcoming consultations</p>
              </div>
              <Link 
                href="/patient/appointment" 
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Book Appointment <Plus className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingConsultations.length > 0 ? (
                upcomingConsultations.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-50 bg-slate-50/20 p-4 hover:border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary font-bold text-sm">
                        {appointment.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-text text-sm">{appointment.doctor}</h4>
                        <span className="text-[10px] text-primary bg-primary-light px-1.5 py-0.5 rounded font-bold">
                          {appointment.specialty}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{appointment.date} · {appointment.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-accent-light text-accent' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {appointment.status}
                      </span>
                      
                      <Link 
                        href="/patient/consultation-session"
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs shadow-primary/10 hover:bg-primary-dark transition-colors"
                      >
                        Join Call
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-3">
                  <p className="text-xs text-slate-400">You don't have any scheduled appointments.</p>
                  <Link href="/patient/doctor-discovery" className="inline-block text-xs font-bold text-primary hover:underline">
                    Browse active practitioners now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Active Prescriptions */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-brand-text">Active Prescriptions</h2>
                <p className="text-[11px] text-slate-400">e-Prescriptions linked to local pharmacies</p>
              </div>
              <Link href="/patient/medical-records" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                All Records <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {prescriptions.map((script) => (
                <div key={script.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm">{script.medication}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Prescribed by <span className="font-bold text-slate-500">{script.doctor}</span> · {script.date}
                      </p>
                      <span className="text-[10px] text-slate-500 italic block mt-1">Dosage: {script.dosage}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      script.status === 'Active' ? 'bg-accent-light text-accent' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {script.status}
                    </span>
                    <button className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: AI Recommendation & Quick Tools */}
        <div className="space-y-8">
          
          {/* AI Advisor Panel */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-accent-light flex items-center justify-center text-accent">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-brand-text">AI Wellness Advisor</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Based on your Heart Rate (72 bpm) and sleep tracking, you are fully rested. Try a light 20-minute cardio session today. 
            </p>
            
            <div className="border-t border-slate-50 pt-3.5 mt-3.5 space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Doctor</span>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold">EA</div>
                <div>
                  <span className="block text-xs font-bold text-brand-text">Dr. Evelyn Adams</span>
                  <span className="text-[10px] text-slate-400">Cardiology · Available tomorrow</span>
                </div>
              </div>
              <Link 
                href="/patient/appointment" 
                className="mt-3 block w-full text-center rounded-xl bg-accent py-2 text-xs font-bold text-white hover:bg-accent-dark transition-colors"
              >
                Schedule Checkup
              </Link>
            </div>
          </div>

          {/* Quick Help Widget */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-text">Need Help?</h3>
            <p className="text-xs text-slate-400">Our medical helpers are online 24/7 to resolve booking queries.</p>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Stethoscope className="h-4.5 w-4.5" text-primary /> Live Chat Support
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
