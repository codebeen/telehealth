'use client';

import React, { useState } from 'react';
import { Search, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';

export default function DoctorDiscovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('All');

  const specialties = ['All', 'Cardiology', 'Pediatrics', 'Dermatology', 'Neurology', 'General Medicine'];

  const doctors = [
    { id: 1, name: 'Dr. Evelyn Adams', specialty: 'Cardiology', rating: 4.9, reviews: 120, experience: '12 yrs', fee: '$45', availability: 'Tomorrow', avatar: 'EA' },
    { id: 2, name: 'Dr. Sarah Connor', specialty: 'General Medicine', rating: 4.8, reviews: 95, experience: '10 yrs', fee: '$40', availability: 'Today', avatar: 'SC' },
    { id: 3, name: 'Dr. Marcus Vance', specialty: 'Pediatrics', rating: 4.7, reviews: 84, experience: '8 yrs', fee: '$50', availability: 'Friday, May 29th', avatar: 'MV' },
    { id: 4, name: 'Dr. Diana Prince', specialty: 'Dermatology', rating: 4.9, reviews: 142, experience: '15 yrs', fee: '$60', availability: 'Today', avatar: 'DP' },
    { id: 5, name: 'Dr. Bruce Wayne', specialty: 'Neurology', rating: 4.6, reviews: 68, experience: '14 yrs', fee: '$75', availability: 'Monday, June 1st', avatar: 'BW' }
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty === 'All' || doc.specialty === specialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <PageHeader 
        title="Discover Doctors & Care Providers" 
        description="Search and book video consultations with certified professionals." 
      />

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-xs font-medium text-brand-text outline-hidden border border-transparent focus:border-primary/20 focus:bg-white"
          />
        </div>

        {/* Specialty Filter Pill Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialty(spec)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold shrink-0 transition-colors ${
                specialty === spec 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-brand-text'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div key={doc.id} className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-72">
              
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-base">
                      {doc.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-sm group-hover:text-primary transition-colors">{doc.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{doc.specialty} · {doc.experience}</span>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-rose-500 transition-colors p-1">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Ratings & Reviews */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg w-max">
                  <Star className="fill-amber-400 text-amber-400 h-3.5 w-3.5" />
                  <span className="text-brand-text">{doc.rating}</span>
                  <span className="text-slate-400">({doc.reviews} reviews)</span>
                </div>

                {/* Schedule Status */}
                <div className="text-xs space-y-1 bg-slate-50/20 p-2.5 rounded-lg border border-slate-50/50">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Available</span>
                    <span className="font-bold text-brand-text">{doc.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Video Consultation</span>
                    <span className="font-bold text-accent">{doc.fee}</span>
                  </div>
                </div>
              </div>

              {/* Book Actions */}
              <div className="border-t border-slate-50 pt-3 mt-4 flex gap-2">
                <Link
                  href="/patient/appointment"
                  className="flex-1 text-center rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-colors"
                >
                  Book Appointment
                </Link>
                <Link
                  href="/patient/consultation-session"
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Quick consultation room"
                >
                  Visit
                </Link>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400 text-xs font-medium">
            No doctors found matching "{searchTerm}" under specialty "{specialty}".
          </div>
        )}
      </div>

    </div>
  );
}
