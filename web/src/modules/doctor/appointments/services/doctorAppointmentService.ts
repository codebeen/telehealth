import api from '@/lib/api';
import { DoctorAppointment } from '../types/appointment';

export interface CompleteAppointmentPayload {
  consultationType: string;
  clinicalFindings: string;
  recommendations: string;
  medicationPrescriptions?: string;
  finalSummary?: string;
}

export async function getDoctorAppointments(
  doctorId: string,
  view: 'upcoming' | 'past' | 'all' = 'all',
) {
  const response = await api.get<DoctorAppointment[]>(`/appointments/doctor/${doctorId}`, {
    params: { view },
  });

  return response.data;
}

export async function acceptDoctorAppointment(doctorId: string, appointmentId: string) {
  const response = await api.patch<DoctorAppointment>(
    `/appointments/doctor/${doctorId}/${appointmentId}/accept`,
  );

  return response.data;
}

export async function rejectDoctorAppointment(
  doctorId: string,
  appointmentId: string,
  rejectionReason: string,
) {
  const response = await api.patch<DoctorAppointment>(
    `/appointments/doctor/${doctorId}/${appointmentId}/reject`,
    { rejectionReason },
  );

  return response.data;
}

export async function cancelDoctorAppointment(
  doctorId: string,
  appointmentId: string,
  cancellationReason: string,
) {
  const response = await api.patch<DoctorAppointment>(
    `/appointments/doctor/${doctorId}/${appointmentId}/cancel`,
    { cancellationReason },
  );

  return response.data;
}

export async function completeDoctorAppointment(
  doctorId: string,
  appointmentId: string,
  payload: CompleteAppointmentPayload,
) {
  const response = await api.patch<DoctorAppointment>(
    `/appointments/doctor/${doctorId}/${appointmentId}/complete`,
    payload,
  );

  return response.data;
}
