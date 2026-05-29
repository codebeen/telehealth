'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DoctorSearchFilters from './DoctorSearchFilters';
import DoctorCard from './DoctorCard';
import DoctorScheduleModal from './DoctorScheduleModal';
import { mockDoctors, medicalNeeds, specialties } from '../services/doctorService';
import { Doctor } from '../types/doctor';

export default function DoctorDiscovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);
  const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState<Doctor | null>(null);

  // Filter doctors based on inputs
  const filteredDoctors = useMemo(() => {
    return mockDoctors.filter((doc) => {
      // 1. Search term matches name, specialty, or treated symptoms
      const matchesSearch =
        searchTerm === '' ||
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.symptoms.some((sym) => sym.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Specialty selection filter
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [searchTerm, selectedSpecialty]);

  // Sort doctors by experience (descending) by default
  const sortedDoctors = useMemo(() => {
    const getNumber = (val: string) => parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    return [...filteredDoctors].sort((a, b) => getNumber(b.experience) - getNumber(a.experience));
  }, [filteredDoctors]);

  const handleBookClick = (doctor: Doctor) => {
    // Quick book triggers showing availability schedule modal
    setSelectedDoctorForSchedule(doctor);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Title Header */}
      <PageHeader
        title="Discover Doctors & Care Providers"
        description="Search, explore by symptoms, filter by specialization, and review booking schedules."
      />

      {/* Advanced Filters and Symptoms Search */}
      <DoctorSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        selectedNeedId={selectedNeedId}
        setSelectedNeedId={setSelectedNeedId}
        specialties={specialties}
        medicalNeeds={medicalNeeds}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Available Professionals ({sortedDoctors.length})
        </h3>
      </div>

      {/* Doctor Cards Grid */}
      {sortedDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookClick={handleBookClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-xs">
          <p className="text-sm font-extrabold text-brand-text">No doctors found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            We couldn't find any professionals matching your filters. Try clearing your filters or using different keywords.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('All');
              setSelectedNeedId(null);
            }}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Detailed Schedule Modal */}
      {selectedDoctorForSchedule && (
        <DoctorScheduleModal
          doctor={selectedDoctorForSchedule}
          onClose={() => setSelectedDoctorForSchedule(null)}
        />
      )}
    </div>
  );
}
