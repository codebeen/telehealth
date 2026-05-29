'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Calendar, Clock, FileText, HeartHandshake, 
  Pill, Printer, ShieldAlert, Award, CheckCircle2, User, ChevronRight
} from 'lucide-react';
import { 
  getConsultationById, 
  getPrescriptionDetailsForMedications 
} from '../services/medicalRecordService';

interface ConsultationDetailViewProps {
  id: string;
}

export default function ConsultationDetailView({ id }: ConsultationDetailViewProps) {
  const router = useRouter();
  const record = getConsultationById(id);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center border border-rose-100">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Medical Record Not Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            We couldn't find a consultation record with the reference ID <span className="font-bold text-slate-600">{id}</span>.
          </p>
        </div>
        <button
          onClick={() => router.push('/patient/medical-records')}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Medical Records
        </button>
      </div>
    );
  }

  const linkedPrescriptions = getPrescriptionDetailsForMedications(record.prescriptionsLinked || []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/patient/medical-records')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Records
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-primary/10 px-3.5 py-2 rounded-xl border border-primary/10 transition-all cursor-pointer"
        >
          <Printer className="h-4 w-4" /> Print Record
        </button>
      </div>

      {/* Main Hero Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-lg">
        {/* Background visual flair */}
        <div className="absolute right-0 bottom-0 top-0 w-96 bg-gradient-to-l from-primary/15 to-transparent pointer-events-none rounded-r-3xl" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex gap-4.5 items-start relative z-10">
          <div className="h-14 w-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center font-bold text-white shrink-0 border border-white/15 shadow-inner">
            <HeartHandshake className="h-7 w-7 text-primary-light" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/50">
                Session ID: {record.id}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                <CheckCircle2 className="h-3 w-3" /> Signed & Verified
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">{record.doctorName}</h2>
            <p className="text-xs text-slate-350 font-semibold">{record.specialty} Specialist</p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Date of Consult</span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Calendar className="h-4 w-4 text-primary-light" /> {record.date}
            </span>
          </div>
          <div className="space-y-1 text-right md:text-left">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Session Duration</span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-white justify-end md:justify-start">
              <Clock className="h-4 w-4 text-primary-light" /> {record.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Session Metadata & Quick Stats */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-5">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Practitioner Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center font-bold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Licensed Doctor</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{record.doctorName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center font-bold">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Specialization</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{record.specialty} Medicine</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-4 text-[10px] text-slate-400 font-medium leading-relaxed">
              This digital medical record represents a summary signed off by your attending physician upon completion of the consultation.
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-3xl border border-slate-100/50 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Patient Rights & Access</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              As a patient, you have full access to these consultation reports. If you have questions regarding the diagnosis or prescribed regimens, please book a follow-up session or reach out via secure messaging.
            </p>
          </div>

        </div>

        {/* Right Side (2/3 Width): Diagnosis & Clinical Advice */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnosis Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Primary Diagnosis</h3>
            </div>
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <span className="text-[9px] text-primary font-bold uppercase tracking-wider block mb-1">Diagnosed Condition</span>
              <p className="text-base font-extrabold text-slate-900 leading-snug">
                {record.diagnosis}
              </p>
            </div>
          </div>

          {/* Treatment Notes Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Treatment Plan & Clinical Notes</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-650 leading-relaxed whitespace-pre-line italic pl-4 border-l-3 border-primary/30 py-1">
                "{record.treatmentNotes}"
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150/40 text-[11px] text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700 block mb-1">Standard Patient Advisory:</span>
                Please monitor your condition daily. Contact emergency medical services immediately if you experience severe headaches, shortness of breath, sudden chest pain, or visual disturbances.
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Linked Prescriptions Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Linked Prescriptions</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-450 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            {linkedPrescriptions.length} Refill{linkedPrescriptions.length === 1 ? '' : 's'} Available
          </span>
        </div>

        {linkedPrescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-450">
            <p className="text-xs font-medium text-slate-400">No prescriptions were issued for this consultation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedPrescriptions.map((pres) => (
              <div key={pres.id} className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden flex flex-col justify-between">
                {/* Border Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl" />

                <div className="pl-2 space-y-3.5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{pres.medication}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Ref: {pres.id}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      pres.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                    }`}>
                      {pres.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-medium text-slate-650 bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Dosage Regimen</span>
                      <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">{pres.dosage}</span>
                    </div>
                    <div className="border-t border-slate-100/60 pt-2 mt-2">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Instructions</span>
                      <span className="text-[11px] text-slate-600 mt-0.5 block leading-normal">{pres.instructions}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 border-t border-slate-50 pt-3">
                    <span>Prescribed by: <strong className="text-slate-600 font-bold">{pres.doctorName}</strong></span>
                    <span>Refills: <strong className="text-slate-700 font-extrabold">{pres.refills} remaining</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
