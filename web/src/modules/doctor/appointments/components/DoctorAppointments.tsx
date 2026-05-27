'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function DoctorAppointments() {
  const appointments = [
    { id: 1, patient: 'Alexander Goth', time: '02:30 PM - 03:00 PM', date: 'Today, May 27', type: 'Cardio Follow-up', status: 'Next' },
    { id: 2, patient: 'Beatrice Vance', time: '03:15 PM - 03:45 PM', date: 'Today, May 27', type: 'General Consult', status: 'Confirmed' },
    { id: 3, patient: 'Corbin Dallas', time: '04:00 PM - 04:30 PM', date: 'Today, May 27', type: 'Hypertension Review', status: 'Confirmed' },
    { id: 4, patient: 'Diana Prince', time: '10:00 AM - 10:30 AM', date: 'Tomorrow, May 28', type: 'Skin Check-up', status: 'Confirmed' },
    { id: 5, patient: 'Bruce Wayne', time: '11:00 AM - 11:30 AM', date: 'Tomorrow, May 28', type: 'Neurological Consultation', status: 'Confirmed' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Appointments Calendar" 
        description="View and manage scheduled telehealth slots." 
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
        <div className="flex gap-2.5 border-b border-slate-50 pb-4 mb-2">
          <button className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white">Upcoming Appointments</button>
          <button className="rounded-lg bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100">Past History</button>
        </div>

        <div className="divide-y divide-slate-50">
          {appointments.map((appt) => (
            <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-text text-sm">{appt.patient}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 mt-1 font-medium">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {appt.date} at {appt.time}</span>
                    <span>•</span>
                    <span className="text-slate-500 font-semibold">{appt.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  appt.status === 'Next' ? 'bg-primary-light text-primary animate-pulse' : 'bg-accent-light text-accent'
                }`}>
                  {appt.status}
                </span>
                <Link
                  href="/doctor/consultation/session"
                  className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
                >
                  Start Call
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
