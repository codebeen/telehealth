'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, Calendar, Video, Clock, TrendingUp, 
  FileText, Activity, UserPlus, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function DoctorDashboard() {
  // Mock data for Doctor dashboard
  const stats = [
    { name: 'Total Consultations', value: '148', change: '+12% this week', trend: 'up', icon: Video, color: 'text-primary bg-primary-light' },
    { name: 'Scheduled Today', value: '8', change: 'Next at 2:30 PM', trend: 'neutral', icon: Calendar, color: 'text-secondary bg-secondary-light' },
    { name: 'Active Patients', value: '42', change: '+4 new this month', trend: 'up', icon: Users, color: 'text-accent bg-accent-light' },
    { name: 'Prescriptions Sent', value: '95', change: '8 pending fill', trend: 'up', icon: FileText, color: 'text-sky-600 bg-sky-50' }
  ];

  const appointments = [
    { id: 1, patient: 'Alexander Goth', time: '2:30 PM - 3:00 PM', type: 'Cardio Follow-up', status: 'Next', avatar: 'AG', color: 'border-l-primary' },
    { id: 2, patient: 'Beatrice Vance', time: '3:15 PM - 3:45 PM', type: 'General Consult', status: 'Scheduled', avatar: 'BV', color: 'border-l-slate-300' },
    { id: 3, patient: 'Corbin Dallas', time: '4:00 PM - 4:30 PM', type: 'Hypertension Review', status: 'Scheduled', avatar: 'CD', color: 'border-l-slate-300' },
    { id: 4, patient: 'Diana Prince', time: '5:00 PM - 5:15 PM', type: 'Quick Check-in', status: 'Completed', avatar: 'DP', color: 'border-l-accent' }
  ];

  const recentPatients = [
    { name: 'Ezra Bridger', condition: 'Type 2 Diabetes', lastVisit: 'May 25, 2026', status: 'Stable', score: '94%' },
    { name: 'Fiona Gallagher', condition: 'Hypertension', lastVisit: 'May 24, 2026', status: 'Attention', score: '81%' },
    { name: 'Geralt Rivia', condition: 'Post-Op Review', lastVisit: 'May 20, 2026', status: 'Stable', score: '97%' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-linear-to-r from-primary to-primary-dark p-6 md:p-8 text-white shadow-lg shadow-primary/20">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome Back, Dr. Adams!</h1>
          <p className="text-xs md:text-sm text-blue-100 max-w-md">
            You have 3 consultations remaining for this afternoon. Patient Beatrice Vance has checked in.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/doctor/consultation/session" 
            className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-primary shadow-xs hover:bg-slate-50 hover:scale-102 transition-all"
          >
            <Video className="h-4 w-4" /> Start Consultation Room
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.name}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <span className="text-2xl font-black text-brand-text">{stat.value}</span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-accent" />}
                  <span className={stat.trend === 'up' ? 'text-accent' : 'text-slate-400'}>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Appointments & Patient Registry */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Consultations */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-brand-text">Today's Virtual Consultations</h2>
                <p className="text-[11px] text-slate-400">Wednesday, May 27th, 2026</p>
              </div>
              <Link href="/doctor/appointments" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                View Calendar <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="space-y-3.5">
              {appointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-50 bg-slate-50/20 p-4 border-l-4 ${appointment.color} hover:border-l-8 transition-all duration-150`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                      {appointment.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm">{appointment.patient}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                        <Clock className="h-3 w-3" /> {appointment.time} 
                        <span>•</span> 
                        <span className="font-semibold text-slate-500">{appointment.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      appointment.status === 'Next' 
                        ? 'bg-primary-light text-primary animate-pulse' 
                        : appointment.status === 'Completed'
                          ? 'bg-accent-light text-accent'
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      {appointment.status}
                    </span>
                    
                    {appointment.status !== 'Completed' ? (
                      <Link 
                        href="/doctor/consultation/session" 
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-xs ${
                          appointment.status === 'Next'
                            ? 'bg-accent hover:bg-accent-dark shadow-accent/15'
                            : 'bg-primary hover:bg-primary-dark shadow-primary/15'
                        }`}
                      >
                        Join Room
                      </Link>
                    ) : (
                      <button className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                        Add Notes
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Patients Monitoring */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-brand-text">Patient Directory & Logs</h2>
                <p className="text-[11px] text-slate-400">Recent check-ups & medical statuses</p>
              </div>
              <Link href="/doctor/patients" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                Directory <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400">
                    <th className="py-2.5">Patient</th>
                    <th className="py-2.5">Condition</th>
                    <th className="py-2.5">Last Visit</th>
                    <th className="py-2.5">Health Indicator</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {recentPatients.map((patient) => (
                    <tr key={patient.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-bold text-brand-text">{patient.name}</td>
                      <td className="py-3 text-slate-500">{patient.condition}</td>
                      <td className="py-3 text-slate-400">{patient.lastVisit}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-accent" />
                          <span className="font-bold text-slate-700">{patient.score}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          patient.status === 'Stable'
                            ? 'bg-accent-light text-accent'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          <CheckCircle2 className="h-2.5 w-2.5" /> {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Actions & Prescriptions Status */}
        <div className="space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-text">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 text-left text-xs font-semibold text-slate-600 hover:bg-primary-light/30 hover:text-primary hover:border-primary/20 transition-all duration-150">
                <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
                  <UserPlus className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block font-bold">Refer Patient</span>
                  <span className="text-[10px] text-slate-400">Share files with specialists</span>
                </div>
              </button>

              <button className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 text-left text-xs font-semibold text-slate-600 hover:bg-accent-light/30 hover:text-accent hover:border-accent/20 transition-all duration-150">
                <div className="h-8 w-8 rounded-lg bg-accent-light flex items-center justify-center text-accent shrink-0">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block font-bold">Write e-Prescription</span>
                  <span className="text-[10px] text-slate-400">Refill or submit new scripts</span>
                </div>
              </button>
            </div>
          </div>

          {/* Vitals Summary Widget */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-brand-text">Clinic Availability</h3>
              <span className="text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded">Active Shift</span>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Shift Hours</span>
                <span className="font-semibold text-slate-700">09:00 AM - 06:00 PM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Platform Status</span>
                <span className="font-semibold text-accent flex items-center gap-1">Online</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400 font-medium">Emergency Back-up</span>
                <span className="font-semibold text-slate-700">Dr. Sarah Connor</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
