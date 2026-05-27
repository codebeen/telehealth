'use client';

import React from 'react';
import { Phone, Shield, Mail } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function PatientProfile() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Patient Profile" 
        description="View and manage your contact details and account settings." 
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-6 max-w-2xl">
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold text-xl">
            AP
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text">Arthur Pendragon</h3>
            <span className="text-xs text-slate-400 font-semibold">Patient ID: PAT-82740921</span>
            <p className="text-[10px] text-slate-400 mt-1">DOB: Aug 12, 1989 (36 yrs)</p>
          </div>
        </div>

        <div className="space-y-3.5 border-t border-slate-50 pt-5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Mail className="h-4.5 w-4.5 text-slate-400" />
            <span>arthur.p@kyur.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4.5 w-4.5 text-slate-400" />
            <span>+1 (555) 382-9012</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-slate-400" />
            <span>Emergency Contact: Guinevere Pendragon (+1 555-382-9013)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
