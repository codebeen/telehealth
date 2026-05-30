import {
  fetchPatientAppointments,
} from '@/modules/patient/appointment/services/appointmentService';
import { PatientAppointment } from '@/modules/patient/appointment/types/appointment';
import {
  getPatientConsultationRecords,
} from '@/modules/patient/medical-records/services/medicalRecordService';
import { getPatientMedicalHistories } from '@/modules/patient/medical-records/services/medicalHistory.service';
import {
  ConsultationSessionRecord,
  MedicalHistoryItem,
  PrescriptionRecord,
} from '@/modules/patient/medical-records/types/medicalRecord';

export interface PatientDashboardData {
  appointments: PatientAppointment[];
  upcomingAppointments: PatientAppointment[];
  prescriptions: PrescriptionRecord[];
  medicalHistory: MedicalHistoryItem[];
  consultations: ConsultationSessionRecord[];
}

function buildPrescriptionsFromConsultations(
  consultations: ConsultationSessionRecord[],
): PrescriptionRecord[] {
  return consultations
    .filter((consultation) => consultation.medicationPrescriptions?.trim())
    .map((consultation) => ({
      id: `RX-${consultation.id}`,
      medication: consultation.medicationPrescriptions.trim(),
      dosage: consultation.medicationPrescriptions.trim(),
      instructions: consultation.recommendations || 'Follow the instructions given by your doctor.',
      doctorName: consultation.doctorName,
      datePrescribed: consultation.date,
      status: 'Active',
      refills: 0,
    }));
}

function isUpcomingAppointment(appointment: PatientAppointment) {
  return appointment.status === 'Pending' || appointment.status === 'Upcoming';
}

export async function fetchPatientDashboard(): Promise<PatientDashboardData> {
  const [appointments, consultations, medicalHistory] = await Promise.all([
    fetchPatientAppointments(),
    getPatientConsultationRecords(),
    getPatientMedicalHistories(),
  ]);

  return {
    appointments,
    upcomingAppointments: appointments.filter(isUpcomingAppointment),
    prescriptions: buildPrescriptionsFromConsultations(consultations),
    medicalHistory,
    consultations,
  };
}
