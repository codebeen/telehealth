import api from '@/lib/api';
import { getCurrentPatientId } from '@/modules/patient/utils/currentPatient';

export interface PatientAllergy {
  id: string;
  name: string;
  createdAt?: string;
}

export async function getPatientAllergies(): Promise<PatientAllergy[]> {
  const patientId = getCurrentPatientId();
  const response = await api.get(`/patients/${patientId}/allergies`);
  return response.data;
}

export async function addPatientAllergy(name: string): Promise<PatientAllergy> {
  const patientId = getCurrentPatientId();
  const response = await api.post(`/patients/${patientId}/allergies`, { name });
  return response.data;
}

export async function removePatientAllergy(id: string): Promise<void> {
  const patientId = getCurrentPatientId();
  await api.delete(`/patients/${patientId}/allergies/${id}`);
}
