'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FileText, Pencil, Check, X, CheckCircle2, Plus } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';
import { ConsultationSession } from '../types/patient';

type SessionDraft = Pick<
  ConsultationSession,
  'type' | 'findings' | 'recommendations' | 'prescriptions' | 'summary'
>;

function sessionToDraft(session: ConsultationSession): SessionDraft {
  return {
    type: session.type,
    findings: session.findings,
    recommendations: session.recommendations,
    prescriptions: isFallbackText(session.prescriptions) ? '' : session.prescriptions,
    summary: isFallbackText(session.summary) ? '' : session.summary,
  };
}

function buildUpdatedSession(session: ConsultationSession, draft: SessionDraft): ConsultationSession {
  return {
    ...session,
    type: draft.type.trim(),
    findings: draft.findings.trim(),
    recommendations: draft.recommendations.trim(),
    prescriptions: draft.prescriptions.trim(),
    summary: draft.summary.trim(),
  };
}

function isFallbackText(value: string) {
  return [
    'None specified.',
    'No medication prescribed.',
    'No summary recorded.',
    'Consultation session updated.',
  ].includes(value.trim());
}

// ── Textarea styled to match TextField ─────────────────────────────────────────
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
  onChange?: (v: string) => void;
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
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        rows={rows}
        className={`block w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-brand-text outline-none focus:ring-1 transition-all resize-none
          ${
            disabled
              ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-default'
              : 'border-slate-200 bg-white focus:border-primary/30 focus:ring-primary/30'
          }`}
      />
    </div>
  );
}

// ── Single session card ────────────────────────────────────────────────────────
interface SessionCardProps {
  session: ConsultationSession;
  onSave: (updated: ConsultationSession) => Promise<void> | void;
}

function SessionCard({ session, onSave }: SessionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<SessionDraft>(() => sessionToDraft(session));
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep draft aligned with parent when not editing (e.g. after save or patient switch)
  useEffect(() => {
    if (!isEditing) {
      setDraft(sessionToDraft(session));
    }
  }, [session, isEditing]);

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  function clearDismissTimer() {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
  }

  function handleEdit() {
    clearDismissTimer();
    setSaveSuccess(false);
    setSaveError('');
    setDraft(sessionToDraft(session));
    setIsEditing(true);
  }

  function handleCancel() {
    clearDismissTimer();
    setSaveSuccess(false);
    setSaveError('');
    setDraft(sessionToDraft(session));
    setIsEditing(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.type.trim() || !draft.findings.trim() || !draft.recommendations.trim()) return;

    const updated = buildUpdatedSession(session, draft);
    setIsSaving(true);
    setSaveError('');

    try {
      await onSave(updated);
      setDraft(sessionToDraft(updated));
      setSaveSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save consultation record:', err);
      setSaveError('We could not save these changes. Please try again.');
    } finally {
      setIsSaving(false);
    }

    dismissTimer.current = setTimeout(() => {
      setSaveSuccess(false);
      dismissTimer.current = null;
    }, 1800);
  }

  const display = isEditing ? draft : session;

  return (
    <div className="relative">
      {/* Timeline dot */}
      <span
        className={`absolute -left-[25.5px] top-4 flex h-2.5 w-2.5 rounded-full border-2 border-white ring-4 ring-white transition-colors ${
          isEditing ? 'bg-primary' : 'bg-slate-200'
        }`}
      />

      <form
        onSubmit={handleSave}
        className={`rounded-2xl border p-5 space-y-5 transition-all duration-200 ${
          isEditing
            ? 'border-primary/30 bg-white shadow-sm'
            : 'border-slate-100 bg-slate-50/60 hover:bg-slate-50'
        }`}
      >
        {/* Card header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              {session.date}
            </p>
            {isEditing ? (
              <TextField
                id={`type-${session.id}`}
                label="Consultation Type"
                required
                value={draft.type}
                onChange={(e) => setDraft((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="e.g. Cardio Follow-up, Routine Review"
                disabled={false}
              />
            ) : (
              <h5 className="font-extrabold text-brand-text text-sm">{session.type}</h5>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-100 rounded-md px-2 py-1">
              {isEditing ? 'Editing' : 'Finalized'}
            </span>
            <button
              type="button"
              onClick={handleEdit}
              disabled={isEditing || isSaving}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:border-primary hover:text-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
          </div>
        </div>

        {/* Save success banner */}
        {saveSuccess && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-2 text-emerald-700 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="text-[11px] font-bold">Record updated successfully.</span>
          </div>
        )}

        {saveError && (
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 flex items-center gap-2 text-rose-700 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-[11px] font-bold">{saveError}</span>
          </div>
        )}

        {/* Fields — same layout as ConsultationForm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Clinical Findings */}
          <TextAreaField
            label="Clinical Findings"
            required
            disabled={!isEditing}
            value={display.findings}
            onChange={
              isEditing
                ? (v) => setDraft((prev) => ({ ...prev, findings: v }))
                : undefined
            }
            placeholder="Enter physical examination details, symptoms, and diagnoses..."
            rows={4}
          />

          {/* Recommendations */}
          <TextAreaField
            label="Recommendations & Advice"
            required
            disabled={!isEditing}
            value={display.recommendations}
            onChange={
              isEditing
                ? (v) => setDraft((prev) => ({ ...prev, recommendations: v }))
                : undefined
            }
            placeholder="Enter patient advice, exercise guidelines, nutrition changes..."
            rows={4}
          />

          {/* Prescriptions */}
          <div className="md:col-span-2">
            <TextAreaField
              label="Medication & Prescriptions"
              disabled={!isEditing}
              value={display.prescriptions}
              onChange={
                isEditing
                  ? (v) => setDraft((prev) => ({ ...prev, prescriptions: v }))
                  : undefined
              }
              placeholder="No medication specified"
              rows={2}
            />
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <TextAreaField
              label="Final Consultation Summary"
              disabled={!isEditing}
              value={display.summary}
              onChange={
                isEditing ? (v) => setDraft((prev) => ({ ...prev, summary: v })) : undefined
              }
              placeholder="No final summary specified"
              rows={2}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="mr-1.5 inline h-3.5 w-3.5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveSuccess || isSaving}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark shadow-md shadow-primary/15 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            >
              <Check className="mr-1.5 inline h-3.5 w-3.5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// ── ConsultationHistory (exported) ────────────────────────────────────────────

interface ConsultationHistoryProps {
  history: ConsultationSession[];
  onUpdateSession: (updated: ConsultationSession) => Promise<void> | void;
  showForm: boolean;
  onAddNew: () => void;
}

export default function ConsultationHistory({
  history,
  onUpdateSession,
  showForm,
  onAddNew,
}: ConsultationHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold text-brand-text uppercase tracking-wide">
            Consultation Records
          </h4>
          <span className="ml-auto text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
            {history.length} {history.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={onAddNew}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark shadow-md transition-all"
          >
            <Plus className="h-4 w-4" /> Add New Consultation
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="relative pl-5 border-l border-slate-100 space-y-6">
        {history.map((session) => (
          <SessionCard key={session.id} session={session} onSave={onUpdateSession} />
        ))}
      </div>
    </div>
  );
}
