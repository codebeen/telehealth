import React from 'react';
import { Calendar, Clock, User, XCircle, RefreshCw, Eye } from 'lucide-react';
import { PatientAppointment } from '../types/appointment';
import { getDisplayDateFormatted } from '../services/appointmentService';

interface AppointmentCardProps {
  appointment: PatientAppointment;
  onViewDetails: (appt: PatientAppointment) => void;
  onReschedule: (appt: PatientAppointment) => void;
  onCancel: (appt: PatientAppointment) => void;
}

export default function AppointmentCard({
  appointment,
  onViewDetails,
  onReschedule,
  onCancel,
}: AppointmentCardProps) {
  const displayDate = getDisplayDateFormatted(appointment.date);
  
  const statusColorMap = {
    Upcoming: 'bg-accent-light text-accent border-accent/10',
    Completed: 'bg-primary-light text-primary border-primary/10',
    Cancelled: 'bg-rose-50 text-rose-500 border-rose-100',
  };

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Doctor Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
              {appointment.doctorAvatar}
            </div>
            <div>
              <h4 className="font-bold text-brand-text text-sm group-hover:text-primary transition-colors leading-snug">
                {appointment.doctorName}
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {appointment.doctorSpecialty}
              </p>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${statusColorMap[appointment.status]}`}>
            {appointment.status}
          </span>
        </div>

        {/* Date & Time display */}
        <div className="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-50 text-xs font-semibold text-brand-text">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{displayDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{appointment.slotStart} - {appointment.slotEnd}</span>
          </div>
        </div>

        {/* Short reason for visit */}
        <div className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
          <span className="font-bold text-slate-500">Reason:</span> {appointment.visitReason}
        </div>

        {/* Cancelled feedback text */}
        {appointment.status === 'Cancelled' && appointment.cancelReason && (
          <div className="text-[10px] bg-rose-50/50 text-rose-600 rounded-lg p-2 border border-rose-100/50 flex items-start gap-1.5">
            <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <p className="leading-normal font-semibold">
              <span className="font-bold">Cancellation Reason:</span> {appointment.cancelReason}
            </p>
          </div>
        )}
      </div>

      {/* Card action row */}
      <div className="border-t border-slate-50 pt-4 mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onViewDetails(appointment)}
          className="flex-1 min-w-[90px] flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-2 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <Eye className="h-3.5 w-3.5" /> View Details
        </button>

        {appointment.status === 'Upcoming' && (
          <>
            <button
              onClick={() => onReschedule(appointment)}
              className="flex-1 min-w-[90px] flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-2 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reschedule
            </button>
            <button
              onClick={() => onCancel(appointment)}
              className="rounded-xl border border-transparent px-3 py-2 text-[11px] font-bold text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
              title="Cancel appointment"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
