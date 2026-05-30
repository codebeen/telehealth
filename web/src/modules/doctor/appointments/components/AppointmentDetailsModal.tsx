'use client';

import React from 'react';
import { X, Mail, Phone, Clock, Video, Check, AlertCircle } from 'lucide-react';
import { DoctorAppointment } from '../types/appointment';

interface AppointmentDetailsModalProps {
  appt: DoctorAppointment | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
}

export default function AppointmentDetailsModal({
  appt,
  onClose,
  onConfirm,
  onReject,
  onCancel,
}: AppointmentDetailsModalProps) {
  
  if (!appt) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-50 space-y-6">
        
        {/* Header / Title */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-extrabold text-brand-text">Appointment Info</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">ID: {appt.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-xl p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {appt.status === 'Rejected' && appt.rejectionReason && (
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-rose-400 uppercase tracking-wider">Rejection Reason</span>
            <div className="bg-rose-50 rounded-2xl p-4 text-xs text-rose-700 leading-relaxed border border-rose-100">
              {appt.rejectionReason}
            </div>
          </div>
        )}

        {appt.status === 'Confirmed' && appt.meetingLink && (
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Google Meet Link</span>
            <a
              href={appt.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="block break-all bg-primary-light rounded-2xl p-4 text-xs text-primary font-bold leading-relaxed border border-primary/10 hover:bg-primary/10 transition-colors"
            >
              {appt.meetingLink}
            </a>
          </div>
        )}

        {/* Patient card details */}
        <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary text-base font-extrabold">
            {appt.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-brand-text text-sm truncate">{appt.patient}</h4>
            <div className="flex flex-col gap-0.5 mt-1 text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {appt.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {appt.phone}</span>
            </div>
          </div>
        </div>

        {/* Grid stats details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50/30 border border-slate-100 p-3.5 rounded-2xl space-y-1">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Consultation Type</span>
            <span className="text-xs font-bold text-slate-700">{appt.type}</span>
          </div>
          <div className="bg-slate-50/30 border border-slate-100 p-3.5 rounded-2xl space-y-1">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Appointment Status</span>
            <div className="mt-0.5">
              <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-md ${getStatusBadgeClass(appt.status)}`}>
                {appt.status}
              </span>
            </div>
          </div>
          <div className="bg-slate-50/30 border border-slate-100 p-3.5 rounded-2xl col-span-2 space-y-1">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Scheduled Timing</span>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              {appt.date} · {appt.time}
            </span>
          </div>
        </div>

        {/* Reason block */}
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Symptoms / Consultation Reason</span>
          <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed border border-slate-100/50">
            {appt.visitReason}
          </div>
        </div>

        {appt.status === 'Cancelled' && appt.cancellationReason && (
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-rose-400 uppercase tracking-wider">Cancellation Reason</span>
            <div className="bg-rose-50 rounded-2xl p-4 text-xs text-rose-700 leading-relaxed border border-rose-100">
              {appt.cancellationReason}
            </div>
          </div>
        )}

        {/* Modal actions */}
        <div className="flex gap-3 pt-2">
          {appt.status === 'Pending' && (
            <>
              <button 
                onClick={() => {
                  onConfirm(appt.id);
                  onClose();
                }}
                className="flex-1 rounded-2xl bg-accent py-3 text-xs font-bold text-white hover:bg-accent-dark shadow-md shadow-accent/15 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Confirm Appointment
              </button>
              <button 
                onClick={() => {
                  onReject(appt.id);
                  onClose();
                }}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-1.5"
              >
                <X className="h-4 w-4" /> Reject Appointment
              </button>
            </>
          )}

          {appt.status === 'Confirmed' && (
            <>
              <a
                href={appt.meetingLink ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-2xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark shadow-md shadow-primary/15 transition-all flex items-center justify-center gap-1.5"
              >
                <Video className="h-4 w-4" /> Join Room Call
              </a>
              <button 
                onClick={() => {
                  onCancel(appt.id);
                  onClose();
                }}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="h-4 w-4" /> Cancel Appointment
              </button>
            </>
          )}

          {(appt.status === 'Completed' || appt.status === 'Rejected' || appt.status === 'Cancelled') && (
            <button 
              onClick={onClose}
              className="w-full rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
