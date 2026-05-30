import { 
  BasicHealthProfile, 
  ConsultationSessionRecord, 
  PrescriptionRecord, 
  LabScanRecord,
  MedicalHistoryItem
} from '../types/medicalRecord';
import api from '@/lib/api';
import { getCurrentPatientId } from '@/modules/patient/utils/currentPatient';

const getStoredProfile = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('registered_patient_profile');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const storedProfile = getStoredProfile();

export const mockHealthProfile: BasicHealthProfile = {
  bloodType: storedProfile?.bloodType || 'O+',
  height: storedProfile?.height ? `${storedProfile.height} cm` : '178 cm',
  weight: storedProfile?.weight ? `${storedProfile.weight} kg` : '74 kg',
  allergies: storedProfile?.allergies && storedProfile.allergies.length > 0
    ? storedProfile.allergies 
    : ['Penicillin', 'Pollen'],
  conditions: storedProfile?.medicalHistories && storedProfile.medicalHistories.length > 0
    ? storedProfile.medicalHistories.map((h: any) => h.conditionName)
    : ['Mild Hypertension'],
  bloodPressure: '120/80 mmHg',
  heartRate: '72 bpm',
};

export const mockConsultations: ConsultationSessionRecord[] = [
  {
    id: 'CS-EA-93041',
    doctorName: 'Dr. Evelyn Adams',
    specialty: 'Cardiology',
    date: 'May 27, 2026',
    duration: '22 mins 14 secs',
    consultationType: 'Cardio Follow-up',
    clinicalFindings: 'Patient reports headache symptoms have completely resolved. Morning dizziness is minor and transient. Blood pressure remains stable at 120/80.',
    recommendations: 'Maintain a low-sodium diet, continue morning walks, and monitor blood pressure three times per week.',
    medicationPrescriptions: 'Lisinopril 10mg - 1 tablet daily after breakfast.',
    finalSummary: 'Essential hypertension is stable under current management. Follow-up recommended in 4 weeks.',
    diagnosis: 'Essential Hypertension (under management)',
    treatmentNotes: 'Patient reports headache symptoms have completely resolved. Morning dizziness is minor and transient. Checked vitals: BP stable at 120/80. Advised patient to maintain a low-sodium diet and continue morning walks. Refilled current dosage of Lisinopril.',
    prescriptionsLinked: ['Lisinopril 10mg']
  },
  {
    id: 'CS-SC-82019',
    doctorName: 'Dr. Sarah Connor',
    specialty: 'General Practice',
    date: 'April 10, 2026',
    duration: '15 mins 40 secs',
    consultationType: 'Routine Review',
    clinicalFindings: 'Patient presented with nasal congestion, sneezing, and itchy eyes related to seasonal pollen exposure. Lungs clear with no wheezing.',
    recommendations: 'Use a HEPA filter in the bedroom, avoid early morning outdoor exposure, and continue symptom monitoring.',
    medicationPrescriptions: 'Cetirizine 10mg - 1 tablet nightly as needed.',
    finalSummary: 'Seasonal allergic rhinitis managed conservatively with antihistamine and avoidance measures.',
    diagnosis: 'Seasonal Allergic Rhinitis',
    treatmentNotes: 'Patient presenting with nasal congestion, sneezing, and itchy eyes due to spring pollen. Lungs clear, no wheezing. Prescribed daily antihistamine. Recommended using a HEPA filter in the bedroom and avoiding early morning outdoor activities.',
    prescriptionsLinked: ['Cetirizine (Zyrtec) 10mg']
  },
  {
    id: 'CS-DP-74108',
    doctorName: 'Dr. Diana Prince',
    specialty: 'Dermatology',
    date: 'Feb 18, 2026',
    duration: '18 mins 05 secs',
    consultationType: 'Dermatology Consult',
    clinicalFindings: 'Localized dry rash noted on the left wrist, likely allergic response to watchband nickel. No signs of secondary infection.',
    recommendations: 'Avoid nickel-containing accessories and switch to leather or textile watch straps.',
    medicationPrescriptions: 'Hydrocortisone 1% topical ointment - apply twice daily for 7 days.',
    finalSummary: 'Contact dermatitis treated with topical steroid and allergen avoidance.',
    diagnosis: 'Contact Dermatitis',
    treatmentNotes: 'Presents with localized dry rash on the left wrist. Appears to be an allergic response to watchband nickel. Prescribed hydrocortisone ointment 1% to be applied twice daily for 7 days. Recommended using leather or textile straps.',
    prescriptionsLinked: ['Hydrocortisone 1% Topical Ointment']
  },
  {
    id: 'CS-MR-66012',
    doctorName: 'Dr. Marcus Reed',
    specialty: 'Internal Medicine',
    date: 'Jan 16, 2026',
    duration: '19 mins 22 secs',
    consultationType: 'General Consult',
    clinicalFindings: 'Patient reported intermittent fatigue with normal appetite and sleep. No fever, cough, chest pain, or acute distress.',
    recommendations: 'Increase hydration, maintain sleep schedule, and complete routine lab screening if fatigue persists.',
    medicationPrescriptions: '',
    finalSummary: 'No acute findings during consult. Conservative monitoring advised.',
    prescriptionsLinked: []
  },
  {
    id: 'CS-AL-55120',
    doctorName: 'Dr. Amelia Lopez',
    specialty: 'Family Medicine',
    date: 'Dec 02, 2025',
    duration: '14 mins 09 secs',
    consultationType: 'Routine Review',
    clinicalFindings: 'Patient denies active symptoms. Reviewed health profile and lifestyle habits.',
    recommendations: 'Continue regular exercise, balanced meals, and annual preventive checkups.',
    medicationPrescriptions: '',
    finalSummary: 'Routine review completed with no urgent concerns.',
    prescriptionsLinked: []
  },
  {
    id: 'CS-NG-44821',
    doctorName: 'Dr. Nathan Green',
    specialty: 'Pulmonology',
    date: 'Oct 19, 2025',
    duration: '21 mins 45 secs',
    consultationType: 'Pulmonary Follow-up',
    clinicalFindings: 'Mild exertional shortness of breath reported. No wheezing during virtual assessment and no current fever.',
    recommendations: 'Avoid known triggers, use breathing exercises, and schedule in-person assessment if symptoms worsen.',
    medicationPrescriptions: 'Salbutamol inhaler - use as rescue medication when needed.',
    finalSummary: 'Respiratory symptoms remain mild and stable.',
    prescriptionsLinked: []
  },
  {
    id: 'CS-VP-33718',
    doctorName: 'Dr. Victor Park',
    specialty: 'Neurology',
    date: 'Sep 04, 2025',
    duration: '17 mins 30 secs',
    consultationType: 'Neurology Consult',
    clinicalFindings: 'Patient described occasional tension headaches associated with long screen use. No red-flag symptoms reported.',
    recommendations: 'Take regular screen breaks, improve hydration, and track headache frequency.',
    medicationPrescriptions: 'Paracetamol 500mg as needed for headache, maximum recommended daily dose observed.',
    finalSummary: 'Presentation consistent with tension-type headaches.',
    prescriptionsLinked: []
  }
];

export const mockPrescriptions: PrescriptionRecord[] = [
  {
    id: 'PR-EA-1094',
    medication: 'Lisinopril 10mg',
    dosage: '1 tablet daily',
    instructions: 'Take 1 tablet in the morning after eating. Do not skip doses.',
    doctorName: 'Dr. Evelyn Adams',
    datePrescribed: 'May 27, 2026',
    status: 'Active',
    refills: 2
  },
  {
    id: 'PR-SC-9041',
    medication: 'Cetirizine (Zyrtec) 10mg',
    dosage: '1 tablet daily',
    instructions: 'Take 1 tablet at night before bed. May cause light drowsiness.',
    doctorName: 'Dr. Sarah Connor',
    datePrescribed: 'April 10, 2026',
    status: 'Completed',
    refills: 0
  },
  {
    id: 'PR-DP-5532',
    medication: 'Hydrocortisone 1% Ointment',
    dosage: 'Apply twice daily',
    instructions: 'Apply a thin layer to affected skin area on the left wrist for 7 days.',
    doctorName: 'Dr. Diana Prince',
    datePrescribed: 'Feb 18, 2026',
    status: 'Completed',
    refills: 0
  }
];

export const mockLabScans: LabScanRecord[] = [
  { name: 'Lipid Profile Blood Test', date: 'May 08, 2026', doctor: 'Dr. Evelyn Adams', size: '1.4 MB' },
  { name: 'ECG Cardiac Scan Results', date: 'April 14, 2026', doctor: 'Dr. Evelyn Adams', size: '3.2 MB' },
  { name: 'Annual Physical Diagnostics', date: 'Jan 10, 2026', doctor: 'Dr. Sarah Connor', size: '2.1 MB' }
];

export const getConsultationById = (id: string): ConsultationSessionRecord | undefined => {
  return mockConsultations.find((c) => c.id === id);
};

export async function getPatientConsultationRecords(): Promise<ConsultationSessionRecord[]> {
  const patientId = getCurrentPatientId();
  const response = await api.get(`/medical-records/patient/${patientId}`);
  return response.data;
}

export async function getPatientConsultationRecord(id: string): Promise<ConsultationSessionRecord> {
  const patientId = getCurrentPatientId();
  const response = await api.get(`/medical-records/patient/${patientId}/${id}`);
  return response.data;
}

export const getPrescriptionDetailsForMedications = (medNames: string[]): PrescriptionRecord[] => {
  return mockPrescriptions.filter((p) => medNames.includes(p.medication));
};

export const mockMedicalHistory: MedicalHistoryItem[] = storedProfile?.medicalHistories && storedProfile.medicalHistories.length > 0
  ? storedProfile.medicalHistories.map((h: any) => ({
      id: h.id || `MH-${Math.random()}`,
      conditionName: h.conditionName,
      diagnosedDate: h.diagnosedDate || new Date().toISOString().split('T')[0],
      status: h.status || 'ACTIVE',
      description: h.description || '',
    }))
  : [
      {
        id: 'MH-01',
        conditionName: 'Mild Hypertension',
        diagnosedDate: '2024-03-12',
        status: 'ACTIVE',
        description: 'Diagnosed during routine annual checkup. Advised low-sodium diet and daily exercise.'
      },
      {
        id: 'MH-02',
        conditionName: 'Seasonal Allergic Rhinitis',
        diagnosedDate: '2021-05-20',
        status: 'ACTIVE',
        description: 'Allergy to tree and grass pollens. Manages symptoms with daily antihistamines in spring.'
      },
      {
        id: 'MH-03',
        conditionName: 'Left Wrist Fracture',
        diagnosedDate: '2018-08-14',
        status: 'RESOLVED',
        description: 'Orthopedic correction and cast treatment. Fully recovered with normal range of motion.'
      }
    ];


