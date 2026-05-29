'use client';

import React from 'react';
import { Mail, Phone, AlertCircle } from 'lucide-react';
import { PatientRecord } from '../types/patient';

interface PatientProfileProps {
  patient: PatientRecord;
}

export default function PatientProfile({ patient }: PatientProfileProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
      {/* Identity row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary text-base font-extrabold font-mono">
            {patient.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-brand-text">{patient.name}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Age: {patient.age} · Gender: {patient.gender}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-[10px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-400" /> {patient.contact}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-slate-400" /> {patient.phone}
          </span>
        </div>
      </div>

      {/* Ongoing appointment alert */}
      {patient.ongoingAppointment && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3.5 flex items-start gap-2.5 text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <span className="block text-[11px] font-bold">
              Ongoing Consultation Pending Documentation
            </span>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
              Patient has an active appointment: {patient.ongoingAppointment}. Use the form below
              to document findings, prescriptions, and consultation summaries.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
