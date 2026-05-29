'use client';

import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { MedicalHistoryItem } from '../types/medicalRecord';

interface MedicalHistoryListProps {
  historyList: MedicalHistoryItem[];
  setHistoryList: React.Dispatch<React.SetStateAction<MedicalHistoryItem[]>>;
}

export default function MedicalHistoryList({ 
  historyList, 
  setHistoryList
}: MedicalHistoryListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCondition, setNewCondition] = useState({
    conditionName: '',
    diagnosedDate: '',
    status: 'ACTIVE' as 'ACTIVE' | 'RESOLVED',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newCondition.conditionName.trim()) {
      newErrors.conditionName = 'Condition name is required';
    }
    if (!newCondition.diagnosedDate) {
      newErrors.diagnosedDate = 'Diagnosed date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newItem: MedicalHistoryItem = {
      id: `MH-${Date.now()}`,
      conditionName: newCondition.conditionName.trim(),
      diagnosedDate: newCondition.diagnosedDate,
      status: newCondition.status,
      description: newCondition.description.trim(),
    };

    setHistoryList([newItem, ...historyList]);
    setNewCondition({
      conditionName: '',
      diagnosedDate: '',
      status: 'ACTIVE',
      description: '',
    });
    setShowAddForm(false);
    setErrors({});
    setSuccessMessage(`"${newItem.conditionName}" successfully added to your medical history.`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleRemoveCondition = (id: string, name: string) => {
    setHistoryList(historyList.filter((item) => item.id !== id));
    setSuccessMessage(`"${name}" removed from your medical history.`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Patient Medical History</h3>
          <p className="text-xs font-semibold text-slate-650">
            Review and update medical conditions and diagnoses filled during registration.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setErrors({});
          }}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            showAddForm
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-650'
              : 'bg-primary hover:bg-primary-dark text-white shadow-xs'
          }`}
        >
          <Plus className={`h-4 w-4 transition-transform duration-200 ${showAddForm ? 'rotate-45' : ''}`} />
          {showAddForm ? 'Cancel' : 'Add Condition'}
        </button>
      </div>

      {/* Success Alert Banner */}
      {showSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-500/20 p-3.5 flex items-center gap-2 text-xs text-emerald-600 font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Collapsible Form for New Condition */}
      {showAddForm && (
        <form
          onSubmit={handleAddCondition}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4 animate-in slide-in-from-top-3 duration-250"
        >
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide border-b border-slate-50 pb-2">
            Record Pre-existing Condition
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Condition Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 tracking-wider">Condition Name</label>
              <input
                type="text"
                placeholder="e.g. Asthma, Diabetes, GERD"
                value={newCondition.conditionName}
                onChange={(e) => setNewCondition({ ...newCondition, conditionName: e.target.value })}
                className={`block w-full h-10.5 rounded-xl border px-3.5 text-xs font-semibold text-brand-text bg-white outline-hidden focus:ring-1 transition-all ${
                  errors.conditionName
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-primary/30 focus:ring-primary/20'
                }`}
              />
              {errors.conditionName && <p className="text-[10px] text-rose-500 font-semibold">{errors.conditionName}</p>}
            </div>

            {/* Diagnosed Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 tracking-wider">Date Diagnosed</label>
              <input
                type="date"
                value={newCondition.diagnosedDate}
                onChange={(e) => setNewCondition({ ...newCondition, diagnosedDate: e.target.value })}
                className={`block w-full h-10.5 rounded-xl border px-3.5 text-xs font-semibold text-brand-text bg-white outline-hidden focus:ring-1 transition-all ${
                  errors.diagnosedDate
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-primary/30 focus:ring-primary/20'
                }`}
              />
              {errors.diagnosedDate && <p className="text-[10px] text-rose-500 font-semibold">{errors.diagnosedDate}</p>}
            </div>

            {/* Status Option */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 tracking-wider">Status</label>
              <select
                value={newCondition.status}
                onChange={(e) => setNewCondition({ ...newCondition, status: e.target.value as 'ACTIVE' | 'RESOLVED' })}
                className="block w-full h-10.5 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 tracking-wider">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Provide medication details, triggers, severity, or surgical info..."
              value={newCondition.description}
              onChange={(e) => setNewCondition({ ...newCondition, description: e.target.value })}
              className="block w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setErrors({});
              }}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              Save to Medical History
            </button>
          </div>
        </form>
      )}

      {/* History Items Cards */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Diagnosed Conditions</h4>

        {historyList.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-100 rounded-2xl space-y-1">
            <AlertCircle className="h-6 w-6 text-slate-350 mx-auto" />
            <p className="text-xs text-slate-400 font-bold">No history entries registered.</p>
            <p className="text-[10px] text-slate-405">Click the "Add Condition" button above to add records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {historyList.map((item) => (
              <div
                key={item.id}
                className="group relative border border-slate-100/90 hover:border-slate-150 rounded-2xl p-4.5 bg-slate-50/20 hover:bg-slate-50/50 transition-all duration-200"
              >
                {/* Delete button in absolute position */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => handleRemoveCondition(item.id, item.conditionName)}
                    className="p-1.5 rounded-lg text-slate-350 hover:text-rose-500 hover:bg-rose-50/70 transition-all cursor-pointer"
                    title="Remove condition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 pr-8">
                  {/* Name and Status Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-800 leading-snug group-hover:text-primary transition-colors">
                      {item.conditionName}
                    </h4>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-slate-100 text-slate-500 border-slate-200/50'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Diagnosed Date: {new Date(item.diagnosedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC'
                    })}</span>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs font-medium text-slate-600 leading-relaxed pt-1.5 border-t border-slate-100/40 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
