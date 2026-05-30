'use client';

import React, { useEffect, useState } from 'react';
import { 
  History, Pill, ClipboardList, ShieldAlert
} from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import MedicalProfileSummary from './MedicalProfileSummary';
import ConsultationHistoryList from './ConsultationHistoryList';
import PrescriptionList from './PrescriptionList';
import MedicalHistoryList from './MedicalHistoryList';
import AllergiesList from './AllergiesList';
import { MedicalHistoryItem } from '../types/medicalRecord';
import { getPatientAllergies, PatientAllergy } from '../services/allergy.service';

import { 
  mockHealthProfile, 
  mockConsultations, 
  mockPrescriptions, 
  mockMedicalHistory 
} from '../services/medicalRecordService';

export default function PatientMedicalRecords() {
  const [activeTab, setActiveTab] = useState<'consultations' | 'prescriptions' | 'history' | 'allergies'>('consultations');
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>(mockMedicalHistory);
  const [allergiesList, setAllergiesList] = useState<PatientAllergy[]>([]);

  useEffect(() => {
    const loadAllergies = async () => {
      try {
        const allergies = await getPatientAllergies();
        setAllergiesList(allergies);
      } catch (err) {
        console.error('Failed to load allergies:', err);
      }
    };
    loadAllergies();
  }, []);

  const tabs = [
    { id: 'consultations' as const, label: 'Consultations & Notes', icon: History },
    { id: 'prescriptions' as const, label: 'My Prescriptions', icon: Pill },
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
        consultations={mockConsultations}
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
          <ConsultationHistoryList records={mockConsultations} />
        )}
        {activeTab === 'prescriptions' && (
          <PrescriptionList prescriptions={mockPrescriptions} />
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

