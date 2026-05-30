'use client';

import React, { useState, useEffect } from 'react';
import { Award, Shield, Mail, Phone, Calendar, Heart, MapPin, Briefcase, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { fetchDoctorProfile, updateDoctorProfile, DoctorProfileData } from '../services/profileService';
import { getCurrentDoctorId } from '../../utils/currentDoctor';

export default function DoctorProfile() {
  const [profile, setProfile] = useState<DoctorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    phoneNumber: '',
    gender: '',
    birthDate: '',
    bio: '',
    profilePicture: '',
    address: {
      streetLine1: '',
      streetLine2: '',
      city: '',
      province: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);
        const doctorId = getCurrentDoctorId();
        const data = await fetchDoctorProfile(doctorId);
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch doctor profile:', err);
        setError('We could not load your profile details right now.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Sync Form Data when profile loads or editing state toggles
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.profileDetails.firstName || '',
        middleName: profile.profileDetails.middleName || '',
        lastName: profile.profileDetails.lastName || '',
        suffix: profile.profileDetails.suffix || '',
        phoneNumber: profile.profileDetails.phoneNumber || '',
        gender: profile.profileDetails.gender || '',
        birthDate: profile.profileDetails.birthDate ? profile.profileDetails.birthDate.split('T')[0] : '',
        bio: profile.bio || '',
        profilePicture: profile.profileDetails.profilePicture || '',
        address: {
          streetLine1: profile.profileDetails.address?.streetLine1 || '',
          streetLine2: profile.profileDetails.address?.streetLine2 || '',
          city: profile.profileDetails.address?.city || '',
          province: profile.profileDetails.address?.province || '',
          zipCode: profile.profileDetails.address?.zipCode || '',
          country: profile.profileDetails.address?.country || 'Philippines'
        }
      });
    }
  }, [profile, isEditing]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        profilePicture: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setIsSaving(true);
      setUpdateError(null);
      setSuccessMessage(null);
      const doctorId = getCurrentDoctorId();
      const updated = await updateDoctorProfile(doctorId, formData);
      setProfile(updated);
      setIsEditing(false);
      setSuccessMessage('Your profile changes have been successfully saved!');
      
      // Dispatch custom event to notify layout (Sidebar/Header) of profile name changes
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('profile-updated'));
      }
    } catch (err: any) {
      console.error('Failed to update doctor profile:', err);
      const apiMessage = err.response?.data?.message;
      setUpdateError(Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage || err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <PageHeader 
          title="Doctor Profile" 
          description="Manage your bio, certifications, and medical settings." 
        />
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Loading your profile details...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <PageHeader 
          title="Doctor Profile" 
          description="Manage your bio, certifications, and medical settings." 
        />
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-center shadow-xs">
          <p className="text-xs font-bold text-rose-500">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    );
  }

  const { profileDetails, user, doctorSpecializations, licenseNumber, isVerified, bio } = profile;
  const fullName = [profileDetails.firstName, profileDetails.middleName, profileDetails.lastName, profileDetails.suffix]
    .filter(Boolean)
    .join(' ');
  const initials = [profileDetails.firstName[0], profileDetails.lastName[0]].filter(Boolean).join('');
  const formattedBirthDate = new Date(profileDetails.birthDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const headerAction = isEditing ? (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => {
          setIsEditing(false);
          setUpdateError(null);
          setSuccessMessage(null);
        }}
        className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-70 cursor-pointer flex items-center gap-1.5"
      >
        {isSaving && <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        Save Changes
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => {
        setIsEditing(true);
        setSuccessMessage(null);
        setUpdateError(null);
      }}
      className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all cursor-pointer"
    >
      Edit Profile
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Doctor Profile" 
        description="View and verify your professional medical profile credentials." 
        action={headerAction}
      />

      {successMessage && (
        <div className="p-4 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {updateError && (
        <div className="p-4 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
          <span>{updateError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Avatar Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs text-center space-y-4">
            <div className="relative mx-auto h-24 w-24">
              <div className="h-24 w-24 rounded-3xl overflow-hidden bg-primary-light text-primary flex items-center justify-center font-bold text-3xl shadow-sm border border-primary/10 group relative">
                {formData.profilePicture || profileDetails.profilePicture ? (
                  <img 
                    src={formData.profilePicture || profileDetails.profilePicture || ''} 
                    alt="Avatar" 
                    className="h-full w-full object-cover rounded-3xl" 
                  />
                ) : (
                  initials
                )}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/50 hover:bg-black/60 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 rounded-3xl">
                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                    <span className="text-[8px] text-slate-350">Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {!isEditing && isVerified && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white" title="Verified Practitioner">
                  <CheckCircle className="h-3.5 w-3.5" />
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-brand-text leading-tight">{fullName}</h3>
              <p className="text-xs text-primary font-bold">
                {doctorSpecializations[0]?.specialization.name || 'General Practitioner'}
              </p>
              <div className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md mt-1 border border-slate-100">
                License: {licenseNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal info & Specializations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Personal Info Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-extrabold text-brand-text border-b border-slate-50 pb-3 flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-primary" /> Personal & Account Information
            </h3>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5">
                {/* 1. Name grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Suffix</label>
                    <input
                      type="text"
                      value={formData.suffix}
                      onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                      placeholder="e.g. MD"
                    />
                  </div>
                </div>

                {/* 2. Contact details & gender/birth date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      required
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      required
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text bg-white transition-all duration-150"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* 3. Address fields */}
                <div className="space-y-3 pt-2 border-t border-slate-50">
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">Practice Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Street Address 1</label>
                      <input
                        type="text"
                        name="streetLine1"
                        value={formData.address.streetLine1}
                        onChange={handleAddressChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Street Address 2 (Optional)</label>
                      <input
                        type="text"
                        name="streetLine2"
                        value={formData.address.streetLine2}
                        onChange={handleAddressChange}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">State / Province</label>
                      <input
                        type="text"
                        name="province"
                        value={formData.address.province}
                        onChange={handleAddressChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Postal / ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.address.zipCode}
                        onChange={handleAddressChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.address.country}
                        onChange={handleAddressChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Bio */}
                <div className="pt-2 border-t border-slate-50">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Professional Summary & Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-semibold text-brand-text transition-all duration-150"
                    placeholder="Describe your qualifications, style of care, and professional history..."
                  />
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
                  <div className="flex items-center gap-3 bg-slate-50/30 p-3 rounded-2xl border border-slate-100">
                    <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">EMAIL ADDRESS</span>
                      <span className="text-brand-text">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50/30 p-3 rounded-2xl border border-slate-100">
                    <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">CONTACT PHONE</span>
                      <span className="text-brand-text">{profileDetails.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50/30 p-3 rounded-2xl border border-slate-100">
                    <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">DATE OF BIRTH</span>
                      <span className="text-brand-text">{formattedBirthDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50/30 p-3 rounded-2xl border border-slate-100">
                    <Heart className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">GENDER DECLARED</span>
                      <span className="text-brand-text">{profileDetails.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Address Display */}
                <div className="flex gap-3 bg-slate-50/30 p-3.5 rounded-2xl border border-slate-100 text-xs font-semibold">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">ADDRESS</span>
                    <p className="text-brand-text mt-0.5 leading-relaxed">
                      {profileDetails.address.streetLine1}
                      {profileDetails.address.streetLine2 ? `, ${profileDetails.address.streetLine2}` : ''}
                      , {profileDetails.address.city}, {profileDetails.address.province} {profileDetails.address.zipCode}, {profileDetails.address.country}
                    </p>
                  </div>
                </div>

                {/* Bio Display */}
                <div className="flex gap-3 bg-slate-50/30 p-3.5 rounded-2xl border border-slate-100 text-xs font-semibold">
                  <FileText className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">PROFESSIONAL SUMMARY & BIO</span>
                    <p className="text-slate-650 mt-1 leading-relaxed italic font-medium whitespace-pre-line">
                      "{bio || 'No medical biography written yet.'}"
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section: Specializations */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-brand-text border-b border-slate-50 pb-3 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-primary" /> Medical Specializations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctorSpecializations.map((spec, index) => (
                <div key={index} className="border border-slate-100 hover:border-primary/20 hover:shadow-2xs rounded-2xl p-4 transition-all duration-150 bg-slate-50/10">
                  <h4 className="text-xs font-extrabold text-brand-text flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {spec.specialization.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-2 pl-3.5 border-l border-slate-200">
                    {spec.specialization.description || 'No specialization description recorded.'}
                  </p>
                </div>
              ))}
              {doctorSpecializations.length === 0 && (
                <div className="col-span-2 text-center py-6 text-xs text-slate-450 font-semibold">
                  No specializations listed.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
