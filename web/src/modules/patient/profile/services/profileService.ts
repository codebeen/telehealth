import api from '@/lib/api';

export interface PatientProfileData {
  id: string;
  weight: string | null;
  height: string | null;
  bloodType: string | null;
  emergencyContactName: string | null;
  emergencyContactNumber: string | null;
  user: {
    email: string;
  };
  profileDetails: {
    firstName: string;
    middleName: string | null;
    lastName: string;
    suffix: string | null;
    gender: string;
    profilePicture: string | null;
    phoneNumber: string;
    birthDate: string;
    address: {
      streetLine1: string;
      streetLine2: string | null;
      city: string;
      province: string;
      zipCode: string;
      country: string;
    };
  };
  medicalHistories: {
    id: string;
    conditionName: string;
    description: string | null;
    diagnosedDate: string | null;
    status: 'ACTIVE' | 'RESOLVED';
  }[];
  allergies: {
    id: string;
    name: string;
  }[];
}

export async function fetchPatientProfile(patientId: string): Promise<PatientProfileData> {
  const response = await api.get<PatientProfileData>(`/patients/${patientId}/profile`);
  return response.data;
}

export async function updatePatientProfile(patientId: string, payload: any): Promise<PatientProfileData> {
  const response = await api.patch<PatientProfileData>(`/patients/${patientId}/profile`, payload);
  return response.data;
}
