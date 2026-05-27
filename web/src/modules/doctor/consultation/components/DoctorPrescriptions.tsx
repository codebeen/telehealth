'use client';

import React from 'react';
import { Plus, Download } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function DoctorPrescriptions() {
  const history = [
    { id: 1, patient: 'Arthur Pendragon', medication: 'Lisinopril 10mg', date: 'May 10, 2026', status: 'Active', refills: '3 remaining' },
    { id: 2, patient: 'Alexander Goth', medication: 'Atorvastatin 20mg', date: 'May 08, 2026', status: 'Active', refills: '5 remaining' },
    { id: 3, patient: 'Beatrice Vance', medication: 'Amoxicillin 500mg', date: 'April 14, 2026', status: 'Expired', refills: 'None' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Prescription Records"
        description="View and write e-prescriptions connected directly to pharmacies."
        action={
          <button className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Create Prescription
          </button>
        }
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400">
                <th className="pb-3">Patient</th>
                <th className="pb-3">Medication</th>
                <th className="pb-3">Issue Date</th>
                <th className="pb-3">Refills</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((row) => (
                <tr key={row.id}>
                  <td className="py-3.5 font-bold text-brand-text">{row.patient}</td>
                  <td className="py-3.5 font-medium text-slate-600">{row.medication}</td>
                  <td className="py-3.5 text-slate-400">{row.date}</td>
                  <td className="py-3.5 text-slate-500">{row.refills}</td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.status === 'Active' ? 'bg-accent-light text-accent' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors p-1" title="Download Record">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
