import api from '@/lib/api';

export interface DoctorDashboardData {
  stats: {
    totalConsultations: number;
    scheduledToday: number;
    activePatientsCount: number;
    prescriptionsCount: number;
  };
  appointments: {
    id: string;
    patient: string;
    time: string;
    type: string;
    status: string;
    avatar: string;
    patientId: string;
  }[];
  recentPatients: {
    id: string;
    name: string;
    condition: string;
    lastVisit: string;
    status: string;
  }[];
}

export async function fetchDoctorDashboard(doctorId: string): Promise<DoctorDashboardData> {
  const response = await api.get<DoctorDashboardData>(`/doctors/${doctorId}/dashboard`);
  return response.data;
}
