'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, CalendarCheck, Save, RotateCcw, AlertTriangle, Settings2, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { ScheduleTemplateModal, buildDefaultTemplate, WeekTemplate } from './ScheduleTemplateModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeRange {
  id: string;
  start: string;
  end: string;
  isUnavailable?: boolean; // Mark this slot as unavailable (break time)
}

interface DaySchedule {
  available: boolean;
  timeRanges: TimeRange[];
}

type ScheduleMap = Record<string, DaySchedule>; // key = "YYYY-MM-DD"

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DEFAULT_TIME_RANGE = (): TimeRange => ({
  id: crypto.randomUUID(),
  start: '09:00',
  end: '17:00',
});

const formatKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const today = new Date();
today.setHours(0, 0, 0, 0);

const formatDisplayDate = (dateKey: string) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const to12h = (time24: string) => {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

// ─── Overlap detection ────────────────────────────────────────────────────────

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Returns the set of IDs that participate in at least one overlap.
 * Two ranges overlap when one starts before the other ends.
 * Break slots are ignored in overlap detection.
 */
const getOverlappingIds = (ranges: TimeRange[]): Set<string> => {
  const overlapping = new Set<string>();
  // Filter out break slots for overlap detection
  const bookableRanges = ranges.filter(r => !r.isUnavailable);
  for (let i = 0; i < bookableRanges.length; i++) {
    for (let j = i + 1; j < bookableRanges.length; j++) {
      const aStart = toMinutes(bookableRanges[i].start);
      const aEnd   = toMinutes(bookableRanges[i].end);
      const bStart = toMinutes(bookableRanges[j].start);
      const bEnd   = toMinutes(bookableRanges[j].end);
      // Overlap when intervals are not disjoint
      if (aStart < bEnd && bStart < aEnd) {
        overlapping.add(bookableRanges[i].id);
        overlapping.add(bookableRanges[j].id);
      }
    }
  }
  return overlapping;
};

// ─── Seed: pre-populate a realistic weekly template for demo purposes ─────────
const buildInitialSchedule = (): ScheduleMap => {
  const sched: ScheduleMap = {};
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay()); // start of this week (Sunday)

  for (let w = 0; w < 8; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = formatKey(date);
      const dow = date.getDay(); // 0=Sun, 6=Sat
      const isWeekday = dow >= 1 && dow <= 5;
      const isThursday = dow === 4;

      if (isWeekday) {
        sched[key] = {
          available: true,
          timeRanges: isThursday
            ? [{ id: crypto.randomUUID(), start: '09:00', end: '13:00' }]
            : [{ id: crypto.randomUUID(), start: '09:00', end: '18:00' }],
        };
      }
    }
  }
  return sched;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TimeRangeRowProps {
  range: TimeRange;
  index: number;
  canDelete: boolean;
  isOverlapping: boolean;
  onChange: (id: string, field: 'start' | 'end' | 'isUnavailable', value: string | boolean) => void;
  onDelete: (id: string) => void;
}

function TimeRangeRow({ range, index, canDelete, isOverlapping, onChange, onDelete }: TimeRangeRowProps) {
  const slotStatus = range.isUnavailable ? 'unavailable' : 'available';
  
  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[10px] font-bold text-slate-400 w-4 shrink-0">{index + 1}.</span>
      <div className="flex items-center gap-1.5 flex-1">
        <input
          type="time"
          value={range.start}
          onChange={(e) => onChange(range.id, 'start', e.target.value)}
          className={`flex-1 h-8 rounded-lg border px-2 text-xs font-medium text-brand-text outline-none focus:ring-1 transition-all ${
            range.isUnavailable
              ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-400/20 bg-amber-50'
              : isOverlapping
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-400/20 bg-rose-50'
                : 'border-slate-200 focus:border-primary/40 focus:ring-primary/20'
          }`}
        />
        <span className="text-[10px] font-bold text-slate-400 shrink-0">to</span>
        <input
          type="time"
          value={range.end}
          onChange={(e) => onChange(range.id, 'end', e.target.value)}
          className={`flex-1 h-8 rounded-lg border px-2 text-xs font-medium text-brand-text outline-none focus:ring-1 transition-all ${
            range.isUnavailable
              ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-400/20 bg-amber-50'
              : isOverlapping
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-400/20 bg-rose-50'
                : 'border-slate-200 focus:border-primary/40 focus:ring-primary/20'
          }`}
        />
      </div>
      <button
        type="button"
        onClick={() => onChange(range.id, 'isUnavailable', !range.isUnavailable)}
        title={range.isUnavailable ? 'Mark as available' : 'Mark as unavailable'}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
          range.isUnavailable ? 'bg-slate-200' : 'bg-primary'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
            range.isUnavailable ? 'translate-x-0' : 'translate-x-5'
          }`}
        />
      </button>
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(range.id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DoctorSchedule() {
  const [viewYear, setViewYear]     = useState(today.getFullYear());
  const [viewMonth, setViewMonth]   = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(formatKey(today));
  const [schedule, setSchedule]     = useState<ScheduleMap>(buildInitialSchedule);
  const [saved, setSaved]           = useState(false);
  const [template, setTemplate]     = useState<WeekTemplate>(buildDefaultTemplate);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // ── Calendar helpers ───────────────────────────────────────────────────────

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(formatKey(today));
  };

  // ── Schedule mutations ─────────────────────────────────────────────────────

  const getDay = useCallback((key: string): DaySchedule => (
    schedule[key] ?? { available: false, timeRanges: [] }
  ), [schedule]);

  const toggleAvailable = (key: string) => {
    setSchedule(prev => {
      const current = prev[key] ?? { available: false, timeRanges: [] };
      if (!current.available) {
        // Auto-fill from template for that day-of-week if no custom slots yet
        const [y, m, d] = key.split('-').map(Number);
        const dow = new Date(y, m - 1, d).getDay();
        const templateDay = template[dow];
        const defaultRanges = templateDay.available && templateDay.timeRanges.length
          ? templateDay.timeRanges.map(r => ({ ...r, id: crypto.randomUUID() }))
          : [DEFAULT_TIME_RANGE()];
        const ranges = current.timeRanges.length ? current.timeRanges : defaultRanges;
        return { ...prev, [key]: { available: true, timeRanges: ranges } };
      }
      return { ...prev, [key]: { ...current, available: false } };
    });
  };

  const applyTemplateToDate = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    const templateDay = template[dow];
    const ranges = templateDay.available && templateDay.timeRanges.length
      ? templateDay.timeRanges.map(r => ({ ...r, id: crypto.randomUUID() }))
      : [DEFAULT_TIME_RANGE()];
    setSchedule(prev => ({
      ...prev,
      [key]: { available: true, timeRanges: ranges },
    }));
  };

  const addTimeRange = (key: string) => {
    setSchedule(prev => {
      const current = getDay(key);
      return { ...prev, [key]: { ...current, timeRanges: [...current.timeRanges, DEFAULT_TIME_RANGE()] } };
    });
  };

  const updateTimeRange = (key: string, id: string, field: 'start' | 'end' | 'isUnavailable', value: string | boolean) => {
    setSchedule(prev => {
      const current = getDay(key);
      return {
        ...prev,
        [key]: {
          ...current,
          timeRanges: current.timeRanges.map(r => r.id === id ? { ...r, [field]: value } : r),
        },
      };
    });
  };

  const deleteTimeRange = (key: string, id: string) => {
    setSchedule(prev => {
      const current = getDay(key);
      const updated = current.timeRanges.filter(r => r.id !== id);
      return { ...prev, [key]: { ...current, timeRanges: updated } };
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const selectedDay = getDay(selectedDate);

  // Overlap detection for the selected day
  const overlappingIds = useMemo(
    () => getOverlappingIds(selectedDay.timeRanges),
    [selectedDay.timeRanges]
  );
  const hasOverlap = overlappingIds.size > 0;

  // Count available days this month
  const availableThisMonth = Array.from({ length: daysInMonth }, (_, i) => {
    const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    return getDay(key).available;
  }).filter(Boolean).length;

  // Block save if any day has overlapping slots
  const anyDayHasOverlap = useMemo(() => {
    return Object.values(schedule).some(
      (day) => day.available && getOverlappingIds(day.timeRanges).size > 0
    );
  }, [schedule]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Schedule Management"
        description="Manage your availability and consultation time slots."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5" /> Configure Defaults
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Today
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={anyDayHasOverlap}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 ${
                anyDayHasOverlap
                  ? 'bg-slate-300 shadow-none cursor-not-allowed'
                  : saved
                    ? 'bg-accent shadow-accent/20'
                    : 'bg-primary shadow-primary/25 hover:bg-primary-dark hover:scale-[1.02]'
              }`}
            >
              {saved ? (
                <><CalendarCheck className="h-3.5 w-3.5" /> Saved!</>
              ) : (
                <><Save className="h-3.5 w-3.5" /> Save Schedule</>
              )}
            </button>
          </div>
        }
      />

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Available Days', value: availableThisMonth, sub: `this ${MONTHS[viewMonth]}`, color: 'text-primary bg-primary-light' },
          { label: 'Time Slots', value: selectedDay.available ? selectedDay.timeRanges.length : 0, sub: 'for selected date', color: 'text-yellow-600 bg-yellow-100' },
          { label: 'Available Time Slots', value: selectedDay.available ? selectedDay.timeRanges.filter((r) => !r.isUnavailable).length : 0, sub: 'for selected date', color: 'text-green-500 bg-green-100' },
          { label: 'Blocked Days', value: daysInMonth - availableThisMonth, sub: 'unavailable', color: 'text-slate-500 bg-slate-100' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-lg ${s.color} shrink-0`}>
              {s.value}
            </div>
            <div>
              <p className="text-xs font-bold text-brand-text">{s.label}</p>
              <p className="text-[10px] text-slate-400 font-medium">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Calendar + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Calendar ─────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">

          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-extrabold text-brand-text">
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty leading cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Date cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayData = getDay(key);
              const isToday = key === formatKey(today);
              const isSelected = key === selectedDate;
              const isPast = new Date(viewYear, viewMonth, day) < today;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  disabled={isPast}
                  className={`relative flex flex-col items-center justify-center rounded-xl py-2 text-xs font-bold transition-all duration-150 aspect-square
                    ${isSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                      : isToday
                        ? 'bg-primary-light text-primary ring-1 ring-primary/30'
                        : isPast
                          ? 'text-slate-200 cursor-not-allowed'
                          : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span>{day}</span>
                  {/* Availability dot */}
                  {!isPast && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full transition-colors ${
                      dayData.available
                        ? isSelected ? 'bg-white' : 'bg-accent'
                        : 'bg-transparent'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-slate-50 flex items-center gap-5 text-[10px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent inline-block" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary-light ring-1 ring-primary/30 inline-block" /> Today</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> Selected</span>
          </div>
        </div>

        {/* Detail Panel ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col gap-5">

          {/* Date heading */}
          <div className="border-b border-slate-50 pb-4">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Selected Date</p>
            <h3 className="text-sm font-extrabold text-brand-text leading-snug">
              {formatDisplayDate(selectedDate)}
            </h3>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-text">Mark as available</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {selectedDay.available ? 'Patients can book this day' : 'Blocked — no bookings allowed'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleAvailable(selectedDate)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                selectedDay.available ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
                  selectedDay.available ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Time ranges */}
          {selectedDay.available && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Time Slots
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplateToDate(selectedDate)}
                    title="Reset to your configured default template for this day"
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" /> Apply template
                  </button>
                  <button
                    type="button"
                    onClick={() => addTimeRange(selectedDate)}
                    disabled={hasOverlap}
                    title={hasOverlap ? 'Resolve overlapping slots before adding a new one' : undefined}
                    className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${
                      hasOverlap
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-primary hover:text-primary-dark'
                    }`}
                  >
                    <Plus className="h-3 w-3" /> Add slot
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {selectedDay.timeRanges.map((range, idx) => (
                  <TimeRangeRow
                    key={range.id}
                    range={range}
                    index={idx}
                    canDelete={selectedDay.timeRanges.length > 1}
                    isOverlapping={overlappingIds.has(range.id)}
                    onChange={(id, field, value) => updateTimeRange(selectedDate, id, field, value)}
                    onDelete={(id) => deleteTimeRange(selectedDate, id)}
                  />
                ))}
              </div>

              {/* Overlap warning */}
              {hasOverlap && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5 animate-in fade-in duration-200">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-semibold text-rose-600 leading-relaxed">
                    Time slots are overlapping. Please adjust the highlighted ranges so they do not conflict.
                  </p>
                </div>
              )}

              {/* Preview */}
              <div className={`mt-2 rounded-xl p-3 space-y-1.5 ${
                hasOverlap ? 'bg-rose-50' : 'bg-slate-50'
              }`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-wider ${
                  hasOverlap ? 'text-rose-400' : 'text-slate-400'
                }`}>Preview</p>
                {selectedDay.timeRanges.map((r) => (
                  <p key={r.id} className={`text-xs font-semibold flex items-center gap-1.5 ${
                    r.isUnavailable
                      ? 'text-red-600'
                      : overlappingIds.has(r.id)
                        ? 'text-rose-500'
                        : 'text-slate-600'
                  }`}>
                    <Clock className={`h-3 w-3 shrink-0 ${
                      r.isUnavailable
                        ? 'text-red-500'
                        : overlappingIds.has(r.id)
                          ? 'text-rose-400'
                          : 'text-primary'
                    }`} />
                    {to12h(r.start)} – {to12h(r.end)}
                    {r.isUnavailable && (
                      <span className="text-[9px] font-bold text-red-600 bg-red-100 rounded px-1">not available</span>
                    )}
                    {overlappingIds.has(r.id) && !r.isUnavailable && (
                      <span className="text-[9px] font-bold text-rose-400 bg-rose-100 rounded px-1">overlap</span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Unavailable state */}
          {!selectedDay.available && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6 animate-in fade-in duration-200">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <CalendarCheck className="h-5 w-5 text-slate-300" />
              </div>
              <p className="text-xs font-bold text-slate-400">Not available</p>
              <p className="text-[10px] text-slate-300 mt-1 max-w-[140px]">Toggle the switch above to mark this day as available</p>
            </div>
          )}
        </div>
      </div>

      {/* Default Schedule Template Modal */}
      {showTemplateModal && (
        <ScheduleTemplateModal
          template={template}
          onSave={(updated) => {
            setTemplate(updated);
            setShowTemplateModal(false);
          }}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
    </div>
  );
}
