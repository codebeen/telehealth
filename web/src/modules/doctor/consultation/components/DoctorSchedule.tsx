'use client';

import { Edit2 } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function DoctorSchedule() {
  const shifts = [
    { day: 'Monday', hours: '09:00 AM - 06:00 PM', status: 'Active Shift' },
    { day: 'Tuesday', hours: '09:00 AM - 06:00 PM', status: 'Active Shift' },
    { day: 'Wednesday', hours: '09:00 AM - 06:00 PM', status: 'Active Shift' },
    { day: 'Thursday', hours: '09:00 AM - 01:00 PM', status: 'Half Day' },
    { day: 'Friday', hours: '09:00 AM - 06:00 PM', status: 'Active Shift' },
    { day: 'Saturday', hours: 'Closed', status: 'Off Duty' },
    { day: 'Sunday', hours: 'Closed', status: 'Off Duty' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Duty Shift & Schedule"
        description="Configure your shift hours and telehealth availability slots."
        action={
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <Edit2 className="h-3.5 w-3.5" /> Adjust Shift Settings
          </button>
        }
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="space-y-4">
          {shifts.map((shift) => (
            <div key={shift.day} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 last:pb-0">
              <span className="font-bold text-brand-text text-sm">{shift.day}</span>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="text-slate-500">{shift.hours}</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                  shift.status === 'Active Shift' 
                    ? 'bg-accent-light text-accent' 
                    : shift.status === 'Half Day'
                      ? 'bg-primary-light text-primary'
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  {shift.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
