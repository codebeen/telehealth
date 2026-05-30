'use client';

import React, { useEffect, useState } from 'react';
import { Award, FileText, Stethoscope, AlertCircle, Check } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';
import { StepperTitle } from '@/components/ui/StepperTitle';
import { getSpecializations } from '@/modules/auth/services/auth.service';

interface StepSpecializationProps {
  licenseNumber: string;
  setLicenseNumber: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  specializations: string[];
  setSpecializations: (val: string[]) => void;
  errors: Record<string, string>;
}

export default function StepSpecialization({
  licenseNumber,
  setLicenseNumber,
  bio,
  setBio,
  specializations,
  setSpecializations,
  errors
}: StepSpecializationProps) {
  const [specializationsList, setSpecializationsList] = useState<string[]>([
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Dermatology',
    'Psychiatry',
    'Neurology',
    'Orthopedics',
    'Internal Medicine',
    'Obstetrics and Gynecology',
    'Ophthalmology'
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const fetchSpecializations = async () => {
      setIsLoading(true);
      try {
        const data = await getSpecializations();
        if (active && Array.isArray(data)) {
          const names = data.map((spec: any) => spec.name);
          if (names.length > 0) {
            setSpecializationsList(names);
          }
        }
      } catch (err) {
        console.error('Failed to fetch specializations:', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchSpecializations();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleSpecialization = (spec: string) => {
    if (specializations.includes(spec)) {
      setSpecializations(specializations.filter((s) => s !== spec));
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <StepperTitle step={3} title="Professional & Specialization" description="Enter your professional credentials and practice details" />

      <div className="space-y-4">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-1">
          <Stethoscope className="h-3.5 w-3.5" /> Professional Details
        </h4>

        <div className="grid grid-cols-1 gap-3.5">
          <TextField
            label="Medical License Number"
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            icon={Award}
            error={errors.licenseNumber}
            placeholder="LIC-1234567"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-600 tracking-wider">
            Specializations (Select all that apply)
            <span className="text-red-500 ml-1 font-bold">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50/30">
            {isLoading ? (
              <div className="col-span-2 flex items-center justify-center p-6 text-xs text-slate-400 gap-2">
                <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Loading specializations...
              </div>
            ) : (
              specializationsList.map((spec) => {
                const isSelected = specializations.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => handleToggleSpecialization(spec)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all text-left outline-hidden ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{spec}</span>
                    {isSelected && (
                      <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-white shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
          {errors.specializations && (
            <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" /> {errors.specializations}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-600 tracking-wider">
            Professional Bio
          </label>
          <div className="relative">
            <span className="absolute top-3 left-3.5 text-slate-400 pointer-events-none">
              <FileText className="h-4 w-4" />
            </span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell patients about your medical background, achievements, and approach to care..."
              className={`block w-full rounded-xl border pl-10 pr-3.5 py-3 text-xs font-medium text-brand-text outline-hidden resize-none focus:ring-1 transition-all ${
                errors.bio 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-slate-200 focus:border-primary/30 focus:ring-primary/30'
              }`}
            />
          </div>
          {errors.bio && (
            <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" /> {errors.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
