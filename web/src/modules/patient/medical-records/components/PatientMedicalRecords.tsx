'use client';

import React from 'react';
import { HeartPulse, Download, Upload } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function PatientMedicalRecords() {
  const records = [
    { name: 'Lipid Profile Blood Test', date: 'May 08, 2026', doctor: 'Dr. Evelyn Adams', size: '1.4 MB' },
    { name: 'ECG Cardiac Scan Results', date: 'April 14, 2026', doctor: 'Dr. Evelyn Adams', size: '3.2 MB' },
    { name: 'Annual Physical Diagnostics', date: 'Jan 10, 2026', doctor: 'Dr. Sarah Connor', size: '2.1 MB' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="My Medical Records" 
        description="Securely store and share lab tests, scans, and reports with doctors." 
        action={
          <button className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors flex items-center gap-1.5">
            <Upload className="h-4 w-4" /> Upload Document
          </button>
        }
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="divide-y divide-slate-50">
          {records.map((rec, index) => (
            <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-text text-sm">{rec.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Uploaded: {rec.date} · Shared with: <span className="font-semibold text-slate-500">{rec.doctor}</span>
                  </p>
                  <span className="text-[9px] text-slate-400 block">{rec.size}</span>
                </div>
              </div>

              <button className="text-slate-400 hover:text-primary transition-colors p-2" title="Download Document">
                <Download className="h-4.5 w-4.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
