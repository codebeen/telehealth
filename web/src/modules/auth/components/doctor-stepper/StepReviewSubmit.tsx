'use client';

import React from 'react';
import { User, Mail, Stethoscope, MapPin, AlertCircle } from 'lucide-react';
import { StepperTitle } from '@/components/ui/StepperTitle';

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
  specializations: string[];
  licenseNumber: string;
  bio: string;
  
  // Address details
  streetLine1: string;
  streetLine2: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  
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
  specializations,
  licenseNumber,
  bio,
  
  streetLine1,
  streetLine2,
  barangay,
  city,
  province,
  zipCode,
  country,
  
  isAgreed,
  setIsAgreed,
  errors
}: StepReviewSubmitProps) {
  const getFullName = () => {
    return `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}${suffix ? ' ' + suffix : ''}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <StepperTitle step={4} title="Review & Submit" description="Verify your information before completing your registration" />

      <div className="space-y-4">
        {/* Section 1: Account details */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <Mail className="h-3.5 w-3.5" /> Account Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400">Email Address</span>
              <p className="font-semibold text-brand-text mt-0.5">{email || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Personal details */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <User className="h-3.5 w-3.5" /> Personal Details
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {profilePicture ? (
              <img src={profilePicture} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-slate-100 shrink-0 shadow-xs" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <User className="h-7 w-7 text-slate-350" />
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs flex-1 w-full">
              <div className="col-span-2">
                <span className="text-slate-400">Full Name</span>
                <p className="font-semibold text-brand-text mt-0.5">{getFullName() || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-slate-400">Birth Date</span>
                <p className="font-semibold text-brand-text mt-0.5">{birthDate || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-slate-400">Gender</span>
                <p className="font-semibold text-brand-text mt-0.5">{gender || 'Not provided'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Phone Number</span>
                <p className="font-semibold text-brand-text mt-0.5">{phoneNumber || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2.5: Address details */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <MapPin className="h-3.5 w-3.5" /> Address Details
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="col-span-2">
              <span className="text-slate-400">Street Address</span>
              <p className="font-semibold text-brand-text mt-0.5">{streetLine1}{streetLine2 ? `, ${streetLine2}` : ''}</p>
            </div>
            <div>
              <span className="text-slate-400">Barangay</span>
              <p className="font-semibold text-brand-text mt-0.5">{barangay || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-slate-400">City / Municipality</span>
              <p className="font-semibold text-brand-text mt-0.5">{city || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-slate-400">Province</span>
              <p className="font-semibold text-brand-text mt-0.5">{province || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-slate-400">Zip Code</span>
              <p className="font-semibold text-brand-text mt-0.5">{zipCode || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-slate-400">Country</span>
              <p className="font-semibold text-brand-text mt-0.5">{country || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Professional details */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <Stethoscope className="h-3.5 w-3.5" /> Professional & Specialization
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <div className="col-span-2">
              <span className="text-slate-400 font-bold block mb-1">Specializations</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {specializations && specializations.length > 0 ? (
                  specializations.map((spec) => (
                    <span key={spec} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {spec}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">None selected</span>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 font-bold block mb-1">License Number</span>
              <p className="font-semibold text-brand-text mt-1">{licenseNumber || 'Not provided'}</p>
            </div>
            <div className="col-span-4">
              <span className="text-slate-400 font-bold block mb-1">Professional Bio</span>
              <p className="font-semibold text-brand-text mt-1 whitespace-pre-wrap break-words">{bio || 'No bio provided'}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Declaration Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className={`h-4.5 w-4.5 rounded-sm mt-0.5 transition-all text-primary focus:ring-primary ${
                errors.agreement ? 'border-red-300' : 'border-slate-350'
              }`}
            />
            <span className="text-xs font-semibold text-slate-500 leading-tight group-hover:text-slate-600 transition-colors select-none">
              I declare that all information submitted is correct, and I agree to the{' '}
              <a href="#" className="font-bold text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-bold text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agreement && (
            <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.agreement}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
