'use client';

import React from 'react';
import { 
  LayoutDashboard, CalendarRange, HeartPulse, 
  SearchCode, PlaySquare, Sparkles, User2, 
  List
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const patientNavigation = [
  { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
  { name: 'Find Doctor', href: '/patient/doctor-discovery', icon: SearchCode },
  { name: 'My Appointments', href: '/patient/appointment', icon: CalendarRange },
  { name: 'Medical Records', href: '/patient/medical-records', icon: List },
  { name: 'Consultation', href: '/patient/consultation-session', icon: PlaySquare },
  { name: 'AI Recommendations', href: '/patient/ai-recommendation', icon: Sparkles },
];

const patientUser = {
  name: 'Arthur Pendragon',
  role: 'patient' as const,
  email: 'arthur.p@kyur.com',
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navigation={patientNavigation} user={patientUser}>
      {children}
    </DashboardLayout>
  );
}
