'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { DoctorAppointment } from '../types/appointment';
import { APPOINTMENT_DATA, persistAppointmentData } from '../types/appointmentData';
import AppointmentItem from './AppointmentItem';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(() => [...APPOINTMENT_DATA]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [selectedAppt, setSelectedAppt] = useState<DoctorAppointment | null>(null);
  
  // Confirmation Modal Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'confirm' | 'reject' | 'cancel';
    apptId: number;
    patientName: string;
  } | null>(null);

  // Filter lists based on tab
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Pending' || a.status === 'Confirmed'
  );
  
  const historyAppointments = appointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Rejected' || a.status === 'Cancelled'
  );

  const handleConfirm = (id: number) => {
    const idx = APPOINTMENT_DATA.findIndex((a) => a.id === id);
    if (idx !== -1) {
      APPOINTMENT_DATA[idx].status = 'Confirmed';
      persistAppointmentData();
    }
    setAppointments(prev => 
      prev.map(appt => appt.id === id ? { ...appt, status: 'Confirmed' } : appt)
    );
    // Sync with modal if open
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt(prev => prev ? { ...prev, status: 'Confirmed' } : null);
    }
  };

  const handleReject = (id: number) => {
    const idx = APPOINTMENT_DATA.findIndex((a) => a.id === id);
    if (idx !== -1) {
      APPOINTMENT_DATA[idx].status = 'Rejected';
      persistAppointmentData();
    }
    setAppointments(prev => 
      prev.map(appt => appt.id === id ? { ...appt, status: 'Rejected' } : appt)
    );
    // Sync with modal if open
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
  };

  const handleCancel = (id: number) => {
    const idx = APPOINTMENT_DATA.findIndex((a) => a.id === id);
    if (idx !== -1) {
      APPOINTMENT_DATA[idx].status = 'Cancelled';
      persistAppointmentData();
    }
    setAppointments(prev => 
      prev.map(appt => appt.id === id ? { ...appt, status: 'Cancelled' } : appt)
    );
    // Sync with modal if open
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt(prev => prev ? { ...prev, status: 'Cancelled' } : null);
    }
  };

  const triggerConfirm = (id: number, type: 'confirm' | 'reject' | 'cancel') => {
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      setConfirmDialog({
        type,
        apptId: id,
        patientName: appt.patient
      });
    }
  };

  const handleConfirmDialogAction = () => {
    if (!confirmDialog) return;
    const { type, apptId } = confirmDialog;
    if (type === 'confirm') {
      handleConfirm(apptId);
    } else if (type === 'reject') {
      handleReject(apptId);
    } else if (type === 'cancel') {
      handleCancel(apptId);
    }
    setConfirmDialog(null);
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
          {displayList.length > 0 ? (
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
      {confirmDialog && (
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
    </div>
  );
}
