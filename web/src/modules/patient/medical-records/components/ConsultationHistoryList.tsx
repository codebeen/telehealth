'use client';

import React from 'react';
import { 
  Calendar, Clock, Eye
} from 'lucide-react';
import Link from 'next/link';
import { ConsultationSessionRecord } from '../types/medicalRecord';

interface ConsultationHistoryListProps {
  records: ConsultationSessionRecord[];
}

export default function ConsultationHistoryList({ records }: ConsultationHistoryListProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Appointment History List */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Completed Consultation Logs</h3>
        
        {records.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No previous consultations found.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {records.map((rec) => (
              <div key={rec.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4.5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-light text-accent">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-text text-sm">{rec.doctorName}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5 font-semibold">
                      {rec.specialty} · {rec.date}
                    </p>
                    <p className="text-xs font-medium text-slate-600 mt-1 line-clamp-1">
                      Diagnosis: <span className="font-bold text-slate-800">{rec.diagnosis}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    <Clock className="h-3 w-3" /> {rec.duration}
                  </span>
                  
                  <Link 
                    href={`/patient/medical-records/${rec.id}`}
                    className="rounded-xl border border-slate-100 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Notes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

