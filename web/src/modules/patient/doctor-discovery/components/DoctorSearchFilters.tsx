import React from 'react';
import { Search, Activity, Baby, Sparkles, Brain, Stethoscope, X } from 'lucide-react';
import { MedicalNeed } from '../types/doctor';

const iconMap: Record<string, React.ComponentType<any>> = {
  Activity,
  Baby,
  Sparkles,
  Brain,
  Stethoscope,
};

interface DoctorSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (val: string) => void;
  selectedNeedId: string | null;
  setSelectedNeedId: (val: string | null) => void;
  specialties: string[];
  medicalNeeds: MedicalNeed[];
}

export default function DoctorSearchFilters({
  searchTerm,
  setSearchTerm,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedNeedId,
  setSelectedNeedId,
  specialties,
  medicalNeeds,
}: DoctorSearchFiltersProps) {

  const handleNeedClick = (need: MedicalNeed) => {
    if (selectedNeedId === need.id) {
      // Toggle off
      setSelectedNeedId(null);
      setSelectedSpecialty('All');
    } else {
      setSelectedNeedId(need.id);
      setSelectedSpecialty(need.specialty);
    }
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedSpecialty('All');
    setSelectedNeedId(null);
  };

  const hasActiveFilters = searchTerm !== '' || selectedSpecialty !== 'All' || selectedNeedId !== null;

  return (
    <div className="space-y-6">
      {/* Explore by Medical Needs Category list */}
      <div>
        <h3 className="text-xs font-bold text-brand-text mb-3 tracking-wide uppercase">Explore by Medical Need / Symptoms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {medicalNeeds.map((need) => {
            const IconComponent = iconMap[need.iconName] || Stethoscope;
            const isSelected = selectedNeedId === need.id;

            return (
              <button
                key={need.id}
                onClick={() => handleNeedClick(need)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary-light ring-2 ring-primary/20 scale-[1.02]'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                }`}
              >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected ? 'bg-primary text-white' : 'bg-primary-light text-primary'
                }`}>
                  <IconComponent className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-brand-text text-xs leading-tight mb-1">{need.label}</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-normal line-clamp-2">{need.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Control Bar */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-xs font-semibold text-brand-text outline-hidden border border-transparent focus:border-primary/20 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-brand-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right side controls: clear filter */}
          {hasActiveFilters && (
            <div className="flex items-center justify-end w-full lg:w-auto">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 h-10 px-3 rounded-xl border border-rose-100 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Specialization Filter Pills */}
        <div className="border-t border-slate-50 pt-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mr-2 shrink-0">Specialties:</span>
            {specialties.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <button
                  key={spec}
                  onClick={() => {
                    setSelectedSpecialty(spec);
                    setSelectedNeedId(null);
                  }}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-primary text-white shadow-xs shadow-primary/20' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-brand-text'
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
