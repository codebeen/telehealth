'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, ClipboardList, ShieldAlert
} from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import MedicalProfileSummary from './MedicalProfileSummary';
import ConsultationHistoryList from './ConsultationHistoryList';
import MedicalHistoryList from './MedicalHistoryList';
import AllergiesList from './AllergiesList';
import { MedicalHistoryItem } from '../types/medicalRecord';
import { ConsultationSessionRecord } from '../types/medicalRecord';
import { getPatientAllergies, PatientAllergy } from '../services/allergy.service';
import { getPatientMedicalHistories } from '../services/medicalHistory.service';

import { 
  mockHealthProfile, 
  mockConsultations, 
  mockPrescriptions, 
  mockMedicalHistory,
  getPatientConsultationRecords,
} from '../services/medicalRecordService';

export default function PatientMedicalRecords() {
  const [activeTab, setActiveTab] = useState<'consultations' | 'history' | 'allergies'>('consultations');
  const [consultations, setConsultations] = useState<ConsultationSessionRecord[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>(mockMedicalHistory);
  const [allergiesList, setAllergiesList] = useState<PatientAllergy[]>([]);
  const [isLoadingConsultations, setIsLoadingConsultations] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const [consultationRecords, histories, allergies] = await Promise.all([
          getPatientConsultationRecords(),
          getPatientMedicalHistories(),
          getPatientAllergies(),
        ]);
        setConsultations(consultationRecords);
        setMedicalHistory(histories);
        setAllergiesList(allergies);
      } catch (err) {
        console.error('Failed to load patient medical records:', err);
        setConsultations(mockConsultations);
      } finally {
        setIsLoadingConsultations(false);
      }
    };
    loadRecords();
  }, []);

  const tabs = [
    { id: 'consultations' as const, label: 'Consultation History', icon: FileText },
    { id: 'history' as const, label: 'Medical History', icon: ClipboardList },
    { id: 'allergies' as const, label: 'Allergies', icon: ShieldAlert }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Page Title Header */}
      <PageHeader 
        title="My Medical Records" 
        description="Review previous consultations, view health stats, check active prescriptions, and manage your pre-existing medical history." 
      />

      {/* Basic Health Metrics Profile Widget */}
      <MedicalProfileSummary 
        profile={mockHealthProfile} 
        consultations={consultations}
        prescriptions={mockPrescriptions}
        medicalHistory={medicalHistory}
        allergiesList={allergiesList}
      />

      {/* Tab Selectors */}
      <div className="flex gap-2.5 border-b border-slate-100 pb-1 mb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content rendering */}
      <div className="mt-4">
        {activeTab === 'consultations' && (
          isLoadingConsultations ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xs">
              <p className="text-xs font-bold text-slate-400">Loading consultation history...</p>
            </div>
          ) : (
            <ConsultationHistoryList records={consultations} />
          )
        )}
        {activeTab === 'history' && (
          <MedicalHistoryList 
            historyList={medicalHistory} 
            setHistoryList={setMedicalHistory} 
          />
        )}
        {activeTab === 'allergies' && (
          <AllergiesList 
            allergiesList={allergiesList} 
            setAllergiesList={setAllergiesList} 
          />
        )}
      </div>

    </div>
  );
}

