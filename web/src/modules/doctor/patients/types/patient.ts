export interface ConsultationSession {
  id: string;
  date: string;
  type: string;
  findings: string;
  recommendations: string;
  prescriptions: string;
  summary: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  phone: string;
  ongoingAppointment?: string;
  status: 'Ongoing' | 'Completed';
  history: ConsultationSession[];
  medicalHistory?: PatientMedicalHistory[];
  allergies?: PatientAllergy[];
}

export interface PatientMedicalHistory {
  id: string;
  conditionName: string;
  diagnosedDate: string;
  status: 'ACTIVE' | 'RESOLVED' | string;
  description: string;
}

export interface PatientAllergy {
  id: string;
  name: string;
  createdAt: string;
}
