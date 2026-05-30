import api from '@/lib/api';
import { ConsultationSession, PatientRecord } from '../types/patient';

export interface UpdateConsultationRecordPayload {
  consultationType: string;
  clinicalFindings: string;
  recommendations: string;
  medicationPrescriptions?: string;
  finalSummary?: string;
}

export async function fetchCompletedConsultationPatients(doctorId: string) {
  const response = await api.get<PatientRecord[]>(`/doctors/${doctorId}/patients/completed`);
  return response.data;
}

export async function fetchCompletedConsultationPatient(doctorId: string, patientId: string) {
  const patients = await fetchCompletedConsultationPatients(doctorId);
  return patients.find((patient) => patient.id === patientId) ?? null;
}

export async function updateConsultationRecord(
  doctorId: string,
  patientId: string,
  recordId: string,
  payload: UpdateConsultationRecordPayload,
) {
  const response = await api.patch<ConsultationSession>(
    `/doctors/${doctorId}/patients/${patientId}/records/${recordId}`,
    payload,
  );
  return response.data;
}
