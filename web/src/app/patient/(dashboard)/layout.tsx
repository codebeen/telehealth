'use client';

import React from 'react';
import {
  LayoutDashboard, CalendarRange, SearchCode, List
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import KyuraChatWidget from '@/modules/patient/ai-recommendation/components/KyuraChatWidget';

const patientNavigation = [
  { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
  { name: 'Find Doctor', href: '/patient/doctor-discovery', icon: SearchCode },
  { name: 'My Appointments', href: '/patient/appointment', icon: CalendarRange },
  { name: 'Medical Records', href: '/patient/medical-records', icon: List },
];

const patientUser = {
  name: 'Arthur Pendragon',
  role: 'patient' as const,
  email: 'arthur.p@kyura.com',
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navigation={patientNavigation} user={patientUser}>
      {children}
      <KyuraChatWidget />
    </DashboardLayout>
  );
}
