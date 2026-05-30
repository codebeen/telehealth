'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { DoctorAppointment } from '../types/appointment';
import AppointmentItem from './AppointmentItem';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import { getCurrentDoctorId } from '../../utils/currentDoctor';
import {
  acceptDoctorAppointment,
  cancelDoctorAppointment,
  getDoctorAppointments,
  rejectDoctorAppointment,
} from '../services/doctorAppointmentService';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [selectedAppt, setSelectedAppt] = useState<DoctorAppointment | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  
  // Confirmation Modal Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'confirm' | 'reject' | 'cancel';
    apptId: string;
    patientName: string;
  } | null>(null);

  const loadAppointments = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getDoctorAppointments(id, 'all');
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch doctor appointments:', err);
      setError('We could not load your consultation appointments right now.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const id = getCurrentDoctorId();
      setDoctorId(id);
      loadAppointments(id);
    } catch (err) {
      console.error(err);
      setError('Doctor profile is missing. Please sign in again.');
      setIsLoading(false);
    }
  }, [loadAppointments]);

  // Filter lists based on tab
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Pending' || a.status === 'Confirmed'
  );
  
  const historyAppointments = appointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Rejected' || a.status === 'Cancelled'
  );

  const handleConfirm = async (id: string) => {
    if (!doctorId) return;

    const updated = await acceptDoctorAppointment(doctorId, id);
    setAppointments(prev => prev.map(appt => appt.id === id ? updated : appt));

    if (selectedAppt?.id === id) {
      setSelectedAppt(updated);
    }
  };

  const handleReject = async (id: string) => {
    if (!doctorId) return;

    const rejectionReason = window.prompt('Reason for rejection');
    if (!rejectionReason?.trim()) return;

    const updated = await rejectDoctorAppointment(doctorId, id, rejectionReason.trim());
    setAppointments(prev => prev.map(appt => appt.id === id ? updated : appt));

    if (selectedAppt?.id === id) {
      setSelectedAppt(updated);
    }
  };

  const handleCancel = async (id: string) => {
    if (!doctorId) return;

    const trimmedReason = cancellationReason.trim();
    if (!trimmedReason) {
      setActionError('Cancellation reason is required.');
      return;
    }

    const updated = await cancelDoctorAppointment(
      doctorId,
      id,
      trimmedReason,
    );
    setAppointments(prev => prev.map(appt => appt.id === id ? updated : appt));

    if (selectedAppt?.id === id) {
      setSelectedAppt(updated);
    }
  };

  const triggerConfirm = (id: string, type: 'confirm' | 'reject' | 'cancel') => {
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      setActionError(null);
      if (type === 'cancel') {
        setCancellationReason('');
      }

      setConfirmDialog({
        type,
        apptId: id,
        patientName: appt.patient
      });
    }
  };

  const handleConfirmDialogAction = async () => {
    if (!confirmDialog) return;
    const { type, apptId } = confirmDialog;

    if (type === 'cancel' && !cancellationReason.trim()) {
      setActionError('Cancellation reason is required.');
      return;
    }

    setIsSubmittingAction(true);
    setActionError(null);

    try {
      if (type === 'confirm') {
        await handleConfirm(apptId);
      } else if (type === 'reject') {
        await handleReject(apptId);
      } else if (type === 'cancel') {
        await handleCancel(apptId);
      }
      setConfirmDialog(null);
    } catch (err) {
      console.error('Failed to update appointment:', err);
      setActionError('We could not update this appointment. Please try again.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const getConfirmModalText = () => {
    if (!confirmDialog) return { title: '', message: '', confirmText: '', variant: 'primary' as const };
    const { type, patientName } = confirmDialog;
    switch (type) {
      case 'confirm':
        return {
          title: 'Confirm Appointment',
          message: `Are you sure you want to accept the appointment request from ${patientName}?`,
          confirmText: 'Confirm',
          variant: 'success' as const
        };
      case 'reject':
        return {
          title: 'Reject Appointment',
          message: `Are you sure you want to reject the appointment request from ${patientName}?`,
          confirmText: 'Reject',
          variant: 'danger' as const
        };
      case 'cancel':
        return {
          title: 'Cancel Appointment',
          message: `Are you sure you want to cancel the confirmed appointment with ${patientName}?`,
          confirmText: 'Cancel Appointment',
          variant: 'danger' as const
        };
    }
  };

  const displayList = activeTab === 'upcoming' ? upcomingAppointments : historyAppointments;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Consultation Appointments" 
        description="View, verify, and manage scheduled telehealth consultation appointments." 
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 pb-px">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`relative pb-3 text-sm font-bold transition-colors duration-200 px-1 mr-6 flex items-center gap-2 ${
              activeTab === 'upcoming' 
                ? 'text-primary' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Upcoming Appointments
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === 'upcoming' 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              {upcomingAppointments.length}
            </span>
            {activeTab === 'upcoming' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`relative pb-3 text-sm font-bold transition-colors duration-200 px-1 flex items-center gap-2 ${
              activeTab === 'history' 
                ? 'text-primary' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Past & Logs
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === 'history' 
                ? 'bg-primary/80 text-white' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              {historyAppointments.length}
            </span>
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Appointments List */}
        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xs text-slate-400 font-medium">Loading consultation appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 space-y-3">
              <AlertCircle className="h-8 w-8 text-rose-300 mx-auto" />
              <p className="text-xs text-rose-500 font-medium">{error}</p>
            </div>
          ) : displayList.length > 0 ? (
            displayList.map((appt) => (
              <AppointmentItem
                key={appt.id}
                appt={appt}
                onViewDetails={setSelectedAppt}
                onConfirm={(id) => triggerConfirm(id, 'confirm')}
                onReject={(id) => triggerConfirm(id, 'reject')}
                onCancel={(id) => triggerConfirm(id, 'cancel')}
              />
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming or pending appointments." 
                  : "No past history logs found."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appt={selectedAppt}
        onClose={() => setSelectedAppt(null)}
        onConfirm={(id) => triggerConfirm(id, 'confirm')}
        onReject={(id) => triggerConfirm(id, 'reject')}
        onCancel={(id) => triggerConfirm(id, 'cancel')}
      />

      {/* Action Confirmation Dialog Modal */}
      {confirmDialog && confirmDialog.type !== 'cancel' && (
        <ConfirmationModal
          isOpen={!!confirmDialog}
          onClose={() => setConfirmDialog(null)}
          onConfirm={handleConfirmDialogAction}
          title={getConfirmModalText().title}
          message={getConfirmModalText().message}
          confirmText={getConfirmModalText().confirmText}
          variant={getConfirmModalText().variant}
        />
      )}

      {confirmDialog?.type === 'cancel' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setConfirmDialog(null)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-slate-50 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setConfirmDialog(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                  <AlertTriangle className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-1 pr-8">
                  <h3 className="text-sm font-extrabold text-brand-text">Cancel Appointment</h3>
                  <p className="text-xs font-medium leading-relaxed text-slate-500">
                    Provide a cancellation reason for the confirmed appointment with{' '}
                    <span className="font-bold text-brand-text">{confirmDialog.patientName}</span>.
                  </p>
                </div>
              </div>

              <label className="block space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Cancellation Reason
                </span>
                <textarea
                  value={cancellationReason}
                  onChange={(event) => {
                    setCancellationReason(event.target.value);
                    setActionError(null);
                  }}
                  maxLength={1000}
                  placeholder="e.g. Emergency schedule conflict, unavailable for consultation, clinic priority case..."
                  className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/30 p-3 text-xs font-semibold text-brand-text outline-hidden transition-all focus:border-rose-300 focus:bg-white"
                />
              </label>

              {actionError && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-xs font-bold text-rose-600">
                  {actionError}
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => setConfirmDialog(null)}
                  disabled={isSubmittingAction}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmDialogAction}
                  disabled={isSubmittingAction || !cancellationReason.trim()}
                  className="flex-1 rounded-xl bg-rose-500 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/15 transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isSubmittingAction ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
