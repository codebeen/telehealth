import api from '@/lib/api';

export interface DoctorProfileData {
  id: string;
  bio: string | null;
  licenseNumber: string;
  isVerified: boolean;
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
  doctorSpecializations: {
    specialization: {
      name: string;
      description: string | null;
    };
  }[];
}

export async function fetchDoctorProfile(doctorId: string): Promise<DoctorProfileData> {
  const response = await api.get<DoctorProfileData>(`/doctors/${doctorId}/profile`);
  return response.data;
}

export async function updateDoctorProfile(doctorId: string, payload: any): Promise<DoctorProfileData> {
  const response = await api.patch<DoctorProfileData>(`/doctors/${doctorId}/profile`, payload);
  return response.data;
}
