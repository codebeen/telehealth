'use client';

import React from 'react';
import { Pill, User, RefreshCw, Calendar, FileText } from 'lucide-react';
import { PrescriptionRecord } from '../types/medicalRecord';

interface PrescriptionListProps {
  prescriptions: PrescriptionRecord[];
}

export default function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Prescriptions Panel */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active & Past Prescriptions</h3>
        
        {prescriptions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No prescriptions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((pr) => (
              <div 
                key={pr.id} 
                className="rounded-2xl border border-slate-100 bg-slate-50/20 p-4 flex flex-col justify-between gap-4 hover:shadow-xs transition-shadow border-t-4 border-t-primary"
              >
                <div className="space-y-3">
                  {/* Title & Status */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary shrink-0">
                        <Pill className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-850 text-xs sm:text-sm">{pr.medication}</h4>
                        <span className="text-[9px] font-mono text-slate-450 block">ID: {pr.id}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm ${
                      pr.status === 'Active' 
                        ? 'bg-primary-light text-primary' 
                        : pr.status === 'Refill Pending'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      {pr.status}
                    </span>
                  </div>

                  {/* Dosage details */}
                  <div className="bg-white border border-slate-100 rounded-xl p-2.5 space-y-1.5 text-xs text-slate-650 font-medium">
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-450 text-[10px]">Dosage</span>
                      <span className="font-bold text-slate-800">{pr.dosage}</span>
                    </div>
                    <div>
                      <span className="text-slate-450 text-[10px] block">Instructions</span>
                      <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">{pr.instructions}</p>
                    </div>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-50 mt-1">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-slate-450" /> {pr.doctorName}</span>
                  <span className="flex items-center gap-1"><RefreshCw className="h-3.5 w-3.5 text-slate-450" /> Refills: {pr.refills}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
