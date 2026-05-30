'use client';

import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { ConsultationSessionRecord } from '../types/medicalRecord';

interface ConsultationHistoryListProps {
  records: ConsultationSessionRecord[];
}

export default function ConsultationHistoryList({ records }: ConsultationHistoryListProps) {
  const recordsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(records.length / recordsPerPage));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return records.slice(start, start + recordsPerPage);
  }, [currentPage, records]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Consultation History
            </h3>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {records.length} Records
            </span>
          </div>
          {records.length > recordsPerPage && (
            <span className="text-[10px] font-bold text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {records.length === 0 ? (
          <p className="py-4 text-center text-xs text-slate-400">No previous consultations found.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {paginatedRecords.map((record) => (
              <div
                key={record.id}
                className="flex flex-col justify-between gap-4 py-4.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-light text-accent">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-text">{record.consultationType}</h4>
                    <p className="mt-0.5 text-[10px] font-semibold text-slate-450">
                      {record.doctorName} • {record.specialty} • {record.date}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-600">
                      <span className="font-bold text-slate-800">{record.finalSummary}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <span className="flex items-center gap-1.5 rounded border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    <Clock className="h-3 w-3" /> {record.duration}
                  </span>

                  <Link
                    href={`/patient/medical-records/${record.id}`}
                    className="flex cursor-pointer items-center gap-1 rounded-xl border border-slate-100 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {records.length > recordsPerPage && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-4">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-xl px-3 text-xs font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border border-slate-100 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
