'use client';

import React from 'react';
import { Clock, Eye, Check, X, Video, FileText } from 'lucide-react';
import { DoctorAppointment } from '../types/appointment';

interface AppointmentItemProps {
  appt: DoctorAppointment;
  onViewDetails: (appt: DoctorAppointment) => void;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
}

export default function AppointmentItem({
  appt,
  onViewDetails,
  onConfirm,
  onReject,
  onCancel,
  onComplete,
}: AppointmentItemProps) {
  
  const getStatusBadgeClass = (status: DoctorAppointment['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Confirmed':
        return 'bg-primary-light text-primary border border-primary/10';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Rejected':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'Cancelled':
        return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
  };

  return (
    <div 
      onClick={() => onViewDetails(appt)}
      className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-4.5 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-50/30 transition-colors rounded-2xl px-2 -mx-2 animate-in fade-in duration-200"
    >
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 text-sm font-bold font-mono group-hover:bg-primary-light group-hover:text-primary transition-colors">
          {appt.avatar}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-brand-text text-sm group-hover:text-primary transition-colors">
              {appt.patient}
            </h4>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${getStatusBadgeClass(appt.status)}`}>
              {appt.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 mt-1 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> 
              {appt.date} · {appt.time}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-semibold">{appt.type}</span>
          </div>
          <p className="mt-1.5 flex max-w-2xl items-start gap-1.5 text-[10px] font-medium leading-relaxed text-slate-500">
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="line-clamp-2">
              <span className="font-bold text-slate-600">Reason:</span> {appt.visitReason}
            </span>
          </p>
          {appt.status === 'Cancelled' && appt.cancellationReason && (
            <p className="mt-1 text-[10px] font-semibold leading-relaxed text-rose-600">
              <span className="font-bold">Cancellation:</span> {appt.cancellationReason}
            </p>
          )}
        </div>
      </div>

      {/* Row Action Buttons */}
      <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => onViewDetails(appt)}
          className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/30 transition-all"
          title="View Details"
        >
          <Eye className="h-4.5 w-4.5" />
        </button>

        {appt.status === 'Pending' && (
          <>
            <button 
              onClick={() => onConfirm(appt.id)}
              className="flex h-8.5 items-center justify-center rounded-xl bg-accent px-3 py-2 text-xs font-bold text-white hover:bg-accent-dark shadow-xs shadow-accent/10 transition-colors gap-1"
              title="Accept Consultation"
            >
              <Check className="h-4 w-4" /> Accept
            </button>
            <button 
              onClick={() => onReject(appt.id)}
              className="flex h-8.5 items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-rose-500 hover:text-white transition-colors gap-1"
              title="Reject Consultation"
            >
              <X className="h-4 w-4" /> Reject
            </button>
          </>
        )}

        {appt.status === 'Confirmed' && (
          <>
            <a
              href={appt.meetingLink ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors shadow-xs shadow-primary/10 flex items-center gap-1"
            >
              <Video className="h-3.5 w-3.5" /> Start Call
            </a>
            <button 
              onClick={() => onComplete(appt.id)}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow-xs shadow-emerald-500/10 flex items-center gap-1"
            >
              <Check className="h-3.5 w-3.5" /> Complete
            </button>
            <button 
              onClick={() => onCancel(appt.id)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
