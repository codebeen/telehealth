'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import StepCredentials from './StepCredentials';
import StepPersonalInfo from './doctor-stepper/StepPersonalInfo';
import StepSpecialization from './doctor-stepper/StepSpecialization';
import StepReviewSubmit from './doctor-stepper/StepReviewSubmit';

export default function DoctorRegisterStepper() {
  const router = useRouter();

  // Stepper Coordinator State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Form State
  // Step 1: Account Setup
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Step 2: Personal Information
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Step 2.5: Address Information
  const [streetLine1, setStreetLine1] = useState<string>('');
  const [streetLine2, setStreetLine2] = useState<string>('');
  const [barangay, setBarangay] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [country, setCountry] = useState<string>('Philippines');

  // Step 3: Specialization / Professional Info
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  // Step 4: Agreement
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Steps definition
  const steps = [
    { number: 1, title: 'Account Setup', desc: 'Login details' },
    { number: 2, title: 'Personal Info', desc: 'Profile details' },
    { number: 3, title: 'Specialization', desc: 'License & practice' },
    { number: 4, title: 'Review & Submit', desc: 'Confirm registration' }
  ];

  // Validation function
  const validateStep = (stepNumber: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!email) {
        stepErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        stepErrors.email = 'Please enter a valid email address';
      }

      if (!password) {
        stepErrors.password = 'Password is required';
      } else if (password.length < 6) {
        stepErrors.password = 'Password must be at least 6 characters';
      }

      if (!confirmPassword) {
        stepErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (stepNumber === 2) {
      if (!firstName.trim()) stepErrors.firstName = 'First name is required';
      if (!lastName.trim()) stepErrors.lastName = 'Last name is required';
      if (!birthDate) stepErrors.birthDate = 'Birth date is required';
      if (!gender) stepErrors.gender = 'Gender is required';
      if (!phoneNumber.trim()) stepErrors.phoneNumber = 'Phone number is required';
      
      // Address validations
      if (!streetLine1.trim()) stepErrors.streetLine1 = 'Street address is required';
      if (!barangay.trim()) stepErrors.barangay = 'Barangay is required';
      if (!city.trim()) stepErrors.city = 'City/Municipality is required';
      if (!province.trim()) stepErrors.province = 'Province is required';
      if (!zipCode.trim()) stepErrors.zipCode = 'Zip code is required';
      if (!country.trim()) stepErrors.country = 'Country is required';
    }

    if (stepNumber === 3) {
      if (specializations.length === 0) {
        stepErrors.specializations = 'At least one specialization is required';
      }
      if (!licenseNumber.trim()) {
        stepErrors.licenseNumber = 'License number is required';
      }
    }

    if (stepNumber === 4) {
      if (!isAgreed) {
        stepErrors.agreement = 'You must declare correctness and agree to the Terms of Service';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Navigations
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Form submission
  const handleSubmit = () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    // Simulate API registration call for Doctor
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect to doctor dashboard after 2 seconds
      setTimeout(() => {
        router.push('/doctor/dashboard');
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
          <Check className="h-10 w-10 stroke-[3]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-text">Registration Complete!</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Your professional doctor profile has been successfully set up. Redirecting to your dashboard...
          </p>
        </div>
        <div className="flex justify-center items-center gap-1.5 text-xs text-primary font-bold">
          <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
          Preparing credentials...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-text">Create your Doctor account</h2>
        <p className="mt-1.5 text-xs font-semibold text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Modern Stepper Indicator */}
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 -z-10" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary -z-10 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        <div className="flex justify-between items-start">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            return (
              <div key={step.number} className="flex flex-col items-center group">
                <button
                  type="button"
                  onClick={() => {
                    if (step.number < currentStep) {
                      setCurrentStep(step.number);
                    }
                  }}
                  disabled={step.number >= currentStep}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 border-2 ${
                    isCompleted
                      ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 cursor-pointer'
                      : isActive
                      ? 'bg-white border-primary text-primary shadow-xs ring-4 ring-primary/10'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[2.5]" /> : step.number}
                </button>
                <span className={`mt-2 text-[10px] font-bold text-center uppercase tracking-wider hidden sm:block ${
                  isActive ? 'text-primary' : isCompleted ? 'text-brand-text' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-xs">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {currentStep === 1 && (
            <StepCredentials
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <StepPersonalInfo
              profilePicture={profilePicture}
              setProfilePicture={setProfilePicture}
              firstName={firstName}
              setFirstName={setFirstName}
              middleName={middleName}
              setMiddleName={setMiddleName}
              lastName={lastName}
              setLastName={setLastName}
              suffix={suffix}
              setSuffix={setSuffix}
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              gender={gender}
              setGender={setGender}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              
              streetLine1={streetLine1}
              setStreetLine1={setStreetLine1}
              streetLine2={streetLine2}
              setStreetLine2={setStreetLine2}
              barangay={barangay}
              setBarangay={setBarangay}
              city={city}
              setCity={setCity}
              province={province}
              setProvince={setProvince}
              zipCode={zipCode}
              setZipCode={setZipCode}
              country={country}
              setCountry={setCountry}
              
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <StepSpecialization
              licenseNumber={licenseNumber}
              setLicenseNumber={setLicenseNumber}
              bio={bio}
              setBio={setBio}
              specializations={specializations}
              setSpecializations={setSpecializations}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <StepReviewSubmit
              email={email}
              profilePicture={profilePicture}
              firstName={firstName}
              middleName={middleName}
              lastName={lastName}
              suffix={suffix}
              birthDate={birthDate}
              gender={gender}
              phoneNumber={phoneNumber}
              specializations={specializations}
              licenseNumber={licenseNumber}
              bio={bio}
              
              streetLine1={streetLine1}
              streetLine2={streetLine2}
              barangay={barangay}
              city={city}
              province={province}
              zipCode={zipCode}
              country={country}
              
              isAgreed={isAgreed}
              setIsAgreed={setIsAgreed}
              errors={errors}
            />
          )}

          {/* Stepper Actions Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            {/* Back Button */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {/* Next / Submit Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-dark hover:scale-102 transition-all duration-150 disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : currentStep === 4 ? (
                'Submit Registration'
              ) : (
                <>
                  Next <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Back to Patient Registration Link (only on step 1) */}
      {currentStep === 1 && (
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex w-full h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:scale-102 transition-all duration-150 shadow-xs"
          >
            Register as Patient
          </Link>
        </div>
      )}
    </div>
  );
}
