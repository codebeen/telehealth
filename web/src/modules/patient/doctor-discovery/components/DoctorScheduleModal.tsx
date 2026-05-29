import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, Sunrise, Sunset, ChevronLeft, ChevronRight } from 'lucide-react';
import { Doctor, DaySchedule, TimeSlot } from '../types/doctor';
import { getDisplayDateFormatted } from '../services/doctorService';
import Link from 'next/link';

interface DoctorScheduleModalProps {
  doctor: Doctor;
  onClose: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function DoctorScheduleModal({ doctor, onClose }: DoctorScheduleModalProps) {
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(formatKey(today));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingStep, setBookingStep] = useState<'browse' | 'confirming' | 'success'>('browse');

  const isPrevMonthDisabled = viewYear < today.getFullYear() || 
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  // Helper to retrieve/generate schedule dynamically for any date
  const currentDaySchedule = useMemo((): DaySchedule => {
    const found = doctor.schedule.find(s => s.date === selectedDate);
    if (found) return found;

    // Generate pseudo-random weekday range slots for future dates not pre-mocked
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      return { date: selectedDate, slots: [] };
    }

    const slots: TimeSlot[] = [];
    const isTuesdayOrThursday = dayOfWeek === 2 || dayOfWeek === 4;
    const startHour = isTuesdayOrThursday ? 10 : 9;
    const endHour = isTuesdayOrThursday ? 16 : 17;
    let index = 0;

    for (let h = startHour; h < endHour; h++) {
      if (h === 12 || h === 13) continue; // Lunch break

      const formatTime = (hour: number, min: number) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour}:${String(min).padStart(2, '0')} ${period}`;
      };

      slots.push({
        id: `${selectedDate}-${h}-00-${index}`,
        start: formatTime(h, 0),
        end: formatTime(h, 30),
        isBooked: (index + dayOfWeek) % 3 === 0
      });
      index++;

      slots.push({
        id: `${selectedDate}-${h}-30-${index}`,
        start: formatTime(h, 30),
        end: formatTime(h + 1, 0),
        isBooked: (index + dayOfWeek) % 4 === 0
      });
      index++;
    }

    return { date: selectedDate, slots };
  }, [selectedDate, doctor.schedule]);

  const dateFormatted = getDisplayDateFormatted(selectedDate);

  // Group slots into morning (AM) and afternoon/evening (PM)
  const morningSlots = currentDaySchedule.slots.filter(slot => slot.start.includes('AM'));
  const afternoonSlots = currentDaySchedule.slots.filter(slot => slot.start.includes('PM'));

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null); // Reset selection
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    setBookingStep('confirming');
    
    // Simulate API delay
    setTimeout(() => {
      setBookingStep('success');
    }, 1500);
  };

  // Calendar Helpers
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  // Helper to count available slots for a day
  const getAvailableSlotsCount = (dateStr: string) => {
    const found = doctor.schedule.find(s => s.date === dateStr);
    if (found) return found.slots.filter(s => !s.isBooked).length;

    // Pseudo-random counts for dynamic slots
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 0;
    return dayOfWeek === 2 || dayOfWeek === 4 ? 6 : 8; // weekday slots estimate
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-brand-text">Doctor Availability Schedule</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Select a calendar date to review and book time slot ranges</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand-text transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {bookingStep === 'success' ? (
          /* SUCCESS STATE */
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="h-16 w-16 bg-accent-light rounded-full flex items-center justify-center text-accent animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-brand-text">Consultation Confirmed!</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Your appointment with <span className="font-bold text-brand-text">{doctor.name}</span> has been successfully booked.
              </p>
            </div>

            {/* Booking Receipt Summary */}
            <div className="w-full max-w-md bg-slate-50/50 rounded-2xl border border-slate-100 p-5 text-left space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                  {doctor.avatar}
                </div>
                <div>
                  <h5 className="font-bold text-brand-text text-xs">{doctor.name}</h5>
                  <p className="text-[9px] text-slate-400 font-semibold">{doctor.specialty} · {doctor.experience}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-brand-text">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Date</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {dateFormatted}</span>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Time Range</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> {selectedSlot ? `${selectedSlot.start} - ${selectedSlot.end}` : ''}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Type</span>
                  <span>Video Consultation</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full max-w-md pt-4">
              <Link
                href="/patient/appointment"
                className="flex-1 text-center rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Go to Appointments
              </Link>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* BROWSE STATE */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Doctor Profile Card */}
            <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                  {doctor.avatar}
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-text text-sm">{doctor.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                    <span>{doctor.specialty} · {doctor.experience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Calendar & Time slot selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Left Column: Calendar Picker */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-xs">
                
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={prevMonth} 
                    disabled={isPrevMonthDisabled}
                    className={`p-1 rounded-lg text-slate-500 transition-colors ${
                      isPrevMonthDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <h4 className="text-xs font-extrabold text-brand-text">
                    {MONTHS[viewMonth]} {viewYear}
                  </h4>
                  <button 
                    onClick={nextMonth} 
                    className="p-1 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Days Week headers */}
                <div className="grid grid-cols-7 text-center mb-1">
                  {DAYS.map(d => (
                    <span key={d} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider py-1">
                      {d[0]}
                    </span>
                  ))}
                </div>

                {/* Month Dates grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Offsets */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`offset-${i}`} />
                  ))}

                  {/* Days */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = selectedDate === dateKey;
                    const cellDate = new Date(viewYear, viewMonth, day);
                    cellDate.setHours(0, 0, 0, 0);
                    const isPast = cellDate < today;
                    const isToday = formatKey(today) === dateKey;
                    const availableSlotsCount = getAvailableSlotsCount(dateKey);

                    return (
                      <button
                        key={dateKey}
                        disabled={isPast}
                        onClick={() => handleDateSelect(dateKey)}
                        className={`aspect-square text-[11px] font-bold rounded-lg flex flex-col items-center justify-center relative transition-all ${
                          isSelected
                            ? 'bg-primary text-white scale-[1.05] shadow-xs shadow-primary/20'
                            : isPast
                              ? 'text-slate-200 cursor-not-allowed opacity-30 bg-slate-50/20'
                              : isToday
                                ? 'bg-primary-light text-primary border border-primary/20'
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{day}</span>
                        {/* Dot indicator if slots are available */}
                        {!isPast && availableSlotsCount > 0 && (
                          <span className={`absolute bottom-1 h-1 w-1 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-accent'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Time Slots Picker */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Available ranges on <span className="text-brand-text font-extrabold">{dateFormatted}</span>:
                  </span>
                  {selectedSlot && (
                    <span className="text-[9px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md">
                      Selected Range
                    </span>
                  )}
                </div>

                {/* Morning Slots */}
                {morningSlots.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Sunrise className="h-3.5 w-3.5 text-amber-500" /> Morning
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {morningSlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            disabled={slot.isBooked}
                            onClick={() => handleSelectSlot(slot)}
                            className={`py-2 px-3 text-[11px] font-bold rounded-xl border text-center transition-all ${
                              slot.isBooked
                                ? 'border-slate-50 bg-slate-50/50 text-slate-300 cursor-not-allowed line-through'
                                : isSelected
                                  ? 'border-primary bg-primary text-white shadow-xs'
                                  : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600 hover:text-brand-text cursor-pointer'
                            }`}
                          >
                            {slot.start} - {slot.end}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Afternoon Slots */}
                {afternoonSlots.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Sunset className="h-3.5 w-3.5 text-orange-500" /> Afternoon & Evening
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {afternoonSlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            disabled={slot.isBooked}
                            onClick={() => handleSelectSlot(slot)}
                            className={`py-2 px-3 text-[11px] font-bold rounded-xl border text-center transition-all ${
                              slot.isBooked
                                ? 'border-slate-50 bg-slate-50/50 text-slate-300 cursor-not-allowed line-through'
                                : isSelected
                                  ? 'border-primary bg-primary text-white shadow-xs'
                                  : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600 hover:text-brand-text cursor-pointer'
                            }`}
                          >
                            {slot.start} - {slot.end}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {morningSlots.length === 0 && afternoonSlots.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <AlertCircle className="h-6 w-6 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400">No time slots configured for this day</p>
                  </div>
                )}
              </div>

            </div>

            {/* Footer Summary / Trigger */}
            <div className="border-t border-slate-50 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                {selectedSlot ? (
                  <p className="text-[11px] font-semibold text-slate-500">
                    Booking session on <span className="font-bold text-brand-text">{dateFormatted}</span> at <span className="font-bold text-brand-text">{selectedSlot.start} - {selectedSlot.end}</span>
                  </p>
                ) : (
                  <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Please select an available slot to continue.
                  </p>
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedSlot || bookingStep === 'confirming'}
                  onClick={handleConfirmBooking}
                  className={`flex-1 sm:flex-none rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all ${
                    !selectedSlot || bookingStep === 'confirming'
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark shadow-xs'
                  }`}
                >
                  {bookingStep === 'confirming' ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}
