'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function DoctorPatients() {
  const patients = [
    { name: 'Alexander Goth', age: 42, condition: 'Post-Heart Attack Follow-up', contact: 'alex.g@example.com' },
    { name: 'Beatrice Vance', age: 29, condition: 'Asthma Management', contact: 'beatrice.v@example.com' },
    { name: 'Corbin Dallas', age: 37, condition: 'Hypertension Monitoring', contact: 'corbin.d@example.com' },
    { name: 'Diana Prince', age: 31, condition: 'Atopic Dermatitis Check', contact: 'diana.p@example.com' },
    { name: 'Ezra Bridger', age: 24, condition: 'Type 2 Diabetes Control', contact: 'ezra.b@example.com' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Patient Registry" 
        description="Manage records and history of patients under your care." 
      />

      {/* Patient List */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="divide-y divide-slate-50">
          {patients.map((pat, index) => (
            <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div>
                <h4 className="font-bold text-brand-text text-sm">{pat.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Age: {pat.age} · <span className="font-semibold text-slate-500">{pat.condition}</span>
                </p>
                <span className="text-[10px] text-slate-400 block">{pat.contact}</span>
              </div>
              <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:text-primary hover:border-primary/20 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
