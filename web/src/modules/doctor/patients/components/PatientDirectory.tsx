'use client';

import React from 'react';
import { Search, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { PatientRecord } from '../types/patient';

interface PatientDirectoryProps {
  patients: PatientRecord[];
  selectedPatId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPatient: (id: string) => void;
}

function getStatusBadgeClass(status: PatientRecord['status']) {
  if (status === 'Ongoing') {
    return 'bg-primary-light text-primary border border-primary/10';
  }
  return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
}

export default function PatientDirectory({
  patients,
  selectedPatId,
  searchQuery,
  onSearchChange,
  onSelectPatient,
}: PatientDirectoryProps) {
  return (
    <div className="lg:col-span-1 rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-4 h-fit">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
        <h3 className="text-sm font-bold text-brand-text">Patient Directory</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-md">
          {patients.length} Patients
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-2xl bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-700 outline-hidden border border-transparent focus:border-slate-150 focus:bg-white transition-all placeholder-slate-400"
        />
      </div>

      {/* List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {patients.map((pat) => (
          <div
            key={pat.id}
            onClick={() => onSelectPatient(pat.id)}
            className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border duration-200 ${
              selectedPatId === pat.id
                ? 'bg-primary-light border-primary/20 shadow-xs'
                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4
                  className={`font-bold text-xs truncate ${
                    selectedPatId === pat.id
                      ? 'text-primary'
                      : 'text-brand-text group-hover:text-primary'
                  }`}
                >
                  {pat.name}
                </h4>
                <span
                  className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${getStatusBadgeClass(pat.status)}`}
                >
                  {pat.status}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 mt-1 text-[9px] text-slate-400 font-medium">
                <span className="truncate">{pat.contact}</span>
                {pat.ongoingAppointment ? (
                  <span className="text-primary font-bold flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> Active Consultation Today
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Done
                  </span>
                )}
              </div>
            </div>

            <ChevronRight
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                selectedPatId === pat.id
                  ? 'text-primary translate-x-1'
                  : 'text-slate-300 group-hover:text-primary group-hover:translate-x-0.5'
              }`}
            />
          </div>
        ))}

        {patients.length === 0 && (
          <div className="text-center py-8 space-y-2">
            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400 font-semibold">No patients found</p>
          </div>
        )}
      </div>
    </div>
  );
}
