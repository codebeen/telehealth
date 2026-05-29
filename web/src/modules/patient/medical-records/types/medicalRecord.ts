export interface BasicHealthProfile {
  bloodType: string;
  height: string;
  weight: string;
  allergies: string[];
  conditions: string[];
  bloodPressure: string;
  heartRate: string;
}

export interface ConsultationSessionRecord {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  duration: string;
  diagnosis: string;
  treatmentNotes: string;
  prescriptionsLinked?: string[];
}

export interface PrescriptionRecord {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  doctorName: string;
  datePrescribed: string;
  status: 'Active' | 'Completed' | 'Refill Pending';
  refills: number;
}

export interface LabScanRecord {
  name: string;
  date: string;
  doctor: string;
  size: string;
}

export interface MedicalHistoryItem {
  id: string;
  conditionName: string;
  diagnosedDate: string;
  status: 'ACTIVE' | 'RESOLVED';
  description: string;
}

