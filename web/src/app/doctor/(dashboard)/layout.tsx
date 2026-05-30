'use client';

import React from 'react';
import { LayoutDashboard, Calendar, Users, FileText } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const doctorNavigation = [
  { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
  { name: 'Patient Directory', href: '/doctor/patients', icon: Users },
  { name: 'Consultation History', href: '/doctor/consultation/prescriptions', icon: FileText },
  { name: 'Schedule Management', href: '/doctor/consultation/schedule', icon: Calendar },
];

const doctorUser = {
  name: 'Dr. Evelyn Adams',
  role: 'doctor' as const,
  email: 'evelyn.adams@kyura.com',
};

export default function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navigation={doctorNavigation} user={doctorUser}>
      {children}
    </DashboardLayout>
  );
}
