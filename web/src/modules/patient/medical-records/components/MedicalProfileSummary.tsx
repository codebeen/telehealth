'use client';

import React from 'react';
import { 
  Heart, Pill, ClipboardList, ShieldAlert, History
} from 'lucide-react';
import { BasicHealthProfile, ConsultationSessionRecord, PrescriptionRecord, MedicalHistoryItem } from '../types/medicalRecord';
import { PatientAllergy } from '../services/allergy.service';

interface MedicalProfileSummaryProps {
  profile: BasicHealthProfile;
  consultations: ConsultationSessionRecord[];
  prescriptions: PrescriptionRecord[];
  medicalHistory: MedicalHistoryItem[];
  allergiesList: PatientAllergy[];
}

export default function MedicalProfileSummary({ 
  profile, 
  consultations, 
  prescriptions, 
  medicalHistory,
  allergiesList
}: MedicalProfileSummaryProps) {
  // 1. Consultations Stats
  const totalConsultations = consultations.length;
  const lastConsultation = consultations[0] ? `Last: ${consultations[0].date}` : 'No consultations';

  // 2. Prescriptions Stats
  const activePrescriptions = prescriptions.filter(p => p.status === 'Active').length;
  const totalPrescriptions = prescriptions.length;

  // 3. Medical History Stats
  const activeConditions = medicalHistory.filter(h => h.status === 'ACTIVE').length;
  const resolvedConditions = medicalHistory.filter(h => h.status === 'RESOLVED').length;

  // 4. Allergies & Vitals Stats
  const totalAllergies = allergiesList.length;
  const allergyNames = allergiesList.map((a) => a.name).join(', ');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
      
      {/* Consultations Summary Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs flex items-center gap-3.5 hover:border-primary/20 transition-all duration-200">
        <div className="h-9 w-9 rounded-xl bg-primary-light border border-primary/10 text-primary flex items-center justify-center font-black shrink-0">
          <History className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Consultation Logs</p>
          <p className="text-sm font-extrabold text-slate-900 mt-1.5">{totalConsultations} Session{totalConsultations === 1 ? '' : 's'}</p>
          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{lastConsultation}</p>
        </div>
      </div>

      {/* Medical History Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs flex items-center gap-3.5 hover:border-emerald-250 transition-all duration-200">
        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-black shrink-0">
          <ClipboardList className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Medical History</p>
          <p className="text-sm font-extrabold text-slate-900 mt-1.5">{activeConditions} Active Condition{activeConditions === 1 ? '' : 's'}</p>
          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{resolvedConditions} resolved</p>
        </div>
      </div>

      {/* Allergies & Vitals Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs flex items-center gap-3.5 hover:border-amber-250 transition-all duration-200">
        <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-black shrink-0">
          <ShieldAlert className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Allergies & Blood</p>
          <p className="text-sm font-extrabold text-slate-900 mt-1.5">{totalAllergies} Allergy{totalAllergies === 1 ? '' : 'ies'}</p>
          <p className="text-[10px] font-semibold text-slate-500 mt-0.5 truncate max-w-[160px]" title={allergyNames || 'None'}>
            Allergies: {allergyNames || 'None'}
          </p>
        </div>
      </div>

    </div>
  );
}
