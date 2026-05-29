import React from 'react';
import { Heart, Calendar, Clock, Sparkles } from 'lucide-react';
import { Doctor } from '../types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
  onBookClick: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onBookClick }: DoctorCardProps) {
  // Simple state for favorite toggle (purely visual for client interaction)
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col justify-between h-full min-h-[300px]">
      <div className="space-y-4">
        {/* Profile Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary-light text-primary flex items-center justify-center font-black text-base shadow-xs shrink-0">
              {doctor.avatar}
            </div>
            <div>
              <h4 className="font-bold text-brand-text text-sm group-hover:text-primary transition-colors leading-snug">
                {doctor.name}
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {doctor.specialty} · {doctor.experience} experience
              </p>
            </div>
          </div>
        </div>


        {/* Symptom Tags */}
        <div className="space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Treats:</p>
          <div className="flex flex-wrap gap-1">
            {doctor.symptoms.map((symptom, idx) => (
              <span
                key={idx}
                className="text-[9px] font-bold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>

        {/* Schedule Summary Status */}
        <div className="text-[11px] space-y-1.5 bg-slate-50/40 p-3 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" /> Next Slot
            </span>
            <span className="font-bold text-brand-text">{doctor.availability}</span>
          </div>

        </div>
      </div>

      {/* Book Actions */}
      <div className="border-t border-slate-50 pt-4 mt-4 flex">
        <button
          onClick={() => onBookClick(doctor)}
          className="flex-1 text-center rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-colors cursor-pointer"
        >
          Book Consultation
        </button>
      </div>
    </div>
  );
}
