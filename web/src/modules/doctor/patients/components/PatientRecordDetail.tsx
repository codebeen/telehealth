'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList } from 'lucide-react';

import { PatientRecord, ConsultationSession } from '../types/patient';
import { PATIENT_DATA, persistPatientData } from '../types/patientData';
import PatientProfile from './PatientProfile';
import ConsultationHistory from './ConsultationHistory';
import ConsultationForm from './ConsultationForm';

interface PatientRecordDetailProps {
  patientId: string;
}

export default function PatientRecordDetail({ patientId }: PatientRecordDetailProps) {
  const router = useRouter();

  // Bootstrap from shared seed — in a real app this would be fetched by patientId
  const initial = PATIENT_DATA.find((p) => p.id === patientId) ?? null;
  const [patient, setPatient] = useState<PatientRecord | null>(initial);

  // Add-new form state
  const [showForm, setShowForm] = useState(!initial || initial.history.length === 0);
  const [formType, setFormType] = useState('');
  const [formFindings, setFormFindings] = useState('');
  const [formRecommendations, setFormRecommendations] = useState('');
  const [formPrescriptions, setFormPrescriptions] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

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

  function handleUpdateSession(updated: ConsultationSession) {
    // Persist changes to mock db in-memory array and localStorage
    const patientIndex = PATIENT_DATA.findIndex((p) => p.id === patientId);
    if (patientIndex !== -1) {
      PATIENT_DATA[patientIndex].history = PATIENT_DATA[patientIndex].history.map((s) =>
        s.id === updated.id ? updated : s,
      );
      persistPatientData();
    }

    setPatient((prev) =>
      prev
        ? { ...prev, history: prev.history.map((s) => (s.id === updated.id ? updated : s)) }
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
            No patient exists with ID &ldquo;{patientId}&rdquo;.
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
          {patient.history.length > 0 ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
