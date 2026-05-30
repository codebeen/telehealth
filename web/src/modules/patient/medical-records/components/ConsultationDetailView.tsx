'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
  ShieldAlert,
  Stethoscope,
  User,
} from 'lucide-react';
import {
  getConsultationById,
  getPatientConsultationRecord,
} from '../services/medicalRecordService';
import { ConsultationSessionRecord } from '../types/medicalRecord';

interface ConsultationDetailViewProps {
  id: string;
}

function ReadOnlyField({
  label,
  value,
  required = false,
  minHeight = 'min-h-20',
}: {
  label: string;
  value: string;
  required?: boolean;
  minHeight?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold tracking-wide text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div
        className={`rounded-2xl border border-slate-200 bg-slate-50/30 px-4 py-3 text-xs font-medium leading-relaxed text-slate-700 ${minHeight}`}
      >
        {value || <span className="text-slate-400">No information specified</span>}
      </div>
    </div>
  );
}

export default function ConsultationDetailView({ id }: ConsultationDetailViewProps) {
  const router = useRouter();
  const [record, setRecord] = useState<ConsultationSessionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadRecord = async () => {
      try {
        setIsLoading(true);
        setNotFound(false);
        const data = await getPatientConsultationRecord(id);
        setRecord(data);
      } catch (err) {
        console.error('Failed to load consultation record:', err);
        const fallback = getConsultationById(id);
        if (fallback) {
          setRecord(fallback);
        } else {
          setNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRecord();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-300">
        <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <p className="text-xs font-bold text-slate-400">Loading consultation record...</p>
        </div>
      </div>
    );
  }

  if (notFound || !record) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-rose-100 bg-rose-50 text-rose-500">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Medical Record Not Found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            We could not find a consultation record with the reference ID{' '}
            <span className="font-bold text-slate-600">{id}</span>.
          </p>
        </div>
        <button
          onClick={() => router.push('/patient/medical-records')}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-primary-dark"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Medical Records
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/patient/medical-records')}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-100 bg-white px-3.5 py-2 text-xs font-bold text-slate-500 shadow-2xs transition-all hover:text-slate-700 hover:shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Records
        </button>

        <button
          onClick={() => window.print()}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-primary/10 bg-primary-light px-3.5 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/10"
        >
          <Printer className="h-4 w-4" /> Print Record
        </button>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Practitioner
                </span>
                <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Finalized
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{record.doctorName}</h2>
              <p className="text-xs font-semibold text-slate-500">{record.specialty} Specialist</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Record ID</span>
                <span className="block text-xs font-bold text-slate-700">{record.id}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Date</span>
                <span className="block text-xs font-bold text-slate-700">{record.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
                <span className="block text-xs font-bold text-slate-700">{record.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Consultation Record
          </h3>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Finalized
          </span>
        </div>

        <div className="space-y-5">
          <ReadOnlyField
            label="Consultation Type"
            value={record.consultationType}
            required
            minHeight="min-h-12"
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ReadOnlyField label="Clinical Findings" value={record.clinicalFindings} required />
            <ReadOnlyField label="Recommendations & Advice" value={record.recommendations} required />
          </div>

          <ReadOnlyField
            label="Medication & Prescriptions"
            value={record.medicationPrescriptions}
            minHeight="min-h-14"
          />

          <ReadOnlyField
            label="Final Consultation Summary"
            value={record.finalSummary}
            minHeight="min-h-14"
          />
        </div>
      </div>
    </div>
  );
}
