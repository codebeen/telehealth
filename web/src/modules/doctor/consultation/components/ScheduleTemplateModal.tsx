'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TemplateTimeRange {
  id: string;
  start: string;
  end: string;
}

export interface DayTemplate {
  available: boolean;
  timeRanges: TemplateTimeRange[];
}

/** 0=Sun, 1=Mon … 6=Sat */
export type WeekTemplate = Record<number, DayTemplate>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DOW_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DOW_SHORT  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const newRange = (): TemplateTimeRange => ({
  id: crypto.randomUUID(),
  start: '09:00',
  end: '17:00',
});

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const to12h = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const hasOverlap = (ranges: TemplateTimeRange[]) => {
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (
        toMinutes(ranges[i].start) < toMinutes(ranges[j].end) &&
        toMinutes(ranges[j].start) < toMinutes(ranges[i].end)
      ) return true;
    }
  }
  return false;
};

export const buildDefaultTemplate = (): WeekTemplate => ({
  0: { available: false, timeRanges: [] },
  1: { available: true,  timeRanges: [{ id: crypto.randomUUID(), start: '09:00', end: '18:00' }] },
  2: { available: true,  timeRanges: [{ id: crypto.randomUUID(), start: '09:00', end: '18:00' }] },
  3: { available: true,  timeRanges: [{ id: crypto.randomUUID(), start: '09:00', end: '18:00' }] },
  4: { available: true,  timeRanges: [{ id: crypto.randomUUID(), start: '09:00', end: '13:00' }] },
  5: { available: true,  timeRanges: [{ id: crypto.randomUUID(), start: '09:00', end: '18:00' }] },
  6: { available: false, timeRanges: [] },
});

// ─── Modal component ──────────────────────────────────────────────────────────

interface ScheduleTemplateModalProps {
  template: WeekTemplate;
  onSave: (updated: WeekTemplate) => void;
  onClose: () => void;
}

export function ScheduleTemplateModal({ template, onSave, onClose }: ScheduleTemplateModalProps) {
  const [draft, setDraft] = useState<WeekTemplate>(() =>
    // Deep-clone so we don't mutate the live template while editing
    Object.fromEntries(
      Object.entries(template).map(([dow, day]) => [
        dow,
        { ...day, timeRanges: day.timeRanges.map(r => ({ ...r })) },
      ])
    ) as WeekTemplate
  );

  const [selectedDow, setSelectedDow] = useState<number>(1); // default: Monday

  const dayDraft = draft[selectedDow];
  const dayHasOverlap = hasOverlap(dayDraft.timeRanges);
  const anyHasOverlap = Object.values(draft).some(d => d.available && hasOverlap(d.timeRanges));

  // ── Mutations ────────────────────────────────────────────────────────────────

  const toggleDow = (dow: number) => {
    setDraft(prev => {
      const current = prev[dow];
      if (!current.available) {
        return {
          ...prev,
          [dow]: { available: true, timeRanges: current.timeRanges.length ? current.timeRanges : [newRange()] },
        };
      }
      return { ...prev, [dow]: { ...current, available: false } };
    });
  };

  const addSlot = (dow: number) => {
    setDraft(prev => ({
      ...prev,
      [dow]: { ...prev[dow], timeRanges: [...prev[dow].timeRanges, newRange()] },
    }));
  };

  const updateSlot = (dow: number, id: string, field: 'start' | 'end', val: string) => {
    setDraft(prev => ({
      ...prev,
      [dow]: {
        ...prev[dow],
        timeRanges: prev[dow].timeRanges.map(r => r.id === id ? { ...r, [field]: val } : r),
      },
    }));
  };

  const removeSlot = (dow: number, id: string) => {
    setDraft(prev => ({
      ...prev,
      [dow]: { ...prev[dow], timeRanges: prev[dow].timeRanges.filter(r => r.id !== id) },
    }));
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-50">
          <div>
            <h2 className="text-base font-extrabold text-brand-text">Default Schedule Template</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Configure your usual weekly availability. New dates will auto-fill with these defaults.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Day-of-week sidebar */}
          <div className="w-32 border-r border-slate-50 p-3 space-y-1 overflow-y-auto shrink-0">
            {DOW_SHORT.map((label, dow) => {
              const day = draft[dow];
              const conflict = day.available && hasOverlap(day.timeRanges);
              return (
                <button
                  key={dow}
                  onClick={() => setSelectedDow(dow)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    selectedDow === dow
                      ? 'bg-primary text-white'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>{label}</span>
                  {conflict ? (
                    <AlertTriangle className={`h-3 w-3 shrink-0 ${selectedDow === dow ? 'text-white' : 'text-rose-400'}`} />
                  ) : day.available ? (
                    <CheckCircle2 className={`h-3 w-3 shrink-0 ${selectedDow === dow ? 'text-white' : 'text-accent'}`} />
                  ) : (
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${selectedDow === dow ? 'bg-white/40' : 'bg-slate-200'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail pane */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-brand-text">{DOW_LABELS[selectedDow]}</h3>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => toggleDow(selectedDow)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
                  dayDraft.available ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  dayDraft.available ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {dayDraft.available ? (
              <div className="space-y-3">
                {/* Time slot rows */}
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Time Slots
                  </p>
                  <button
                    type="button"
                    onClick={() => addSlot(selectedDow)}
                    disabled={dayHasOverlap}
                    className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${
                      dayHasOverlap ? 'text-slate-300 cursor-not-allowed' : 'text-primary hover:text-primary-dark'
                    }`}
                  >
                    <Plus className="h-3 w-3" /> Add slot
                  </button>
                </div>

                <div className="space-y-2.5">
                  {dayDraft.timeRanges.map((r, idx) => (
                    <div key={r.id} className="flex items-center gap-2 group">
                      <span className="text-[10px] font-bold text-slate-400 w-4 shrink-0">{idx + 1}.</span>
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="time"
                          value={r.start}
                          onChange={(e) => updateSlot(selectedDow, r.id, 'start', e.target.value)}
                          className="flex-1 h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-brand-text outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">to</span>
                        <input
                          type="time"
                          value={r.end}
                          onChange={(e) => updateSlot(selectedDow, r.id, 'end', e.target.value)}
                          className="flex-1 h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-brand-text outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      {dayDraft.timeRanges.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSlot(selectedDow, r.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {dayHasOverlap && (
                  <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-semibold text-rose-600 leading-relaxed">
                      Time slots are overlapping. Adjust them before saving.
                    </p>
                  </div>
                )}

                {/* Preview */}
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Preview</p>
                  {dayDraft.timeRanges.map((r) => (
                    <p key={r.id} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-primary shrink-0" />
                      {to12h(r.start)} – {to12h(r.end)}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <Clock className="h-5 w-5 text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-400">Not available on {DOW_LABELS[selectedDow]}</p>
                <p className="text-[10px] text-slate-300 mt-1">Toggle the switch above to configure this day</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-50">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (!anyHasOverlap) onSave(draft); }}
            disabled={anyHasOverlap}
            className={`rounded-xl px-5 py-2 text-xs font-bold text-white transition-all ${
              anyHasOverlap
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-primary shadow-md shadow-primary/25 hover:bg-primary-dark hover:scale-[1.02]'
            }`}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
