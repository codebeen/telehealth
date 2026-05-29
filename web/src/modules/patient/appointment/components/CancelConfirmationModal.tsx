import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { PatientAppointment } from '../types/appointment';
import { getDisplayDateFormatted } from '../services/appointmentService';

interface CancelConfirmationModalProps {
  appointment: PatientAppointment;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelConfirmationModal({
  appointment,
  onClose,
  onConfirm,
}: CancelConfirmationModalProps) {
  const [reason, setReason] = useState('');
  const [cancelStep, setCancelStep] = useState<'confirm' | 'confirming' | 'success'>('confirm');

  const handleConfirmCancellation = () => {
    setCancelStep('confirming');

    // Simulate API delay
    setTimeout(() => {
      setCancelStep('success');
    }, 1500);
  };

  const handleDone = () => {
    onConfirm(reason.trim() || 'No reason provided.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 shrink-0">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-brand-text">Cancel Appointment</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand-text transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {cancelStep === 'success' ? (
          /* SUCCESS STATE */
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto bg-white">
            <div className="h-16 w-16 bg-accent-light rounded-full flex items-center justify-center text-accent animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-brand-text">Appointment Cancelled</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Your consultation with <span className="font-bold text-brand-text">{appointment.doctorName}</span> has been successfully cancelled.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="w-full bg-slate-50/50 rounded-2xl border border-slate-100 p-5 text-left space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                  {appointment.doctorAvatar}
                </div>
                <div>
                  <h5 className="font-bold text-brand-text text-xs">{appointment.doctorName}</h5>
                  <p className="text-[9px] text-slate-400 font-semibold">{appointment.doctorSpecialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-brand-text">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Cancelled Date</span>
                  <span className="flex items-center gap-1.5 text-brand-text"><Calendar className="h-3.5 w-3.5 text-primary" /> {getDisplayDateFormatted(appointment.date)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Status</span>
                  <span className="text-rose-500 font-bold">Cancelled</span>
                </div>
              </div>
            </div>

            <div className="w-full pt-2">
              <button
                onClick={handleDone}
                className="w-full text-center rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Close & Update List
              </button>
            </div>
          </div>
        ) : (
          /* CONFIRM STATE */
          <>
            <div className="p-6 space-y-4">
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Are you sure you want to cancel your upcoming telehealth consultation with <span className="font-bold text-brand-text">{appointment.doctorName}</span>?
              </p>

              {/* Quick Schedule Reference */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px] font-bold text-brand-text">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{getDisplayDateFormatted(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{appointment.slotStart} - {appointment.slotEnd}</span>
                </div>
              </div>

              {/* Cancellation Reason input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Cancellation Reason (Optional)
                </label>
                <textarea
                  placeholder="e.g. Work schedule conflict, feeling better, need to reschedule..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-24 rounded-xl border border-slate-200 bg-slate-50/30 p-3 text-xs font-semibold text-brand-text outline-hidden focus:border-rose-300 focus:bg-white resize-none transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-50 p-6 flex gap-2.5 bg-slate-50/20">
              <button
                onClick={onClose}
                disabled={cancelStep === 'confirming'}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancellation}
                disabled={cancelStep === 'confirming'}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-rose-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelStep === 'confirming' ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
