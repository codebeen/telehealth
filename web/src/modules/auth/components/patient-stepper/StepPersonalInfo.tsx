'use client';

import React from 'react';
import { User, Calendar, Phone, MapPin, Activity, AlertCircle, Heart } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';
import { StepperTitle } from '@/components/ui/StepperTitle';
import { ProfilePictureUploader } from '@/components/ui/ProfilePictureUploader';

interface StepPersonalInfoProps {
  profilePicture: string;
  setProfilePicture: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  middleName: string;
  setMiddleName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  suffix: string;
  setSuffix: (val: string) => void;
  birthDate: string;
  setBirthDate: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  streetLine1: string;
  setStreetLine1: (val: string) => void;
  streetLine2: string;
  setStreetLine2: (val: string) => void;
  barangay: string;
  setBarangay: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  province: string;
  setProvince: (val: string) => void;
  zipCode: string;
  setZipCode: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  weight: string;
  setWeight: (val: string) => void;
  height: string;
  setHeight: (val: string) => void;
  bloodType: string;
  setBloodType: (val: string) => void;
  emergencyContactName: string;
  setEmergencyContactName: (val: string) => void;
  emergencyContactNumber: string;
  setEmergencyContactNumber: (val: string) => void;
  errors: Record<string, string>;
}

export default function StepPersonalInfo({
  profilePicture,
  setProfilePicture,
  firstName,
  setFirstName,
  middleName,
  setMiddleName,
  lastName,
  setLastName,
  suffix,
  setSuffix,
  birthDate,
  setBirthDate,
  gender,
  setGender,
  phoneNumber,
  setPhoneNumber,
  streetLine1,
  setStreetLine1,
  streetLine2,
  setStreetLine2,
  barangay,
  setBarangay,
  city,
  setCity,
  province,
  setProvince,
  zipCode,
  setZipCode,
  country,
  setCountry,
  weight,
  setWeight,
  height,
  setHeight,
  bloodType,
  setBloodType,
  emergencyContactName,
  setEmergencyContactName,
  emergencyContactNumber,
  setEmergencyContactNumber,
  errors
}: StepPersonalInfoProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <StepperTitle step={2} title="Profile Details & Vitals" description="Provide your personal details, address, and medical parameters" />

      <ProfilePictureUploader value={profilePicture} onChange={setProfilePicture} />

      {/* Sub-section: General */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-1">
          <User className="h-3.5 w-3.5" /> General Info
        </h4>
        
        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            placeholder="Jane"
            required
          />
          <TextField
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
            placeholder="Smith"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="Middle Name"
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            error={errors.middleName}
            placeholder="Marie"
          />
          <TextField
            label="Suffix"
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            error={errors.suffix}
            placeholder="Jr., III"
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="Birth Date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            icon={Calendar}
            error={errors.birthDate}
            required
          />
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 tracking-wider">
              Gender
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`block w-full h-11 rounded-xl border px-3 text-xs font-medium text-brand-text outline-hidden bg-white ${
                errors.gender 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-slate-200 focus:border-primary/30 focus:ring-primary/30'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-[11px] font-semibold text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" /> {errors.gender}
              </p>
            )}
          </div>
        </div>

        <TextField
          label="Phone Number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          icon={Phone}
          error={errors.phoneNumber}
          placeholder="0917 123 4567"
          required
        />
      </div>

      {/* Sub-section: Address */}
      <div className="space-y-4 pt-4 border-t border-slate-50">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-1">
          <MapPin className="h-3.5 w-3.5" /> Address details
        </h4>
        
        <TextField
          label="Street Address"
          type="text"
          value={streetLine1}
          onChange={(e) => setStreetLine1(e.target.value)}
          error={errors.streetLine1}
          placeholder="123 Health Ave"
          required
        />

        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="Street Address 2 (Optional)"
            type="text"
            value={streetLine2}
            onChange={(e) => setStreetLine2(e.target.value)}
            error={errors.streetLine2}
            placeholder="Apt 4B"
          />
          <TextField
            label="Barangay"
            type="text"
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
            error={errors.barangay}
            placeholder="Brgy. San Lorenzo"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="City / Municipality"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={errors.city}
            placeholder="Makati City"
            required
          />
          <TextField
            label="Province"
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            error={errors.province}
            placeholder="Metro Manila"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="Zip Code"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            error={errors.zipCode}
            placeholder="1223"
            required
          />
          <TextField
            label="Country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            error={errors.country}
            placeholder="Philippines"
            required
          />
        </div>
      </div>

      {/* Sub-section: Vitals */}
      <div className="space-y-4 pt-4 border-t border-slate-50">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-1">
          <Activity className="h-3.5 w-3.5" /> Medical Details / Vitals
        </h4>

        <div className="grid grid-cols-3 gap-3">
          <TextField
            label="Weight (kg)"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            error={errors.weight}
            placeholder="60.5"
            required
          />
          <TextField
            label="Height (cm)"
            type="number"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            error={errors.height}
            placeholder="165.0"
            required
          />
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 tracking-wider">
              Blood Type
            </label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="block w-full h-11 rounded-xl border border-slate-200 px-3 text-xs font-medium text-brand-text outline-hidden bg-white focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
            >
              <option value="">Unknown</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub-section: Emergency Contact */}
      <div className="space-y-4 pt-4 border-t border-slate-50">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-1">
          <Heart className="h-3.5 w-3.5 text-rose-500" /> Emergency Contact
        </h4>
        
        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="Contact Name"
            type="text"
            value={emergencyContactName}
            onChange={(e) => setEmergencyContactName(e.target.value)}
            error={errors.emergencyContactName}
            placeholder="John Smith"
          />
          <TextField
            label="Contact Number"
            type="tel"
            value={emergencyContactNumber}
            onChange={(e) => setEmergencyContactNumber(e.target.value)}
            icon={Phone}
            error={errors.emergencyContactNumber}
            placeholder="0917 765 4321"
          />
        </div>
      </div>
    </div>
  );
}
