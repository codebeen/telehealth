'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, Calendar, Video, Clock, TrendingUp, 
  FileText, Activity, UserPlus, CheckCircle2, ChevronRight 
} from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { PATIENT_DATA } from '@/modules/doctor/patients/types/patientData';
import { APPOINTMENT_DATA } from '@/modules/doctor/appointments/types/appointmentData';

export default function DoctorDashboard() {
  const router = useRouter();

  // Dynamic calculations based on state databases
  const totalCompleted = APPOINTMENT_DATA.filter((a) => a.status === 'Completed').length;
  const scheduledToday = APPOINTMENT_DATA.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').length;
  const activePatientsCount = PATIENT_DATA.length;
  
  // Count prescriptions in patients' history
  let prescriptionsCount = 0;
  PATIENT_DATA.forEach(p => {
    p.history.forEach(h => {
      if (h.prescriptions && h.prescriptions !== 'No medication prescribed.') {
        prescriptionsCount++;
      }
    });
  });

  const stats = [
    { name: 'Total Consultations', value: String(140 + totalCompleted), change: '+12% this week', trend: 'up', icon: Video, color: 'text-primary bg-primary-light' },
    { name: 'Scheduled Today', value: String(scheduledToday), change: 'Active appointments', trend: 'neutral', icon: Calendar, color: 'text-secondary bg-secondary-light' },
    { name: 'Active Patients', value: String(activePatientsCount), change: '+4 new this month', trend: 'up', icon: Users, color: 'text-accent bg-accent-light' },
    { name: 'Prescriptions Sent', value: String(90 + prescriptionsCount), change: 'Active patient scripts', trend: 'up', icon: FileText, color: 'text-sky-600 bg-sky-50' }
  ];

  // Map APPOINTMENT_DATA to today's dashboard appointments list
  const appointments = APPOINTMENT_DATA
    .filter((a) => a.status !== 'Rejected' && a.status !== 'Cancelled')
    .map((a, index, arr) => {
      let displayStatus = 'Scheduled';
      if (a.status === 'Completed') {
        displayStatus = 'Completed';
      } else if (a.status === 'Confirmed') {
        // Find if this is the first non-completed confirmed appointment
        const firstConfirmedId = arr.find((item) => item.status === 'Confirmed')?.id;
        if (firstConfirmedId === a.id) {
          displayStatus = 'Next';
        }
      } else if (a.status === 'Pending') {
        displayStatus = 'Pending';
      }
      
      let borderLeftColor = 'border-l-slate-300';
      if (displayStatus === 'Next') {
        borderLeftColor = 'border-l-primary';
      } else if (displayStatus === 'Completed') {
        borderLeftColor = 'border-l-accent';
      } else if (displayStatus === 'Pending') {
        borderLeftColor = 'border-l-amber-400';
      }

      // Link to correct patient page
      const patientRecord = PATIENT_DATA.find(p => p.name.toLowerCase() === a.patient.toLowerCase());

      return {
        id: a.id,
        patient: a.patient,
        time: a.time,
        type: a.type,
        status: displayStatus,
        avatar: a.avatar,
        color: borderLeftColor,
        patientId: patientRecord?.id || ''
      };
    });

  // Load recent patients dynamically from PATIENT_DATA
  const recentPatients = PATIENT_DATA.map((p, index) => {
    const lastSession = p.history[0];
    
    return {
      id: p.id,
      name: p.name,
      condition: lastSession ? lastSession.type : 'No records yet',
      lastVisit: lastSession ? lastSession.date : '—',
      status: p.status
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <PageHeader 
        title="Dashboard" 
        description="Overview of your patients and consultations." 
      />

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
                          : appointment.status === 'Pending'
                            ? 'bg-amber-50 text-amber-600'
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
                      appointment.patientId ? (
                        <Link 
                          href={`/doctor/patients/${appointment.patientId}`}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-550 hover:border-primary hover:text-primary transition-all text-center"
                        >
                          Add Notes
                        </Link>
                      ) : (
                        <button className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-550 hover:bg-slate-50 transition-colors">
                          Add Notes
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                  No appointments scheduled today.
                </div>
              )}
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
                    <th className="py-2.5">Condition / Session</th>
                    <th className="py-2.5">Last Visit</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {recentPatients.map((patient) => (
                    <tr 
                      key={patient.id} 
                      onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 font-bold text-brand-text hover:text-primary transition-colors">{patient.name}</td>
                      <td className="py-3 text-slate-500">{patient.condition}</td>
                      <td className="py-3 text-slate-400">{patient.lastVisit}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold border ${
                          patient.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-primary-light text-primary border-primary/10'
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

        {/* Right 1 Col: Quick Actions & Platform Details */}
        <div className="space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-text">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <Link href="/doctor/consultation/schedule" className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 text-left text-xs font-semibold text-slate-650 hover:bg-sky-50/50 hover:text-sky-600 hover:border-sky-200/50 transition-all duration-150 w-full">
                <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block font-bold">Manage Schedule</span>
                  <span className="text-[10px] text-slate-400">Set availability and shifts</span>
                </div>
              </Link>

              <Link href="/doctor/appointments" className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 text-left text-xs font-semibold text-slate-650 hover:bg-accent-light/30 hover:text-accent hover:border-accent/20 transition-all duration-150 w-full">
                <div className="h-8 w-8 rounded-lg bg-accent-light flex items-center justify-center text-accent shrink-0">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block font-bold">Manage Appointments</span>
                  <span className="text-[10px] text-slate-400">Review pending visit requests</span>
                </div>
              </Link>

              <Link href="/doctor/patients" className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 text-left text-xs font-semibold text-slate-650 hover:bg-primary-light/30 hover:text-primary hover:border-primary/20 transition-all duration-150 w-full">
                <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block font-bold">Patient Directory</span>
                  <span className="text-[10px] text-slate-400">Access profiles and medical histories</span>
                </div>
              </Link>
            </div>
          </div>



        </div>

      </div>

    </div>
  );
}
