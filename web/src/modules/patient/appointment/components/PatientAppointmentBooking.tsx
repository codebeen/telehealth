'use client';

import React from 'react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';

export default function PatientAppointmentBooking() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="My Appointments" 
        description="Manage your upcoming and past appointments." 
      />

      {/* Add content later */}
    </div>
  );
}
