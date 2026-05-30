'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, User, CalendarCheck, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { PatientRecord } from '../types/patient';

interface PatientListProps {
  patients: PatientRecord[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewPatient: (id: string) => void;
}

export default function PatientList({
  patients,
  searchQuery,
  onSearchChange,
  onViewPatient,
}: PatientListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedPatients = patients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search + count row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full rounded-2xl bg-white border border-slate-200 pl-10 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-primary transition-all placeholder-slate-400 shadow-xs"
          />
        </div>
        <span className="shrink-0 text-[10px] font-bold text-slate-400 uppercase bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs tracking-wider">
          {patients.length} {patients.length === 1 ? 'Patient' : 'Patients'}
        </span>
      </div>

      {/* Table header */}
      {patients.length > 0 && (
        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <span>Patient</span>
          <span className="text-center w-20">Sessions</span>
          <span className="text-center w-28">Last Visit</span>
          <span className="text-center w-20">Status</span>
          <span className="w-20" />
        </div>
      )}

      {/* Patient rows */}
      <div className="space-y-2">
        {paginatedPatients.map((pat) => {
          const initials = pat.name
            .split(' ')
            .map((n) => n[0])
            .join('');
          const lastSession = pat.history[0]; // history is prepended, so [0] is most recent
          const sessionCount = pat.history.length;

          return (
            <div
              key={pat.id}
              onClick={() => onViewPatient(pat.id)}
              className="group grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-xs hover:border-primary/25 hover:shadow-sm cursor-pointer transition-all duration-200"
            >
              {/* Identity */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary text-sm font-extrabold group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-brand-text truncate group-hover:text-primary transition-colors">
                    {pat.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                    {pat.contact} · Age {pat.age} · {pat.gender}
                  </p>
                </div>
              </div>

              {/* Session count */}
              <div className="flex md:flex-col items-center gap-1.5 md:gap-0 md:w-20">
                <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase">Sessions:</span>
                <div className="flex items-center gap-1.5 md:flex-col md:items-center">
                  <ClipboardList className="h-3.5 w-3.5 text-slate-400 md:hidden" />
                  <span className="text-base font-black text-brand-text md:text-lg">{sessionCount}</span>
                  <span className="hidden md:block text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    {sessionCount === 1 ? 'Session' : 'Sessions'}
                  </span>
                </div>
              </div>

              {/* Last visit */}
              <div className="flex md:flex-col items-center gap-1.5 md:gap-0.5 md:w-28">
                <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase">Last Visit:</span>
                <CalendarCheck className="h-3.5 w-3.5 text-slate-400 md:hidden" />
                <span className="text-[10px] font-bold text-slate-500 md:text-center">
                  {lastSession?.date ?? '—'}
                </span>
              </div>

              {/* Status badge */}
              <div className="flex md:justify-center md:w-20">
                {pat.history.length > 0 ? (
                  <span className="text-[9px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap">
                    ✓ Completed
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-1 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                    No Records
                  </span>
                )}
              </div>

              {/* View button */}
              <div className="flex md:justify-end md:w-20" onClick={(e) => { e.stopPropagation(); onViewPatient(pat.id); }}>
                <button
                  className="flex items-center gap-1.5 rounded-xl bg-primary-light px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all duration-200 whitespace-nowrap"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {patients.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-14 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <User className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-xs text-slate-400 font-semibold">No patients found matching your search.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-650 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-8 w-8 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'border border-slate-200 bg-white text-slate-450 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.max(totalPages, 1)))}
          disabled={currentPage >= totalPages || totalPages <= 1}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-650 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
