'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Plus, Trash2, Calendar, CheckCircle2, AlertCircle, Pencil, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MedicalHistoryItem } from '../types/medicalRecord';
import {
  addPatientMedicalHistory,
  removePatientMedicalHistory,
  updatePatientMedicalHistory,
} from '../services/medicalHistory.service';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCondition, setEditCondition] = useState({
    conditionName: '',
    diagnosedDate: '',
    status: 'ACTIVE' as 'ACTIVE' | 'RESOLVED',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(historyList.length / recordsPerPage));
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return historyList.slice(start, start + recordsPerPage);
  }, [currentPage, historyList]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

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

  const handleAddCondition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newItem = await addPatientMedicalHistory({
        conditionName: newCondition.conditionName.trim(),
        diagnosedDate: newCondition.diagnosedDate,
        status: newCondition.status,
        description: newCondition.description.trim(),
      });

      setHistoryList((prev) => [newItem, ...prev]);
      setCurrentPage(1);
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
    } catch (err: any) {
      const message = err.response?.data?.message;
      setErrors({ form: Array.isArray(message) ? message[0] : message || 'Failed to save condition' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (item: MedicalHistoryItem) => {
    setEditingId(item.id);
    setEditCondition({
      conditionName: item.conditionName,
      diagnosedDate: item.diagnosedDate,
      status: item.status,
      description: item.description,
    });
    setErrors({});
  };

  const handleSaveEdit = async (id: string) => {
    if (!editCondition.conditionName.trim()) {
      setErrors({ edit: 'Condition name is required' });
      return;
    }

    setSavingId(id);
    setErrors({});
    try {
      const updated = await updatePatientMedicalHistory(id, {
        conditionName: editCondition.conditionName.trim(),
        diagnosedDate: editCondition.diagnosedDate,
        status: editCondition.status,
        description: editCondition.description.trim(),
      });
      setHistoryList((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setEditingId(null);
      setSuccessMessage(`"${updated.conditionName}" was updated.`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setErrors({ edit: Array.isArray(message) ? message[0] : message || 'Failed to update condition' });
    } finally {
      setSavingId(null);
    }
  };

  const handleRemoveCondition = async (id: string, name: string) => {
    setRemovingId(id);
    try {
      await removePatientMedicalHistory(id);
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
      setSuccessMessage(`"${name}" removed from your medical history.`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setErrors({ form: Array.isArray(message) ? message[0] : message || 'Failed to remove condition' });
    } finally {
      setRemovingId(null);
    }
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

      {(errors.form || errors.edit) && (
        <div className="rounded-2xl bg-rose-50 border border-rose-500/20 p-3.5 text-xs text-rose-600 font-bold">
          {errors.form || errors.edit}
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
              disabled={isSubmitting}
              className="rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save to Medical History'}
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
            {paginatedHistory.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className="group border border-slate-100/90 hover:border-slate-150 rounded-2xl p-4.5 bg-slate-50/20 hover:bg-slate-50/50 transition-all duration-200"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={editCondition.conditionName}
                          onChange={(e) => setEditCondition({ ...editCondition, conditionName: e.target.value })}
                          className="block w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                          placeholder="Condition name"
                        />
                        <input
                          type="date"
                          value={editCondition.diagnosedDate}
                          onChange={(e) => setEditCondition({ ...editCondition, diagnosedDate: e.target.value })}
                          className="block w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                        <select
                          value={editCondition.status}
                          onChange={(e) => setEditCondition({ ...editCondition, status: e.target.value as 'ACTIVE' | 'RESOLVED' })}
                          className="block w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        value={editCondition.description}
                        onChange={(e) => setEditCondition({ ...editCondition, description: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                        placeholder="Description"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-xl border border-slate-100 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id)}
                          disabled={savingId === item.id}
                          className="rounded-xl bg-primary hover:bg-primary-dark px-3 py-2 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" /> {savingId === item.id ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
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
                          {item.diagnosedDate && (
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>Diagnosed Date: {new Date(item.diagnosedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                timeZone: 'UTC'
                              })}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditing(item)}
                            className="p-1.5 rounded-lg text-slate-350 hover:text-primary hover:bg-primary-light/50 transition-all cursor-pointer"
                            title="Edit condition"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveCondition(item.id, item.conditionName)}
                            disabled={removingId === item.id}
                            className="p-1.5 rounded-lg text-slate-350 hover:text-rose-500 hover:bg-rose-50/70 transition-all cursor-pointer disabled:opacity-40"
                            title="Remove condition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-xs font-medium text-slate-600 leading-relaxed pt-1.5 border-t border-slate-100/40 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-4">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-xl px-3 text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-slate-100 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
