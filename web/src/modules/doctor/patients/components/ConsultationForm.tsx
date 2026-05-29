'use client';

import React from 'react';
import { Check, CheckCircle2, Plus, Pencil } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';

// ── Shared TextAreaField (same as in ConsultationHistory) ──────────────────────
function TextAreaField({
  label,
  required,
  disabled,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  required?: boolean;
  disabled: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-600 tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>
      <textarea
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`block w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-brand-text outline-none focus:ring-1 transition-all resize-none ${
          disabled
            ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
            : 'border-slate-200 bg-white focus:border-primary/30 focus:ring-primary/30'
        }`}
      />
    </div>
  );
}

// ── ConsultationForm ───────────────────────────────────────────────────────────

interface ConsultationFormProps {
  isEditMode: boolean;
  formType: string;
  formFindings: string;
  formRecommendations: string;
  formPrescriptions: string;
  formSummary: string;
  formSuccess: boolean;
  onTypeChange: (v: string) => void;
  onFindingsChange: (v: string) => void;
  onRecommendationsChange: (v: string) => void;
  onPrescriptionsChange: (v: string) => void;
  onSummaryChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ConsultationForm({
  isEditMode,
  formType,
  formFindings,
  formRecommendations,
  formPrescriptions,
  formSummary,
  formSuccess,
  onTypeChange,
  onFindingsChange,
  onRecommendationsChange,
  onPrescriptionsChange,
  onSummaryChange,
  onSubmit,
  onCancel,
}: ConsultationFormProps) {
  const Icon = isEditMode ? Pencil : Plus;
  const title = isEditMode ? 'Edit Consultation Record' : 'Document New Consultation';
  const submitLabel = isEditMode ? 'Save Changes' : 'Save Record';
  let successMessage = '';
  const isReadOnly = !isEditMode;

if (formSuccess) {
  successMessage = isEditMode
    ? 'Consultation record updated successfully.'
    : 'Consultation details successfully documented and saved.';
}

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Section header */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-xs font-bold text-brand-text uppercase tracking-wide">{title}</h4>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Success banner */}
        {formSuccess && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-2.5 text-emerald-800 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Consultation Type */}
          <div className="md:col-span-2">
            <TextField
              id="new-consultation-type"
              label="Consultation Type"
              required
              value={formType}
              onChange={(e) => onTypeChange(e.target.value)}
              placeholder="e.g. Cardio Follow-up, Routine Review"
              disabled={isReadOnly}
            />
          </div>

          {/* Clinical Findings */}
          <TextAreaField
            label="Clinical Findings"
            required
            disabled={isReadOnly}
            value={formFindings}
            onChange={onFindingsChange}
            placeholder="Enter physical examination details, symptoms, and diagnoses..."
            rows={4}
          />

          {/* Recommendations */}
          <TextAreaField
            label="Recommendations & Advice"
            required
            disabled={isReadOnly}
            value={formRecommendations}
            onChange={onRecommendationsChange}
            placeholder="Enter patient advice, exercise guidelines, nutrition changes..."
            rows={4}
          />

          {/* Prescriptions */}
          <div className="md:col-span-2">
            <TextAreaField
              label="Medication & Prescriptions"
              disabled={isReadOnly}
              value={formPrescriptions}
              onChange={onPrescriptionsChange}
              placeholder="e.g. Lisinopril 10mg - 1 tablet daily (or specify none)"
              rows={2}
            />
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <TextAreaField
              label="Final Consultation Summary"
              disabled={isReadOnly}
              value={formSummary}
              onChange={onSummaryChange}
              placeholder="Enter a brief summary statement for fast record lookups..."
              rows={2}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-50">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formSuccess}
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark shadow-md shadow-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Check className="h-4 w-4" /> {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
