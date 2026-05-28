'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';
import { StepperTitle } from '@/components/ui/StepperTitle';

interface MedicalHistoryItem {
  id: string;
  conditionName: string;
  diagnosedDate: string;
  status: 'ACTIVE' | 'RESOLVED';
  description: string;
}

interface StepMedicalHistoryProps {
  medicalHistories: MedicalHistoryItem[];
  addMedicalHistory: () => void;
  updateMedicalHistory: (id: string, field: keyof MedicalHistoryItem, value: string) => void;
  removeMedicalHistory: (id: string) => void;
  errors: Record<string, string>;
}

export default function StepMedicalHistory({
  medicalHistories,
  addMedicalHistory,
  updateMedicalHistory,
  removeMedicalHistory,
  errors
}: StepMedicalHistoryProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex justify-between items-center border-b border-slate-50 pb-2 mb-4">
        <StepperTitle 
          step={3} 
          title="Medical History" 
          description="Add any prior medical conditions or diagnoses" 
          className="border-b-0 pb-0"
        />
        <button
          type="button"
          onClick={addMedicalHistory}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary border border-primary/20 rounded-xl bg-primary-light/30 hover:bg-primary-light transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Condition
        </button>
      </div>

      {medicalHistories.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl space-y-2">
          <p className="text-xs text-slate-400 font-semibold">No medical history entries added</p>
          <p className="text-[10px] text-slate-400">If you have no medical records, you can proceed to the next step.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {medicalHistories.map((item, index) => (
            <div key={item.id} className="relative p-4 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-3 animate-in slide-in-from-bottom-2 duration-200">
              <div className="absolute top-3.5 right-3.5">
                <button
                  type="button"
                  onClick={() => removeMedicalHistory(item.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pr-8">
                <TextField
                  label="Condition Name"
                  type="text"
                  value={item.conditionName}
                  onChange={(e) => updateMedicalHistory(item.id, 'conditionName', e.target.value)}
                  error={errors[`condition-${index}`]}
                  placeholder="Asthma, Diabetes, etc."
                  required
                  className="bg-white"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Diagnosed Date"
                    type="date"
                    value={item.diagnosedDate}
                    onChange={(e) => updateMedicalHistory(item.id, 'diagnosedDate', e.target.value)}
                    className="bg-white"
                  />
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 tracking-wider">
                      Status
                    </label>
                    <select
                      value={item.status}
                      onChange={(e) => updateMedicalHistory(item.id, 'status', e.target.value as 'ACTIVE' | 'RESOLVED')}
                      className="block w-full h-11 rounded-xl border border-slate-200 px-2 text-xs font-medium text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 tracking-wider">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateMedicalHistory(item.id, 'description', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-brand-text bg-white outline-hidden focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
                  placeholder="Brief description of treatment, severity, etc."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
