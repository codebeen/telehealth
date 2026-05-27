'use client';

import React from 'react';
import { Award, Shield, Mail } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function DoctorProfile() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Doctor Profile" 
        description="Manage your bio, certifications, and medical settings." 
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-6 max-w-2xl">
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold text-xl">
            EA
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text">Dr. Evelyn Adams</h3>
            <span className="text-xs text-primary font-semibold">Chief Cardiologist</span>
            <p className="text-[10px] text-slate-400 mt-1">NPI Number: 1982740921</p>
          </div>
        </div>

        <div className="space-y-3.5 border-t border-slate-50 pt-5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Mail className="h-4.5 w-4.5 text-slate-400" />
            <span>evelyn.adams@kyur.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-slate-400" />
            <span>Board Certified, American Board of Internal Medicine (Cardiovascular Disease)</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-slate-400" />
            <span>State Medical Board License Status: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
