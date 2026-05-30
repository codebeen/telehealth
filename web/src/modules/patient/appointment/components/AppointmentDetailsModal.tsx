import React, { useState } from 'react';
import { X, Calendar, Clock, Video, RefreshCw, XCircle, Copy, Check } from 'lucide-react';
import { PatientAppointment } from '../types/appointment';
import { getDisplayDateFormatted } from '../services/appointmentService';
import Link from 'next/link';

interface AppointmentDetailsModalProps {
  appointment: PatientAppointment;
  onClose: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}

export default function AppointmentDetailsModal({
  appointment,
  onClose,
  onReschedule,
  onCancel,
}: AppointmentDetailsModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const displayDate = getDisplayDateFormatted(appointment.date);
  const hasMeetingLink = appointment.roomId.startsWith('http');

  const copyMeetingLink = async () => {
    if (!hasMeetingLink) return;

    await navigator.clipboard.writeText(appointment.roomId);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1800);
  };

  const statusBadgeColor = {
    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
    Upcoming: 'bg-accent-light text-accent border-accent/20',
    Completed: 'bg-primary-light text-primary border-primary/20',
    Cancelled: 'bg-rose-50 text-rose-500 border-rose-100',
  }[appointment.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-brand-text">Appointment Details</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reference ID: {appointment.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand-text transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Banner */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status:</span>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${statusBadgeColor}`}>
              {appointment.status}
            </span>
          </div>

          {/* Doctor Card */}
          <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 items-start">
            <div className="h-12 w-12 bg-primary-light text-primary rounded-xl flex items-center justify-center font-bold text-base shrink-0">
              {appointment.doctorAvatar}
            </div>
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-brand-text text-sm leading-tight">{appointment.doctorName}</h4>
              <p className="text-[10px] text-primary font-bold">{appointment.doctorSpecialty}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{appointment.doctorAbout}</p>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/30 border border-slate-100/50">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Date</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                <Calendar className="h-4 w-4 text-primary" /> {displayDate}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Time Range</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                <Clock className="h-4 w-4 text-primary" /> {appointment.slotStart} - {appointment.slotEnd}
              </span>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Consultation Type</span>
              <span className="text-xs font-bold text-brand-text">
                {appointment.consultationType}
              </span>
            </div>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Reason for Visit</span>
            <p className="text-xs text-brand-text font-semibold leading-relaxed bg-slate-50/20 p-3 rounded-xl border border-slate-100/30">
              {appointment.visitReason}
            </p>
          </div>

          {/* Consultation Room info */}
          {appointment.status !== 'Cancelled' && (
            <div className="space-y-2 p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-text">
                <Video className="h-4.5 w-4.5 text-primary" />
                <span>Telehealth Consultation Room</span>
              </div>
              {hasMeetingLink ? (
                <div className="flex flex-col gap-2 pl-6.5">
                  <a
                    href={appointment.roomId}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all text-[10px] text-primary font-bold hover:underline"
                  >
                    {appointment.roomId}
                  </a>
                  <button
                    onClick={copyMeetingLink}
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-primary/10 bg-primary-light px-2.5 py-1.5 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {isCopied ? 'Copied' : 'Copy Link'}
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 font-semibold pl-6.5">
                  Waiting for the doctor to accept and generate the Google Meet link.
                </p>
              )}
            </div>
          )}

          {/* Cancelled reason detail */}
          {appointment.status === 'Cancelled' && appointment.cancelReason && (
            <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 space-y-1">
              <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider block">Reason for Cancellation</span>
              <p className="text-xs text-rose-700 font-semibold leading-relaxed">
                {appointment.cancelReason}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-50 p-6 flex flex-col gap-2.5 bg-slate-50/20">
          {hasMeetingLink && appointment.status !== 'Cancelled' && (
            <div className="flex gap-2.5">
              <Link
                href={appointment.roomId}
                target="_blank"
                className="flex-1 text-center rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Join Consultation Room
              </Link>
            </div>
          )}

          <div className="flex gap-2">
            {(appointment.status === 'Pending' || appointment.status === 'Upcoming') && (
              <>
                <button
                  onClick={() => {
                    onReschedule();
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reschedule
                </button>
                <button
                  onClick={() => {
                    onCancel();
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-transparent py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <XCircle className="h-3.5 w-3.5" /> Cancel Booking
                </button>
              </>
            )}
            
            {appointment.status !== 'Pending' && appointment.status !== 'Upcoming' && (
              <button
                onClick={onClose}
                className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close details
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
