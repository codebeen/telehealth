'use client';

import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DoctorSearchFilters from './DoctorSearchFilters';
import DoctorCard from './DoctorCard';
import DoctorScheduleModal from './DoctorScheduleModal';
import { fetchDoctors, fetchSpecializations, medicalNeeds } from '../services/doctorService';
import { Doctor } from '../types/doctor';

export default function DoctorDiscovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);
  const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [databaseSpecialties, setDatabaseSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [doctorResult, specializationResult] = await Promise.allSettled([
          fetchDoctors(),
          fetchSpecializations(),
        ]);

        if (isMounted) {
          if (doctorResult.status === 'fulfilled') {
            setDoctors(doctorResult.value);
          } else {
            console.error('Failed to fetch doctors:', doctorResult.reason);
            setDoctors([]);
            setError('We could not load doctors right now. Please try again shortly.');
          }

          if (specializationResult.status === 'fulfilled') {
            setDatabaseSpecialties(specializationResult.value);
          } else {
            console.error('Failed to fetch specializations:', specializationResult.reason);
            setDatabaseSpecialties([]);
          }
        }
      } catch (err) {
        console.error('Failed to load doctor discovery data:', err);
        if (isMounted) {
          setDoctors([]);
          setDatabaseSpecialties([]);
          setError('We could not load doctors right now. Please try again shortly.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  const specialties = useMemo(() => {
    const doctorSpecialties = doctors.flatMap((doctor) =>
      doctor.specializations?.length ? doctor.specializations : [doctor.specialty],
    );
    const allSpecialties = databaseSpecialties.length > 0 ? databaseSpecialties : doctorSpecialties;

    return ['All', ...Array.from(new Set(allSpecialties.filter(Boolean))).sort()];
  }, [databaseSpecialties, doctors]);

  // Filter doctors based on inputs
  const filteredDoctors = useMemo(() => {
    const selectedNeed = medicalNeeds.find((need) => need.id === selectedNeedId);
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return doctors.filter((doc) => {
      const doctorSpecialties = doc.specializations?.length ? doc.specializations : [doc.specialty];
      const normalizedSpecialties = doctorSpecialties.map((specialty) => specialty.toLowerCase());

      // Search is intentionally scoped to doctor name.
      const matchesSearch =
        normalizedSearch === '' ||
        doc.name.toLowerCase().includes(normalizedSearch);

      // 2. Specialty selection filter
      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        normalizedSpecialties.includes(selectedSpecialty.toLowerCase());

      // 3. Medical needs/symptoms map back to doctor specialization.
      const matchesNeed =
        !selectedNeed ||
        normalizedSpecialties.includes(selectedNeed.specialty.toLowerCase()) ||
        doc.symptoms.some((symptom) =>
          selectedNeed.symptoms.some(
            (needSymptom) => symptom.toLowerCase() === needSymptom.toLowerCase(),
          ),
        );

      return matchesSearch && matchesSpecialty && matchesNeed;
    });
  }, [doctors, searchTerm, selectedSpecialty, selectedNeedId]);

  // Sort doctors by experience (descending) by default
  const sortedDoctors = useMemo(() => {
    const getNumber = (val: string) => parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    return [...filteredDoctors].sort((a, b) => getNumber(b.experience) - getNumber(a.experience));
  }, [filteredDoctors]);

  const handleBookClick = (doctor: Doctor) => {
    // Quick book triggers showing availability schedule modal
    setSelectedDoctorForSchedule(doctor);
  };

  const handleBooked = (doctorId: string, scheduleId: string) => {
    setDoctors((currentDoctors) =>
      currentDoctors.map((doctor) => {
        if (doctor.id !== doctorId) {
          return doctor;
        }

        return {
          ...doctor,
          schedule: doctor.schedule.map((day) => ({
            ...day,
            slots: day.slots.map((slot) =>
              slot.id === scheduleId ? { ...slot, isBooked: true } : slot,
            ),
          })),
        };
      }),
    );
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

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-500">
          {error}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Available Professionals ({sortedDoctors.length})
        </h3>
      </div>

      {/* Doctor Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[300px] rounded-2xl border border-slate-100 bg-white p-5 shadow-xs animate-pulse"
            >
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
                  <div className="h-2 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
              <div className="mt-8 space-y-2">
                <div className="h-2 rounded bg-slate-100" />
                <div className="h-2 w-5/6 rounded bg-slate-100" />
                <div className="h-2 w-2/3 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedDoctors.length > 0 ? (
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
          onBooked={handleBooked}
        />
      )}
    </div>
  );
}
