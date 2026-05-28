'use client';

import React from 'react';
import { AlertCircle, User } from 'lucide-react';
import { StepperTitle } from '@/components/ui/StepperTitle';

interface MedicalHistoryItem {
  id: string;
  conditionName: string;
  diagnosedDate: string;
  status: 'ACTIVE' | 'RESOLVED';
  description: string;
}

interface StepReviewSubmitProps {
  email: string;
  profilePicture: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  streetLine1: string;
  streetLine2: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  weight: string;
  height: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  medicalHistories: MedicalHistoryItem[];
  isAgreed: boolean;
  setIsAgreed: (val: boolean) => void;
  errors: Record<string, string>;
}

export default function StepReviewSubmit({
  email,
  profilePicture,
  firstName,
  middleName,
  lastName,
  suffix,
  birthDate,
  gender,
  phoneNumber,
  streetLine1,
  streetLine2,
  barangay,
  city,
  province,
  zipCode,
  country,
  weight,
  height,
  bloodType,
  emergencyContactName,
  emergencyContactNumber,
  medicalHistories,
  isAgreed,
  setIsAgreed,
  errors
}: StepReviewSubmitProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <StepperTitle step={4} title="Review Your Details" description="Review all information carefully before creating your profile" />

      {/* Section: Account */}
      <div className="p-4 border border-slate-100 rounded-xl space-y-2">
        <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Account Credentials</h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-medium">
          <span className="text-slate-400">Email Address:</span>
          <span className="text-brand-text truncate">{email}</span>
        </div>
      </div>

      {/* Section: Profile */}
      <div className="p-4 border border-slate-100 rounded-xl space-y-3">
        <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Personal Information</h4>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {profilePicture ? (
            <img src={profilePicture} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-slate-100 shrink-0 shadow-xs" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <User className="h-7 w-7 text-slate-350" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium flex-1 w-full">
            <div className="flex justify-between sm:grid sm:grid-cols-2 gap-2 border-b border-slate-50/50 pb-1 sm:border-0 sm:pb-0">
              <span className="text-slate-400">Full Name:</span>
              <span className="text-brand-text truncate">
                {firstName} {middleName ? `${middleName} ` : ''}{lastName}{suffix ? `, ${suffix}` : ''}
              </span>
            </div>
            <div className="flex justify-between sm:grid sm:grid-cols-2 gap-2 border-b border-slate-50/50 pb-1 sm:border-0 sm:pb-0">
              <span className="text-slate-400">Birth Date:</span>
              <span className="text-brand-text">{birthDate}</span>
            </div>
            <div className="flex justify-between sm:grid sm:grid-cols-2 gap-2 border-b border-slate-50/50 pb-1 sm:border-0 sm:pb-0">
              <span className="text-slate-400">Gender:</span>
              <span className="text-brand-text">{gender}</span>
            </div>
            <div className="flex justify-between sm:grid sm:grid-cols-2 gap-2 border-b border-slate-50/50 pb-1 sm:border-0 sm:pb-0">
              <span className="text-slate-400">Phone Number:</span>
              <span className="text-brand-text">{phoneNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Address */}
      <div className="p-4 border border-slate-100 rounded-xl space-y-2">
        <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Address</h4>
        <div className="text-xs font-medium text-brand-text leading-relaxed">
          {streetLine1}
          {streetLine2 && `, ${streetLine2}`}
          {barangay && `, ${barangay}`}
          <br />
          {city}{province && `, ${province}`}{zipCode && ` ${zipCode}`}
          <br />
          {country}
        </div>
      </div>

      {/* Section: Vitals & Emergency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border border-slate-100 rounded-xl space-y-2.5">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Vitals & Health</h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <span className="text-slate-400">Weight:</span>
            <span className="text-brand-text">{weight ? `${weight} kg` : 'N/A'}</span>
            <span className="text-slate-400">Height:</span>
            <span className="text-brand-text">{height ? `${height} cm` : 'N/A'}</span>
            <span className="text-slate-400">Blood Type:</span>
            <span className="text-brand-text">{bloodType || 'N/A'}</span>
          </div>
        </div>

        <div className="p-4 border border-slate-100 rounded-xl space-y-2.5">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Emergency Contact</h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <span className="text-slate-400">Contact Name:</span>
            <span className="text-brand-text truncate">{emergencyContactName || 'N/A'}</span>
            <span className="text-slate-400">Contact Number:</span>
            <span className="text-brand-text">{emergencyContactNumber || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Section: Medical History */}
      <div className="p-4 border border-slate-100 rounded-xl space-y-3">
        <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Medical History</h4>
        {medicalHistories.length === 0 ? (
          <p className="text-xs text-slate-400 font-semibold italic">No conditions declared.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {medicalHistories.map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                <div className="flex justify-between items-center font-bold text-brand-text">
                  <span>{item.conditionName}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] ${
                    item.status === 'ACTIVE' 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
                {item.diagnosedDate && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Diagnosed: {item.diagnosedDate}</p>
                )}
                {item.description && (
                  <p className="text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agreement */}
      <div className="pt-2">
        <div className="flex items-start">
          <input
            id="terms-agreed"
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="h-4 w-4 mt-0.5 rounded-sm border-slate-300 text-primary focus:ring-primary"
          />
          <label htmlFor="terms-agreed" className="ml-2 block text-xs font-semibold text-slate-500 leading-normal">
            I declare that all details provided here are true and correct. I agree to the{' '}
            <a href="#" className="font-bold text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="font-bold text-primary hover:underline">Privacy Policy</a>.
          </label>
        </div>
        {errors.agreement && (
          <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" /> {errors.agreement}
          </p>
        )}
      </div>
    </div>
  );
}
