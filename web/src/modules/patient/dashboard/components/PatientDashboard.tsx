'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, FileText, Plus, ChevronRight, Search, ShieldCheck 
} from 'lucide-react';
import { PrescriptionRecord, MedicalHistoryItem, ConsultationSessionRecord } from '@/modules/patient/medical-records/types/medicalRecord';
import { getDisplayDateFormatted } from '@/modules/patient/appointment/services/appointmentService';
import { PatientAppointment } from '@/modules/patient/appointment/types/appointment';
import PatientSummaryCards from './PatientSummaryCards';
import PageHeader from '@/components/shared/PageHeader';
import { fetchPatientDashboard } from '../services/dashboardService';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [prescriptionsList, setPrescriptionsList] = useState<PrescriptionRecord[]>([]);
  const [medicalHistoryList, setMedicalHistoryList] = useState<MedicalHistoryItem[]>([]);
  const [consultationsList, setConsultationsList] = useState<ConsultationSessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPatientDashboard();

        if (!isMounted) return;

        setAppointments(data.upcomingAppointments);
        setPrescriptionsList(data.prescriptions);
        setMedicalHistoryList(data.medicalHistory);
        setConsultationsList(data.consultations);
      } catch (err) {
        console.error('Failed to load patient dashboard:', err);
        if (isMounted) {
          setAppointments([]);
          setPrescriptionsList([]);
          setMedicalHistoryList([]);
          setConsultationsList([]);
          setError('We could not load your dashboard details right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <PageHeader 
        title="Dashboard" 
        description="Overview of your medical records and appointments." 
      />

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-500">
          {error}
        </div>
      )}

      {/* Patient Summary Cards */}
      <PatientSummaryCards
        appointments={appointments}
        prescriptions={prescriptionsList}
        medicalHistory={medicalHistoryList}
        consultations={consultationsList}
      />

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
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="h-24 rounded-2xl border border-slate-100 bg-slate-50/60 animate-pulse" />
                ))
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-50 bg-slate-50/20 p-4 hover:border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary font-bold text-sm">
                        {appointment.doctorAvatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-text text-sm">{appointment.doctorName}</h4>
                        <span className="text-[10px] text-primary bg-primary-light px-1.5 py-0.5 rounded font-bold">
                          {appointment.doctorSpecialty}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{getDisplayDateFormatted(appointment.date)} · {appointment.slotStart}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent-light text-accent">
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
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="h-20 rounded-2xl border border-slate-100 bg-slate-50/60 animate-pulse" />
                ))
              ) : prescriptionsList.length > 0 ? (
              prescriptionsList.map((script) => (
                <div key={script.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm">{script.medication}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Prescribed by <span className="font-bold text-slate-500">{script.doctorName}</span> · {script.datePrescribed}
                      </p>
                      <span className="text-[10px] text-slate-500 italic block mt-1">Dosage: {script.dosage}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      script.status === 'Active' ? 'bg-accent-light text-accent' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {script.status}
                    </span>
                    <button className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>
              ))
              ) : (
                <p className="py-6 text-center text-xs font-semibold text-slate-400">
                  No active prescriptions from completed consultations.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Actions */}
        <div className="space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-text">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <Link 
                href="/patient/doctor-discovery"
                className="flex items-center gap-3 rounded-xl border border-slate-50 p-3 hover:bg-slate-50 hover:border-slate-200 transition-all duration-150"
              >
                <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-700">Find a Doctor</span>
                  <span className="text-[10px] text-slate-400">Search active doctors & specialists</span>
                </div>
              </Link>

              <Link 
                href="/patient/appointment"
                className="flex items-center gap-3 rounded-xl border border-slate-50 p-3 hover:bg-slate-50 hover:border-slate-200 transition-all duration-150"
              >
                <div className="h-8 w-8 rounded-lg bg-accent-light flex items-center justify-center text-accent shrink-0">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-700">Book Appointment</span>
                  <span className="text-[10px] text-slate-400">Schedule a virtual consultation</span>
                </div>
              </Link>

              <Link 
                href="/patient/medical-records"
                className="flex items-center gap-3 rounded-xl border border-slate-50 p-3 hover:bg-slate-50 hover:border-slate-200 transition-all duration-150"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-700">Medical Records</span>
                  <span className="text-[10px] text-slate-400">Prescriptions, diagnoses & history</span>
                </div>
              </Link>

              <Link 
                href="/patient/profile"
                className="flex items-center gap-3 rounded-xl border border-slate-50 p-3 hover:bg-slate-50 hover:border-slate-200 transition-all duration-150"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-700">Health Profile</span>
                  <span className="text-[10px] text-slate-400">Update personal info & emergency contacts</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Visits & Notes */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-brand-text">Recent Visits & Notes</h3>
              <Link 
                href="/patient/medical-records" 
                className="text-[10px] font-bold text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="h-28 rounded-2xl border border-slate-100 bg-slate-50/60 animate-pulse" />
                ))
              ) : consultationsList.slice(0, 2).map((consultation) => (
                <div key={consultation.id} className="space-y-2 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-brand-text">{consultation.doctorName}</h4>
                      <p className="text-[10px] text-slate-400">{consultation.specialty}</p>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded shrink-0">
                      {consultation.date}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex gap-1.5 items-start">
                      <span className="text-[9px] font-bold text-accent bg-accent-light px-1.5 py-0.5 rounded leading-none shrink-0 mt-0.5">
                        Type
                      </span>
                      <p className="text-[10px] font-semibold text-slate-700 leading-tight">
                        {consultation.consultationType}
                      </p>
                    </div>
                    
                    <div className="text-[10px] text-slate-500 leading-relaxed pl-1.5 border-l-2 border-slate-200">
                      <span className="font-bold text-[9px] text-slate-400 block uppercase tracking-wider mb-0.5">Doctor Notes</span>
                      {consultation.finalSummary || consultation.recommendations || 'No summary provided.'}
                    </div>
                  </div>
                </div>
              ))}
              
              {consultationsList.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No recent medical notes found.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
