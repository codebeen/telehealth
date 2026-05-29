import { Doctor, MedicalNeed, TimeSlot, DaySchedule } from '../types/doctor';

// Helper to generate dynamic dates from today
const getFutureDate = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

const getDisplayDayName = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  if (daysAhead === 0) return 'Today';
  if (daysAhead === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

// Generates time slot ranges for a day
const generateSlots = (startHour: number, endHour: number, intervalMinutes: number, bookedIndices: number[]): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  let currentHour = startHour;
  let currentMinute = 0;
  let index = 0;

  while (currentHour < endHour) {
    const nextMinute = currentMinute + intervalMinutes;
    let nextHour = currentHour;
    let displayNextMinute = nextMinute;
    if (displayNextMinute >= 60) {
      nextHour += Math.floor(displayNextMinute / 60);
      displayNextMinute = displayNextMinute % 60;
    }

    if (nextHour > endHour || (nextHour === endHour && displayNextMinute > 0)) {
      break;
    }

    const formatTime = (h: number, m: number) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      return `${displayHour}:${String(m).padStart(2, '0')} ${period}`;
    };

    slots.push({
      id: `${currentHour}-${currentMinute}-${index}`,
      start: formatTime(currentHour, currentMinute),
      end: formatTime(nextHour, displayNextMinute),
      isBooked: bookedIndices.includes(index),
    });

    currentMinute = displayNextMinute;
    currentHour = nextHour;
    index++;
  }
  return slots;
};

export const medicalNeeds: MedicalNeed[] = [
  {
    id: 'heart',
    label: 'Heart & Chest Pain',
    iconName: 'Activity',
    specialty: 'Cardiology',
    description: 'Chest discomfort, high blood pressure, heart rate irregularities.'
  },
  {
    id: 'child',
    label: 'Child Health / Pediatrics',
    iconName: 'Baby',
    specialty: 'Pediatrics',
    description: 'Fever, cough, vaccinations, growth & developmental concerns.'
  },
  {
    id: 'skin',
    label: 'Skin Rashes & Acne',
    iconName: 'Sparkles',
    specialty: 'Dermatology',
    description: 'Eczema, acne, suspicious moles, hair or nail concerns.'
  },
  {
    id: 'brain',
    label: 'Headache & Nerves',
    iconName: 'Brain',
    specialty: 'Neurology',
    description: 'Migraines, tremors, chronic dizziness, numbness or memory issues.'
  },
  {
    id: 'general',
    label: 'Flu, Fever & General Care',
    iconName: 'Stethoscope',
    specialty: 'General Medicine',
    description: 'Common cold, allergies, prescriptions, physical exam follow-ups.'
  }
];

export const specialties = ['All', 'Cardiology', 'Pediatrics', 'Dermatology', 'Neurology', 'General Medicine'];

export const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Evelyn Adams',
    specialty: 'Cardiology',
    rating: 4.9,
    reviewsCount: 120,
    experience: '12 yrs',
    fee: '$45',
    availability: 'Tomorrow',
    avatar: 'EA',
    symptoms: ['Chest pain', 'Palpitations', 'High blood pressure', 'Shortness of breath'],
    about: 'Dr. Evelyn Adams is a board-certified cardiologist with over a decade of experience treating cardiovascular conditions. She specializes in preventive cardiology and clinical diagnostics.',
    reviews: [
      { id: '1', patientName: 'Alexander G.', rating: 5, comment: 'Very reassuring and explained everything in simple terms. Highly recommended!', date: 'May 24, 2026' },
      { id: '2', patientName: 'Sophia M.', rating: 4.8, comment: 'Attentive doctor, but wait time online was about 5 minutes. The session itself was excellent.', date: 'May 20, 2026' }
    ],
    schedule: [
      { date: getFutureDate(0), slots: generateSlots(9, 13, 30, [0, 2, 3, 5]) }, // Today
      { date: getFutureDate(1), slots: generateSlots(9, 14, 30, [1, 4]) }, // Tomorrow
      { date: getFutureDate(2), slots: generateSlots(10, 15, 30, [0, 1]) },
      { date: getFutureDate(3), slots: generateSlots(9, 12, 30, []) },
      { date: getFutureDate(4), slots: generateSlots(13, 17, 30, [2]) },
      { date: getFutureDate(5), slots: generateSlots(9, 12, 30, [0, 1, 2, 3, 4, 5]) }, // Fully booked
      { date: getFutureDate(6), slots: generateSlots(10, 14, 30, []) }
    ]
  },
  {
    id: 2,
    name: 'Dr. Sarah Connor',
    specialty: 'General Medicine',
    rating: 4.8,
    reviewsCount: 95,
    experience: '10 yrs',
    fee: '$40',
    availability: 'Today',
    avatar: 'SC',
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Allergies', 'Sore throat'],
    about: 'Dr. Sarah Connor is a general practitioner dedicated to offering comprehensive primary care. She focuses on acute illnesses, lifestyle medicine, and general health maintenance.',
    reviews: [
      { id: '3', patientName: 'David L.', rating: 5, comment: 'Dr. Sarah resolved my throat irritation quickly. Prompt and friendly.', date: 'May 26, 2026' },
      { id: '4', patientName: 'Elena R.', rating: 4.5, comment: 'Great communication. Got my prescription refiilled immediately.', date: 'May 18, 2026' }
    ],
    schedule: [
      { date: getFutureDate(0), slots: generateSlots(8, 12, 30, [1]) },
      { date: getFutureDate(1), slots: generateSlots(9, 17, 30, [0, 2, 4, 6]) },
      { date: getFutureDate(2), slots: generateSlots(9, 17, 30, []) },
      { date: getFutureDate(3), slots: generateSlots(9, 17, 30, [1, 2]) },
      { date: getFutureDate(4), slots: generateSlots(8, 12, 30, []) },
      { date: getFutureDate(5), slots: generateSlots(10, 15, 30, []) },
      { date: getFutureDate(6), slots: generateSlots(9, 13, 30, []) }
    ]
  },
  {
    id: 3,
    name: 'Dr. Marcus Vance',
    specialty: 'Pediatrics',
    rating: 4.7,
    reviewsCount: 84,
    experience: '8 yrs',
    fee: '$50',
    availability: 'Friday, May 29th',
    avatar: 'MV',
    symptoms: ['Child fever', 'Pediatric cough', 'Growth concerns', 'Childhood rash'],
    about: 'Dr. Marcus Vance loves working with children and their parents. He provides compassionate, detail-oriented care for infants, children, and adolescents.',
    reviews: [
      { id: '5', patientName: 'Liam T. (Parent)', rating: 5, comment: 'Amazing with kids! My son was totally relaxed.', date: 'May 25, 2026' }
    ],
    schedule: [
      { date: getFutureDate(0), slots: generateSlots(10, 16, 30, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) }, // Fully booked
      { date: getFutureDate(1), slots: generateSlots(10, 15, 30, [2, 3]) },
      { date: getFutureDate(2), slots: generateSlots(9, 13, 30, [0, 1]) },
      { date: getFutureDate(3), slots: generateSlots(9, 15, 30, []) },
      { date: getFutureDate(4), slots: generateSlots(10, 15, 30, []) },
      { date: getFutureDate(5), slots: generateSlots(10, 14, 30, [1]) },
      { date: getFutureDate(6), slots: generateSlots(9, 12, 30, []) }
    ]
  },
  {
    id: 4,
    name: 'Dr. Diana Prince',
    specialty: 'Dermatology',
    rating: 4.9,
    reviewsCount: 142,
    experience: '15 yrs',
    fee: '$60',
    availability: 'Today',
    avatar: 'DP',
    symptoms: ['Acne', 'Eczema', 'Moles', 'Skin allergy', 'Hair loss'],
    about: 'Dr. Diana Prince is a dermatologist with specialized training in pediatric dermatology, skin cancers, and aesthetic medicine. She has been practicing for over 15 years.',
    reviews: [
      { id: '6', patientName: 'Chloe P.', rating: 5, comment: 'Dr. Prince is extremely knowledgeable.', date: 'May 27, 2026' }
    ],
    schedule: [
      { date: getFutureDate(0), slots: generateSlots(9, 17, 30, [0, 1, 2, 4, 5, 9, 10]) },
      { date: getFutureDate(1), slots: generateSlots(9, 17, 30, [1, 2]) },
      { date: getFutureDate(2), slots: generateSlots(9, 17, 30, []) },
      { date: getFutureDate(3), slots: generateSlots(9, 17, 30, [0]) },
      { date: getFutureDate(4), slots: generateSlots(9, 15, 30, [1, 2, 3]) },
      { date: getFutureDate(5), slots: generateSlots(9, 12, 30, []) },
      { date: getFutureDate(6), slots: generateSlots(9, 12, 30, []) }
    ]
  },
  {
    id: 5,
    name: 'Dr. Bruce Wayne',
    specialty: 'Neurology',
    rating: 4.6,
    reviewsCount: 68,
    experience: '14 yrs',
    fee: '$75',
    availability: 'Monday, June 1st',
    avatar: 'BW',
    symptoms: ['Chronic headache', 'Migraine', 'Tremors', 'Numbness', 'Dizziness'],
    about: 'Dr. Bruce Wayne is a neurologist specializing in migraine management, neuromuscular disorders, and sleep medicine.',
    reviews: [
      { id: '7', patientName: 'Alfred P.', rating: 4.7, comment: 'Excellent consultation.', date: 'May 22, 2026' }
    ],
    schedule: [
      { date: getFutureDate(0), slots: generateSlots(13, 17, 30, [0, 1, 2, 3, 4, 5, 6, 7]) }, // Booked today
      { date: getFutureDate(1), slots: generateSlots(13, 17, 30, [0, 1, 2, 3, 4, 5, 6, 7]) }, // Booked tomorrow
      { date: getFutureDate(2), slots: generateSlots(13, 17, 30, [0, 1, 2, 3, 4, 5, 6, 7]) }, // Booked next day
      { date: getFutureDate(3), slots: generateSlots(13, 17, 30, [0, 1, 2, 3, 4, 5, 6, 7]) }, // Booked day 3
      { date: getFutureDate(4), slots: generateSlots(13, 17, 30, [1, 2]) }, // Available day 4
      { date: getFutureDate(5), slots: generateSlots(10, 14, 30, []) },
      { date: getFutureDate(6), slots: generateSlots(9, 13, 30, []) }
    ]
  }
];

export const getDisplayDateFormatted = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
