'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';

import { PATIENT_DATA } from '../types/patientData';
import PatientList from './PatientList';

export default function DoctorPatients() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = PATIENT_DATA.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contact.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Medical Records Console"
        description="View patient consultation records, document medical notes, and manage history."
      />
      <PatientList
        patients={filteredPatients}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewPatient={(id) => router.push(`/doctor/patients/${id}`)}
      />
    </div>
  );
}
