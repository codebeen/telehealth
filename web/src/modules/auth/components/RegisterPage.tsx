'use client';

import React from 'react';
import PatientRegisterStepper from './PatientRegisterStepper';
import DoctorRegisterStepper from './DoctorRegisterStepper';

interface RegisterPageProps {
  role?: 'patient' | 'doctor';
}

export default function RegisterPage({ role = 'patient' }: RegisterPageProps) {
  if (role === 'doctor') {
    return <DoctorRegisterStepper />;
  }

  return <PatientRegisterStepper />;
}
