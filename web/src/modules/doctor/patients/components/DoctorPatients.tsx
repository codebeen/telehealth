'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';

import PatientList from './PatientList';
import { PatientRecord } from '../types/patient';
import { getCurrentDoctorId } from '../../utils/currentDoctor';
import { fetchCompletedConsultationPatients } from '../services/patientService';

export default function DoctorPatients() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const doctorId = getCurrentDoctorId();
      const data = await fetchCompletedConsultationPatients(doctorId);
      setPatients(data);
    } catch (err) {
      console.error('Failed to fetch completed consultation patients:', err);
      setPatients([]);
      setError('We could not load your completed consultation patients right now.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const filteredPatients = patients.filter(
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
      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-500">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-xs">
          <p className="text-xs font-semibold text-slate-400">Loading completed consultation patients...</p>
        </div>
      ) : (
        <PatientList
          patients={filteredPatients}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onViewPatient={(id) => router.push(`/doctor/patients/${id}`)}
        />
      )}
    </div>
  );
}
