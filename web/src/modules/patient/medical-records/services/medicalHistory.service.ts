import api from '@/lib/api';
import { getCurrentPatientId } from '@/modules/patient/utils/currentPatient';
import { MedicalHistoryItem } from '../types/medicalRecord';

export type MedicalHistoryPayload = {
  conditionName: string;
  diagnosedDate?: string;
  status: 'ACTIVE' | 'RESOLVED';
  description?: string;
};

export async function getPatientMedicalHistories(): Promise<MedicalHistoryItem[]> {
  const patientId = getCurrentPatientId();
  const response = await api.get(`/patients/${patientId}/medical-histories`);
  return response.data;
}

export async function addPatientMedicalHistory(
  payload: MedicalHistoryPayload,
): Promise<MedicalHistoryItem> {
  const patientId = getCurrentPatientId();
  const response = await api.post(`/patients/${patientId}/medical-histories`, payload);
  return response.data;
}

export async function updatePatientMedicalHistory(
  id: string,
  payload: MedicalHistoryPayload,
): Promise<MedicalHistoryItem> {
  const patientId = getCurrentPatientId();
  const response = await api.patch(`/patients/${patientId}/medical-histories/${id}`, payload);
  return response.data;
}

export async function removePatientMedicalHistory(id: string): Promise<void> {
  const patientId = getCurrentPatientId();
  await api.delete(`/patients/${patientId}/medical-histories/${id}`);
}
