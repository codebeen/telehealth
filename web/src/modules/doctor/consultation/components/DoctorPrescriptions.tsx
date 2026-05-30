'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye, FileText } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { getCurrentDoctorId } from '@/modules/doctor/utils/currentDoctor';
import { fetchCompletedConsultationPatients } from '@/modules/doctor/patients/services/patientService';
import { PatientRecord } from '@/modules/doctor/patients/types/patient';

type ConsultationHistoryRow = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: string;
  findings: string;
  prescriptions: string;
  summary: string;
};

export default function DoctorPrescriptions() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCompletedConsultations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const doctorId = getCurrentDoctorId();
        const data = await fetchCompletedConsultationPatients(doctorId);

        if (isMounted) {
          setPatients(data);
        }
      } catch (err) {
        console.error('Failed to load doctor consultation history:', err);
        if (isMounted) {
          setPatients([]);
          setError('We could not load completed consultations right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCompletedConsultations();

    return () => {
      isMounted = false;
    };
  }, []);

  const historyRows = useMemo<ConsultationHistoryRow[]>(() => {
    return patients.flatMap((patient) =>
      patient.history.map((session) => ({
        id: session.id,
        patientId: patient.id,
        patientName: patient.name,
        date: session.date,
        type: session.type,
        findings: session.findings,
        prescriptions: session.prescriptions,
        summary: session.summary,
      })),
    );
  }, [patients]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Consultation History"
        description="Completed consultation appointments for your patients."
        action={
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs font-bold text-slate-500">
            <FileText className="h-4 w-4 text-primary" />
            {historyRows.length} {historyRows.length === 1 ? 'Record' : 'Records'}
          </div>
        }
      />

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-500">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 rounded-2xl bg-slate-50 animate-pulse" />
            ))}
          </div>
        ) : historyRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Consultation Type</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Clinical Findings</th>
                  <th className="pb-3">Medication</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historyRows.map((row) => (
                  <tr key={`${row.patientId}-${row.id}`}>
                    <td className="py-3.5 font-bold text-brand-text">{row.patientName}</td>
                    <td className="py-3.5 font-medium text-slate-600">{row.type}</td>
                    <td className="py-3.5 text-slate-400">{row.date}</td>
                    <td className="py-3.5 text-slate-500 max-w-xs">
                      <span className="line-clamp-1">{row.findings}</span>
                    </td>
                    <td className="py-3.5 text-slate-500 max-w-xs">
                      <span className="line-clamp-1">
                        {row.prescriptions || 'No medication specified'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/doctor/patients/${row.patientId}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-xs font-bold text-slate-400">No completed consultations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
