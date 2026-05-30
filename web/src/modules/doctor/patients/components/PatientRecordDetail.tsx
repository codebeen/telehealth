'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ClipboardList, FileText, ShieldAlert } from 'lucide-react';

import { PatientRecord, ConsultationSession } from '../types/patient';
import { PATIENT_DATA, persistPatientData } from '../types/patientData';
import { getCurrentDoctorId } from '../../utils/currentDoctor';
import {
  fetchCompletedConsultationPatient,
  updateConsultationRecord,
} from '../services/patientService';
import PatientProfile from './PatientProfile';
import ConsultationHistory from './ConsultationHistory';
import ConsultationForm from './ConsultationForm';

interface PatientRecordDetailProps {
  patientId: string;
}

export default function PatientRecordDetail({ patientId }: PatientRecordDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'consultations' | 'medicalHistory' | 'allergies'>(
    'consultations',
  );

  // Bootstrap from shared seed — in a real app this would be fetched by patientId
  const initial = PATIENT_DATA.find((p) => p.id === patientId) ?? null;
  const [patient, setPatient] = useState<PatientRecord | null>(initial);
  const [isLoading, setIsLoading] = useState(!initial);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Add-new form state
  const [showForm, setShowForm] = useState(!initial || initial.history.length === 0);
  const [formType, setFormType] = useState('');
  const [formFindings, setFormFindings] = useState('');
  const [formRecommendations, setFormRecommendations] = useState('');
  const [formPrescriptions, setFormPrescriptions] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPatient = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const doctorId = getCurrentDoctorId();
        const data = await fetchCompletedConsultationPatient(doctorId, patientId);

        if (isMounted) {
          setPatient(data);
          setShowForm(!data || data.history.length === 0);
        }
      } catch (err) {
        console.error('Failed to fetch patient medical record:', err);
        if (isMounted) {
          setLoadError('We could not load this patient medical record right now.');
          setPatient(initial);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPatient();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function clearForm() {
    setFormType('');
    setFormFindings('');
    setFormRecommendations('');
    setFormPrescriptions('');
    setFormSummary('');
    setFormSuccess(false);
  }

  function scrollToForm() {
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────

  async function handleUpdateSession(updated: ConsultationSession) {
    const doctorId = getCurrentDoctorId();
    const savedSession = await updateConsultationRecord(doctorId, patientId, updated.id, {
      consultationType: updated.type,
      clinicalFindings: updated.findings,
      recommendations: updated.recommendations,
      medicationPrescriptions: updated.prescriptions,
      finalSummary: updated.summary,
    });

    // Persist changes to mock db in-memory array and localStorage
    const patientIndex = PATIENT_DATA.findIndex((p) => p.id === patientId);
    if (patientIndex !== -1) {
      PATIENT_DATA[patientIndex].history = PATIENT_DATA[patientIndex].history.map((s) =>
        s.id === savedSession.id ? savedSession : s,
      );
      persistPatientData();
    }

    setPatient((prev) =>
      prev
        ? {
            ...prev,
            history: prev.history.map((s) => (s.id === savedSession.id ? savedSession : s)),
          }
        : prev,
    );
  }

  function handleAddNew() {
    clearForm();
    setShowForm(true);
    scrollToForm();
  }

  function handleCancelForm() {
    const hasHistory = (patient?.history.length ?? 0) > 0;
    setShowForm(false);
    clearForm();
    if (!hasHistory) setShowForm(true); // must add at least one record
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patient || !formType || !formFindings || !formRecommendations) return;

    const newSession: ConsultationSession = {
      id: `c-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      type: formType,
      findings: formFindings,
      recommendations: formRecommendations,
      prescriptions: formPrescriptions || 'No medication prescribed.',
      summary: formSummary || 'Consultation session finalized successfully.',
    };

    // Persist changes to mock db in-memory array and localStorage
    const patientIndex = PATIENT_DATA.findIndex((p) => p.id === patientId);
    if (patientIndex !== -1) {
      PATIENT_DATA[patientIndex].status = 'Completed';
      PATIENT_DATA[patientIndex].ongoingAppointment = undefined;
      PATIENT_DATA[patientIndex].history = [newSession, ...PATIENT_DATA[patientIndex].history];
      persistPatientData();
    }

    setPatient((prev) =>
      prev
        ? {
            ...prev,
            status: 'Completed',
            ongoingAppointment: undefined,
            history: [newSession, ...prev.history],
          }
        : prev,
    );

    clearForm();
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowForm(false);
    }, 2000);
  }

  // ── Not found ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/doctor/patients')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:border-primary/40 hover:text-primary shadow-xs transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-brand-text">Loading patient record...</h1>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center">
          <p className="text-xs text-slate-400 font-semibold">
            Fetching completed consultation history.
          </p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/doctor/patients')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:border-primary/40 hover:text-primary shadow-xs transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-brand-text">Patient not found</h1>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center">
          <p className="text-xs text-slate-400 font-semibold">
            {loadError ?? `No completed consultation record exists for patient ID "${patientId}".`}
          </p>
        </div>
      </div>
    );
  }

  // ── Detail view ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/doctor/patients')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:border-primary/40 hover:text-primary shadow-xs transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-brand-text sm:text-2xl">Patient Medical Record</h1>
          <p className="text-xs text-slate-400 mt-1">
            View consultation history and document new records
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Profile card */}
        <PatientProfile patient={patient} />

        {/* Records panel */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {[
              { id: 'consultations' as const, label: 'Consultation Notes and Prescription', icon: FileText },
              { id: 'medicalHistory' as const, label: 'Medical History', icon: ClipboardList },
              { id: 'allergies' as const, label: 'Allergies', icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-xs shadow-primary/20'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-brand-text'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'consultations' && (patient.history.length > 0 ? (
            <>
              {/* History timeline — each card self-manages edit state */}
              <ConsultationHistory
                history={patient.history}
                onUpdateSession={handleUpdateSession}
                showForm={showForm}
                onAddNew={handleAddNew}
              />

              {showForm && (
                <>
                  <div className="border-t border-slate-100" />
                  <div ref={formRef}>
                    <ConsultationForm
                      isEditMode={false}
                      formType={formType}
                      formFindings={formFindings}
                      formRecommendations={formRecommendations}
                      formPrescriptions={formPrescriptions}
                      formSummary={formSummary}
                      formSuccess={formSuccess}
                      onTypeChange={setFormType}
                      onFindingsChange={setFormFindings}
                      onRecommendationsChange={setFormRecommendations}
                      onPrescriptionsChange={setFormPrescriptions}
                      onSummaryChange={setFormSummary}
                      onSubmit={handleSubmit}
                      onCancel={handleCancelForm}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            /* No history — open blank form immediately */
            <div className="space-y-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100">
                  <ClipboardList className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-text">No consultation records yet</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Use the form below to document the first consultation record for this patient.
                  </p>
                </div>
              </div>

              <div ref={formRef}>
                <ConsultationForm
                  isEditMode={false}
                  formType={formType}
                  formFindings={formFindings}
                  formRecommendations={formRecommendations}
                  formPrescriptions={formPrescriptions}
                  formSummary={formSummary}
                  formSuccess={formSuccess}
                  onTypeChange={setFormType}
                  onFindingsChange={setFormFindings}
                  onRecommendationsChange={setFormRecommendations}
                  onPrescriptionsChange={setFormPrescriptions}
                  onSummaryChange={setFormSummary}
                  onSubmit={handleSubmit}
                  onCancel={() => router.push('/doctor/patients')}
                />
              </div>
            </div>
          ))}

          {activeTab === 'medicalHistory' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Medical History
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Patient-declared conditions from their medical profile.
                </p>
              </div>

              {(patient.medicalHistory ?? []).length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {(patient.medicalHistory ?? []).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-extrabold text-brand-text">
                          {item.conditionName}
                        </h4>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${
                            item.status === 'ACTIVE'
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                              : 'border-slate-200 bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      {item.diagnosedDate && (
                        <p className="mt-2 text-[10px] font-bold text-slate-400">
                          Diagnosed: {new Date(item.diagnosedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC',
                          })}
                        </p>
                      )}
                      {item.description && (
                        <p className="mt-3 border-t border-slate-100 pt-3 text-xs font-medium leading-relaxed text-slate-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-100 bg-slate-50/30 p-10 text-center">
                  <AlertCircle className="mx-auto h-6 w-6 text-slate-300" />
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    No medical history entries found.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'allergies' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Allergies
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Patient-declared allergies from their medical profile.
                </p>
              </div>

              {(patient.allergies ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(patient.allergies ?? []).map((allergy) => (
                    <span
                      key={allergy.id}
                      className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600"
                    >
                      {allergy.name}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-100 bg-slate-50/30 p-10 text-center">
                  <AlertCircle className="mx-auto h-6 w-6 text-slate-300" />
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    No allergies listed.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
