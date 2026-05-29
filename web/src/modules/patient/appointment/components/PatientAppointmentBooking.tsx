'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import AppointmentCard from './AppointmentCard';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import RescheduleModal from './RescheduleModal';
import CancelConfirmationModal from './CancelConfirmationModal';
import { initialAppointments } from '../services/appointmentService';
import { PatientAppointment } from '../types/appointment';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function PatientAppointmentBooking() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>(initialAppointments);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Modal States
  const [selectedApptDetails, setSelectedApptDetails] = useState<PatientAppointment | null>(null);
  const [apptToReschedule, setApptToReschedule] = useState<PatientAppointment | null>(null);
  const [apptToCancel, setApptToCancel] = useState<PatientAppointment | null>(null);

  // Tab Filtering
  const filteredAppointments = appointments.filter(appt => {
    if (activeTab === 'upcoming') {
      return appt.status === 'Upcoming';
    } else {
      return appt.status === 'Completed' || appt.status === 'Cancelled';
    }
  });

  // Event Handlers
  const handleRescheduleConfirm = (newDate: string, newStart: string, newEnd: string) => {
    if (!apptToReschedule) return;
    
    setAppointments(prev =>
      prev.map(appt =>
        appt.id === apptToReschedule.id
          ? { ...appt, date: newDate, slotStart: newStart, slotEnd: newEnd }
          : appt
      )
    );
    
    setApptToReschedule(null);
  };

  const handleCancelConfirm = (reason: string) => {
    if (!apptToCancel) return;

    setAppointments(prev =>
      prev.map(appt =>
        appt.id === apptToCancel.id
          ? { ...appt, status: 'Cancelled' as const, cancelReason: reason }
          : appt
      )
    );

    setApptToCancel(null);
  };

  // Summary Counts
  const totalUpcoming = appointments.filter(a => a.status === 'Upcoming').length;
  const totalCompleted = appointments.filter(a => a.status === 'Completed').length;
  const totalCancelled = appointments.filter(a => a.status === 'Cancelled').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Title Header */}
      <PageHeader 
        title="My Appointments" 
        description="Manage your upcoming video consultations, rescheduling, cancellations, and past sessions." 
      />

      {/* Summary stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Upcoming Consultations', value: totalUpcoming, color: 'text-accent bg-accent-light border-accent/10', icon: Clock },
          { label: 'Completed History', value: totalCompleted, color: 'text-primary bg-primary-light border-primary/10', icon: CheckCircle2 },
          { label: 'Cancelled / Missed', value: totalCancelled, color: 'text-rose-500 bg-rose-50 border-rose-100', icon: XCircle },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs flex items-center gap-3.5">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${stat.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-text leading-tight">{stat.label}</p>
                <p className="text-sm font-black text-brand-text mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Tabs Container */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-6">
        
        {/* Tab Headers */}
        <div className="flex gap-2.5 border-b border-slate-50 pb-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-primary text-white shadow-xs shadow-primary/20'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-brand-text'
            }`}
          >
            Upcoming Appointments ({totalUpcoming})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'past'
                ? 'bg-primary text-white shadow-xs shadow-primary/20'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-brand-text'
            }`}
          >
            Past History ({totalCompleted + totalCancelled})
          </button>
        </div>

        {/* Card Grid */}
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onViewDetails={setSelectedApptDetails}
                onReschedule={setApptToReschedule}
                onCancel={setApptToCancel}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-3">
              <Calendar className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-extrabold text-brand-text">No Appointments Found</h4>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-normal font-medium">
              {activeTab === 'upcoming' 
                ? 'You do not have any upcoming video consultations scheduled.' 
                : 'Your consultation session archive is currently empty.'}
            </p>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedApptDetails && (
        <AppointmentDetailsModal
          appointment={selectedApptDetails}
          onClose={() => setSelectedApptDetails(null)}
          onReschedule={() => setApptToReschedule(selectedApptDetails)}
          onCancel={() => setApptToCancel(selectedApptDetails)}
        />
      )}

      {/* Reschedule Calendar Modal */}
      {apptToReschedule && (
        <RescheduleModal
          appointment={apptToReschedule}
          onClose={() => setApptToReschedule(null)}
          onConfirm={handleRescheduleConfirm}
        />
      )}

      {/* Cancel Confirmation Prompt */}
      {apptToCancel && (
        <CancelConfirmationModal
          appointment={apptToCancel}
          onClose={() => setApptToCancel(null)}
          onConfirm={handleCancelConfirm}
        />
      )}

    </div>
  );
}
