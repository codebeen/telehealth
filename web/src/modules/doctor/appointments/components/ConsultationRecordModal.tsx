'use client';

import React, { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { DoctorAppointment } from '../types/appointment';
import { CompleteAppointmentPayload } from '../services/doctorAppointmentService';

interface ConsultationRecordModalProps {
  appointment: DoctorAppointment;
  isSubmitting: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: CompleteAppointmentPayload) => Promise<void>;
}

export default function ConsultationRecordModal({
  appointment,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: ConsultationRecordModalProps) {
  const [form, setForm] = useState<CompleteAppointmentPayload>({
    consultationType: appointment.consultationType || appointment.type || '',
    clinicalFindings: '',
    recommendations: '',
    medicationPrescriptions: '',
    finalSummary: '',
  });
  const [localError, setLocalError] = useState('');

  const updateField = (field: keyof CompleteAppointmentPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setLocalError('');
  };

  const handleSubmit = async () => {
    if (!form.consultationType.trim() || !form.clinicalFindings.trim() || !form.recommendations.trim()) {
      setLocalError('Consultation type, clinical findings, and recommendations are required.');
      return;
    }

    await onSubmit({
      consultationType: form.consultationType.trim(),
      clinicalFindings: form.clinicalFindings.trim(),
      recommendations: form.recommendations.trim(),
      medicationPrescriptions: form.medicationPrescriptions?.trim() || undefined,
      finalSummary: form.finalSummary?.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-brand-text">
              Document New Consultation
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
            <p className="text-xs font-bold text-brand-text">{appointment.patient}</p>
            <p className="mt-1 text-[10px] font-semibold text-slate-400">
              {appointment.date} · {appointment.time}
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-bold text-slate-700">
              Consultation Type <span className="text-rose-500">*</span>
            </span>
            <input
              value={form.consultationType}
              onChange={(event) => updateField('consultationType', event.target.value)}
              placeholder="e.g. Cardio Follow-up, Routine Review"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-brand-text outline-hidden transition-all placeholder:text-slate-300 focus:border-primary"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-700">
                Clinical Findings <span className="text-rose-500">*</span>
              </span>
              <textarea
                value={form.clinicalFindings}
                onChange={(event) => updateField('clinicalFindings', event.target.value)}
                placeholder="Enter physical examination details, symptoms, and diagnoses..."
                className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/30 p-4 text-xs font-semibold text-brand-text outline-hidden transition-all placeholder:text-slate-300 focus:border-primary focus:bg-white"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-700">
                Recommendations & Advice <span className="text-rose-500">*</span>
              </span>
              <textarea
                value={form.recommendations}
                onChange={(event) => updateField('recommendations', event.target.value)}
                placeholder="Enter patient advice, exercise guidelines, nutrition changes..."
                className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/30 p-4 text-xs font-semibold text-brand-text outline-hidden transition-all placeholder:text-slate-300 focus:border-primary focus:bg-white"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-bold text-slate-700">Medication & Prescriptions</span>
            <textarea
              value={form.medicationPrescriptions}
              onChange={(event) => updateField('medicationPrescriptions', event.target.value)}
              placeholder="e.g. Lisinopril 10mg - 1 tablet daily (or specify none)"
              className="h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/30 p-4 text-xs font-semibold text-brand-text outline-hidden transition-all placeholder:text-slate-300 focus:border-primary focus:bg-white"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold text-slate-700">Final Consultation Summary</span>
            <textarea
              value={form.finalSummary}
              onChange={(event) => updateField('finalSummary', event.target.value)}
              placeholder="Enter a brief summary statement for fast record lookups..."
              className="h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/30 p-4 text-xs font-semibold text-brand-text outline-hidden transition-all placeholder:text-slate-300 focus:border-primary focus:bg-white"
            />
          </label>

          {(localError || error) && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-xs font-bold text-rose-600">
              {localError || error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/15 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            <Check className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
}
