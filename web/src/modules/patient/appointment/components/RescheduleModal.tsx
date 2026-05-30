import React, { useEffect, useState, useMemo } from 'react';
import { X, Calendar, Clock, AlertCircle, Sunrise, Sunset, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PatientAppointment } from '../types/appointment';
import { getDisplayDateFormatted } from '../services/appointmentService';
import { fetchDoctors } from '@/modules/patient/doctor-discovery/services/doctorService';
import { DaySchedule, TimeSlot } from '@/modules/patient/doctor-discovery/types/doctor';

interface RescheduleModalProps {
  appointment: PatientAppointment;
  onClose: () => void;
  onConfirm: (scheduleId: string) => Promise<PatientAppointment>;
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

export default function RescheduleModal({
  appointment,
  onClose,
  onConfirm,
}: RescheduleModalProps) {
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(formatKey(today));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingStep, setBookingStep] = useState<'browse' | 'confirming' | 'success'>('browse');
  const [doctorSchedule, setDoctorSchedule] = useState<DaySchedule[]>([]);
  const [updatedAppointment, setUpdatedAppointment] = useState<PatientAppointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDoctorSchedule = async () => {
      try {
        const doctors = await fetchDoctors();
        const doctor = doctors.find((item) => item.id === appointment.doctorId);

        if (isMounted) {
          setDoctorSchedule(doctor?.schedule ?? []);
        }
      } catch (err) {
        console.error('Failed to fetch doctor schedule for reschedule:', err);
        if (isMounted) {
          setError('We could not load this doctor availability right now.');
        }
      }
    };

    loadDoctorSchedule();

    return () => {
      isMounted = false;
    };
  }, [appointment.doctorId]);

  // Month navigation
  const isPrevMonthDisabled = viewYear < today.getFullYear() || 
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

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

  const slotsForSelectedDate = useMemo(() => {
    return doctorSchedule.find((day) => day.date === selectedDate)?.slots ?? [];
  }, [doctorSchedule, selectedDate]);

  const dateFormatted = getDisplayDateFormatted(selectedDate);
  const morningSlots = slotsForSelectedDate.filter(s => s.start.includes('AM'));
  const afternoonSlots = slotsForSelectedDate.filter(s => s.start.includes('PM'));

  // Calendar calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
    setError(null);
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setError(null);
  };

  const handleConfirmReschedule = async () => {
    if (!selectedSlot) return;
    setBookingStep('confirming');

    try {
      const updated = await onConfirm(selectedSlot.id);
      setUpdatedAppointment(updated);
      setBookingStep('success');
    } catch (err: any) {
      console.error('Failed to reschedule appointment:', err);
      setError(
        err?.response?.data?.message ||
          'We could not reschedule this appointment. Please choose another slot.',
      );
      setBookingStep('browse');
    }
  };

  const handleDone = () => {
    if (!updatedAppointment) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-brand-text">Reschedule Appointment</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Rescheduling appointment with <span className="font-bold text-brand-text">{appointment.doctorName}</span>
            </p>
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
              <h4 className="text-lg font-extrabold text-brand-text">Reschedule Confirmed!</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Your appointment with <span className="font-bold text-brand-text">{appointment.doctorName}</span> has been successfully rescheduled.
              </p>
            </div>

            {/* Booking Receipt Summary */}
            <div className="w-full max-w-md bg-slate-50/50 rounded-2xl border border-slate-100 p-5 text-left space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                  {appointment.doctorAvatar}
                </div>
                <div>
                  <h5 className="font-bold text-brand-text text-xs">{appointment.doctorName}</h5>
                  <p className="text-[9px] text-slate-400 font-semibold">{appointment.doctorSpecialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-brand-text">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Date</span>
                  <span className="flex items-center gap-1.5 text-brand-text"><Calendar className="h-3.5 w-3.5 text-primary" /> {dateFormatted}</span>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">New Time Range</span>
                  <span className="flex items-center gap-1.5 text-brand-text"><Clock className="h-3.5 w-3.5 text-primary" /> {selectedSlot?.start} - {selectedSlot?.end}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Type</span>
                  <span>Video Consultation</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md pt-4">
              <button
                onClick={handleDone}
                className="w-full text-center rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Close & Save Changes
              </button>
            </div>
          </div>
        ) : (
          /* BROWSE STATE */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Current schedule info */}
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-yellow-800">Current Schedule</h4>
                <p className="text-[10px] text-yellow-700 font-semibold leading-relaxed">
                  Currently scheduled for <span className="font-bold">{getDisplayDateFormatted(appointment.date)}</span> at <span className="font-bold">{appointment.slotStart} - {appointment.slotEnd}</span>.
                </p>
              </div>
            </div>

            {/* Calendar Picker + Slots Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Calendar */}
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

                {/* Week Headers */}
                <div className="grid grid-cols-7 text-center mb-1">
                  {DAYS.map(d => (
                    <span key={d} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider py-1">
                      {d[0]}
                    </span>
                  ))}
                </div>

                {/* Dates grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`offset-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = selectedDate === dateKey;
                    const cellDate = new Date(viewYear, viewMonth, day);
                    cellDate.setHours(0, 0, 0, 0);
                    const isPast = cellDate < today;
                    const isToday = formatKey(today) === dateKey;
                    const hasSlots = (doctorSchedule.find((daySchedule) => daySchedule.date === dateKey)?.slots ?? [])
                      .some((slot) => !slot.isBooked);

                    return (
                      <button
                        key={dateKey}
                        disabled={isPast}
                        onClick={() => handleDateSelect(dateKey)}
                        className={`aspect-square text-[11px] font-bold rounded-lg flex flex-col items-center justify-center relative cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary text-white scale-[1.05] shadow-xs'
                            : isPast
                              ? 'text-slate-200 cursor-not-allowed opacity-30 bg-slate-50/20'
                              : isToday
                                ? 'bg-primary-light text-primary border border-primary/20'
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {day}
                        {!isPast && hasSlots && (
                          <span className={`absolute bottom-1 h-1 w-1 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-accent'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Slot Picker */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    New time slots for <span className="text-brand-text font-extrabold">{dateFormatted}</span>:
                  </span>
                  {selectedSlot && (
                    <span className="text-[9px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md">
                      Selected
                    </span>
                  )}
                </div>

                {/* Morning slots */}
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

                {/* Afternoon slots */}
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

                {slotsForSelectedDate.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <AlertCircle className="h-6 w-6 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400">No available backend slots for this day</p>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50 p-3 text-[11px] font-bold text-rose-500">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        {bookingStep !== 'success' && (
          <div className="border-t border-slate-50 p-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/20">
            <div>
              {selectedSlot ? (
                <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                  Reschedule to <span className="font-bold text-brand-text">{dateFormatted}</span> at <span className="font-bold text-brand-text">{selectedSlot.start} - {selectedSlot.end}</span>
                </p>
              ) : (
                <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Select a new date and time range.
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
                onClick={handleConfirmReschedule}
                className={`flex-1 sm:flex-none rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all ${
                  !selectedSlot || bookingStep === 'confirming'
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark shadow-xs'
                }`}
              >
                {bookingStep === 'confirming' ? 'Processing...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
