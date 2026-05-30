'use client';

import React, { useState } from 'react';
import { ShieldAlert, Plus, X, CheckCircle2, Pencil, Save } from 'lucide-react';
import {
  addPatientAllergy,
  PatientAllergy,
  removePatientAllergy,
  updatePatientAllergy,
} from '../services/allergy.service';

interface AllergiesListProps {
  allergiesList: PatientAllergy[];
  setAllergiesList: React.Dispatch<React.SetStateAction<PatientAllergy[]>>;
}

export default function AllergiesList({ allergiesList, setAllergiesList }: AllergiesListProps) {
  const [newAllergy, setNewAllergy] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleAddAllergy = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newAllergy.trim();
    if (!trimmed) return;

    if (allergiesList.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Allergy already listed');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const created = await addPatientAllergy(trimmed);
      setAllergiesList((prev) => [...prev, created]);
      setNewAllergy('');
      setSuccessMsg(`"${trimmed}" has been successfully added to your allergies list.`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message[0] : message || 'Failed to save allergy');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAllergy = async (allergy: PatientAllergy) => {
    setRemovingId(allergy.id);
    try {
      await removePatientAllergy(allergy.id);
      setAllergiesList((prev) => prev.filter((a) => a.id !== allergy.id));
      setSuccessMsg(`"${allergy.name}" has been removed from your allergies list.`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message[0] : message || 'Failed to remove allergy');
    } finally {
      setRemovingId(null);
    }
  };

  const handleStartEdit = (allergy: PatientAllergy) => {
    setEditingId(allergy.id);
    setEditName(allergy.name);
    setError('');
  };

  const handleSaveEdit = async (allergy: PatientAllergy) => {
    const trimmed = editName.trim();
    if (!trimmed) {
      setError('Allergy name is required');
      return;
    }
    if (allergiesList.some((a) => a.id !== allergy.id && a.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Allergy already listed');
      return;
    }

    setSavingId(allergy.id);
    setError('');
    try {
      const updated = await updatePatientAllergy(allergy.id, trimmed);
      setAllergiesList((prev) => prev.map((a) => (a.id === allergy.id ? updated : a)));
      setEditingId(null);
      setEditName('');
      setSuccessMsg(`"${updated.name}" has been updated.`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message[0] : message || 'Failed to update allergy');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Patient Allergies Panel</h3>
          <p className="text-xs font-semibold text-slate-650">
            Review and update drug, food, or environmental allergies that you have declared.
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-500/20 p-3.5 flex items-center gap-2 text-xs text-emerald-600 font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-500/20 p-3.5 text-xs text-rose-600 font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Declared Allergies</h4>

          {allergiesList.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl space-y-2">
              <ShieldAlert className="h-8 w-8 text-slate-350 mx-auto" />
              <p className="text-xs text-slate-400 font-bold">No allergies declared.</p>
              <p className="text-[10px] text-slate-405">Use the add form to input any medical or dietary allergies.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allergiesList.map((allergy) => (
                <div
                  key={allergy.id}
                  className="flex items-center justify-between p-3.5 border border-slate-100/90 rounded-2xl bg-slate-50/20 hover:bg-slate-50/50 hover:border-slate-150 hover:shadow-2xs transition-all duration-150"
                >
                  <div className="flex items-center gap-3 pr-2 min-w-0 flex-1">
                    <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-100/60 text-amber-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    {editingId === allergy.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => {
                          setEditName(e.target.value);
                          setError('');
                        }}
                        className="min-w-0 flex-1 h-9 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-brand-text bg-white outline-hidden focus:border-amber-300 focus:ring-1 focus:ring-amber-200 transition-all"
                        placeholder="Allergy name"
                      />
                    ) : (
                      <span className="text-xs font-extrabold text-slate-800 leading-snug">{allergy.name}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {editingId === allergy.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(allergy)}
                          disabled={savingId === allergy.id}
                          className="p-1.5 rounded-lg text-slate-350 hover:text-emerald-600 hover:bg-emerald-50/70 transition-all cursor-pointer disabled:opacity-40"
                          title={`Save ${allergy.name}`}
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditName('');
                            setError('');
                          }}
                          className="p-1.5 rounded-lg text-slate-350 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                          title="Cancel edit"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(allergy)}
                          className="p-1.5 rounded-lg text-slate-350 hover:text-primary hover:bg-primary-light/50 transition-all cursor-pointer"
                          title={`Edit ${allergy.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAllergy(allergy)}
                          disabled={removingId === allergy.id}
                          className="p-1.5 rounded-lg text-slate-350 hover:text-rose-500 hover:bg-rose-50/70 transition-all cursor-pointer disabled:opacity-40"
                          title={`Remove ${allergy.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <form
            onSubmit={handleAddAllergy}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4"
          >
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Record Allergy</h4>
            <p className="text-[10px] text-slate-405 leading-relaxed">
              Input drug sensitivities (e.g. Penicillin), food triggers (e.g. Peanuts), or outdoor allergies (e.g. Pollen).
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Allergy name"
                value={newAllergy}
                onChange={(e) => {
                  setNewAllergy(e.target.value);
                  setError('');
                }}
                className={`block w-full h-10 px-3.5 rounded-xl border text-xs font-semibold text-brand-text bg-white outline-hidden focus:ring-1 transition-all ${
                  error
                    ? 'border-rose-300 focus:border-rose-455 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-amber-300 focus:ring-amber-200'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> {isSubmitting ? 'Saving...' : 'Save Allergy'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
