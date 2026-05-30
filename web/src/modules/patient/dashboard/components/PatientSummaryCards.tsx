'use client';

import React from 'react';
import { Calendar, FileText, Activity, Video } from 'lucide-react';
import { PatientAppointment } from '@/modules/patient/appointment/types/appointment';
import { PrescriptionRecord, MedicalHistoryItem, ConsultationSessionRecord } from '@/modules/patient/medical-records/types/medicalRecord';
import { getDisplayDateFormatted } from '@/modules/patient/appointment/services/appointmentService';

interface PatientSummaryCardsProps {
  appointments: PatientAppointment[];
  prescriptions: PrescriptionRecord[];
  medicalHistory: MedicalHistoryItem[];
  consultations: ConsultationSessionRecord[];
}

export default function PatientSummaryCards({
  appointments,
  prescriptions,
  medicalHistory,
  consultations
}: PatientSummaryCardsProps) {
  
  // Calculate upcoming appointments (should already be filtered, but double check)
  const upcomingCount = appointments.filter(a => a.status === 'Upcoming' || a.status === 'Pending').length;
  // Get next upcoming appointment details
  const sortedUpcoming = [...appointments]
    .filter(a => a.status === 'Upcoming' || a.status === 'Pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextAppt = sortedUpcoming[0];
  const nextApptText = nextAppt
    ? `Next: ${nextAppt.doctorName} (${getDisplayDateFormatted(nextAppt.date)})`
    : 'No upcoming appointments';

  // Calculate active conditions
  const activeConditions = medicalHistory.filter(h => h.status === 'ACTIVE');
  const activeConditionsCount = activeConditions.length;
  const conditionsText = activeConditionsCount > 0
    ? `Active: ${activeConditions.map(h => h.conditionName).join(', ')}`
    : 'No active health conditions';

  // Calculate active prescriptions
  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
  const activePrescriptionsCount = activePrescriptions.length;
  const prescriptionsText = activePrescriptionsCount > 0
    ? `Latest: ${activePrescriptions[0].medication}`
    : 'No active prescriptions';

  // Calculate completed consultations
  const completedConsultationsCount = consultations.length;
  const latestConsultation = consultations[0];
  const consultationsText = latestConsultation
    ? `Latest: ${latestConsultation.doctorName} (${latestConsultation.date})`
    : 'No completed sessions';

  const cards = [
    {
      name: 'Upcoming Appointments',
      value: upcomingCount,
      status: nextApptText,
      icon: Calendar,
      color: 'text-primary bg-primary-light border-primary/10',
      hoverBorder: 'hover:border-primary/30',
      accentGlow: 'group-hover:bg-primary-light/50'
    },
    {
      name: 'Active Prescriptions',
      value: activePrescriptionsCount,
      status: prescriptionsText,
      icon: FileText,
      color: 'text-rose-500 bg-rose-50 border-rose-100',
      hoverBorder: 'hover:border-rose-200',
      accentGlow: 'group-hover:bg-rose-100/50'
    },
    {
      name: 'Medical Conditions',
      value: activeConditionsCount,
      status: conditionsText,
      icon: Activity,
      color: 'text-amber-500 bg-amber-50 border-amber-100',
      hoverBorder: 'hover:border-amber-200',
      accentGlow: 'group-hover:bg-amber-100/50'
    },
    {
      name: 'Completed Consultations',
      value: completedConsultationsCount,
      status: consultationsText,
      icon: Video,
      color: 'text-accent bg-accent-light border-accent/10',
      hoverBorder: 'hover:border-accent/30',
      accentGlow: 'group-hover:bg-accent-light/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.name} 
            className={`group rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${card.hoverBorder}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${card.color} ${card.accentGlow}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {card.name}
                </span>
                <span className="text-lg font-black text-brand-text leading-tight mt-0.5 block">
                  {card.value}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t border-slate-50 pt-2 flex items-center justify-between text-[10px] font-semibold text-slate-400 gap-2">
              <span className="shrink-0">Status:</span>
              <span className="text-slate-600 font-bold truncate text-right flex-1" title={card.status}>
                {card.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
