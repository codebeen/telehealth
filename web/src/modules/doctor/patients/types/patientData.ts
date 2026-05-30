import { PatientRecord } from './patient';

// In a real app this would come from an API. 
// Exported as a mutable array so the detail page can simulate updates.
const INITIAL_PATIENT_DATA: PatientRecord[] = [
  {
    id: 'pat-1',
    name: 'Alexander Goth',
    age: 42,
    gender: 'Male',
    contact: 'alexander.goth@example.com',
    phone: '+1 (555) 019-2834',
    ongoingAppointment: 'Cardio Follow-up - Today at 02:30 PM',
    status: 'Ongoing',
    history: [
      {
        id: 'c-101',
        date: 'May 10, 2026',
        type: 'Cardio Review',
        findings:
          'Stable ECG scan results. Patient reports minor blood pressure fluctuations in the morning but no dizziness or chest pain.',
        recommendations:
          'Continue light daily cardiovascular exercise. Maintain a low-sodium diet and check BP every morning.',
        prescriptions: 'Lisinopril 10mg - 1 tablet daily in the morning',
        summary:
          'Essential hypertension under control. Advised lifestyle adjustments and regular home readings.',
      },
    ],
  },
  {
    id: 'pat-2',
    name: 'Beatrice Vance',
    age: 29,
    gender: 'Female',
    contact: 'beatrice.vance@example.com',
    phone: '+1 (555) 021-9841',
    status: 'Completed',
    history: [
      {
        id: 'c-102',
        date: 'May 27, 2026',
        type: 'General Allergy Consult',
        findings:
          'Severe nasal congestion, sneezing, watery eyes. Chest sounds clear, no wheezing or dyspnea.',
        recommendations:
          'Avoid outdoor activities in early morning. Use HEPA bedroom air filtration.',
        prescriptions: 'Cetirizine 10mg - 1 tablet daily at night before bed',
        summary:
          'Seasonal allergic rhinitis under active management. Patient instructed on trigger prevention.',
      },
    ],
  },
  {
    id: 'pat-3',
    name: 'Corbin Dallas',
    age: 37,
    gender: 'Male',
    contact: 'corbin.dallas@example.com',
    phone: '+1 (555) 039-4411',
    ongoingAppointment: 'Hypertension Review - Today at 04:00 PM',
    status: 'Ongoing',
    history: [
      {
        id: 'c-103',
        date: 'April 15, 2026',
        type: 'BP Assessment',
        findings:
          'Blood pressure elevated at 142/90. Reports periodic mild headaches during work hours.',
        recommendations:
          'Hydration improvement, stress reduction exercises. Re-check BP twice daily.',
        prescriptions: 'Amlodipine 5mg - 1 tablet daily with food',
        summary:
          'Stage 1 hypertension identified. Prescribed low-dose medication. Initiated home log tracking.',
      },
    ],
  },
  {
    id: 'pat-4',
    name: 'Diana Prince',
    age: 31,
    gender: 'Female',
    contact: 'diana.prince@example.com',
    phone: '+1 (555) 042-3322',
    status: 'Completed',
    history: [
      {
        id: 'c-104',
        date: 'Feb 18, 2026',
        type: 'Dermatology Assessment',
        findings:
          'Dry red patch wrist rash with minor flaking. Appears to match nickel alloy allergy from watchband.',
        recommendations:
          'Switch to a non-metallic (leather/silicone) watchband. Apply thin ointment layer.',
        prescriptions: 'Hydrocortisone 1% Ointment - Apply twice daily for 7 days',
        summary: 'Contact dermatitis of the left wrist. Advised allergen avoidance.',
      },
    ],
  },
  {
    id: 'pat-5',
    name: 'Ezra Bridger',
    age: 24,
    gender: 'Male',
    contact: 'ezra.bridger@example.com',
    phone: '+1 (555) 091-2288',
    status: 'Completed',
    history: [
      {
        id: 'c-105',
        date: 'May 25, 2026',
        type: 'Diabetes Log Review',
        findings: 'Fasting blood sugar logs average 110 mg/dL. Good glycemic response post-meals.',
        recommendations:
          'Continue low carb intake, check logs weekly instead of daily if levels remain stable.',
        prescriptions: 'Metformin 500mg - 1 tablet twice daily with breakfast and dinner',
        summary:
          'Type 2 Diabetes mellitus showing stable glycemic control. Diet adherence commended.',
      },
    ],
  },
];

export const PATIENT_DATA: PatientRecord[] = [...INITIAL_PATIENT_DATA];

// Load from localStorage if available on client-side
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('doctor_patients_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        PATIENT_DATA.length = 0;
        PATIENT_DATA.push(...parsed);
      }
    } catch (e) {
      console.error('Failed to parse doctor_patients_data:', e);
    }
  }
}

export function persistPatientData() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('doctor_patients_data', JSON.stringify(PATIENT_DATA));
  }
}
