import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getAuthorizedPatient(userId: string, patientId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        userId,
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new ForbiddenException('You can only access your own medical records');
    }

    return patient;
  }

  private formatDate(date: Date | null | undefined) {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }

  private formatDuration(startTime: Date | null | undefined, endTime: Date | null | undefined) {
    if (!startTime || !endTime) return 'Completed';

    const durationMs = endTime.getTime() - startTime.getTime();
    if (durationMs <= 0) return 'Completed';

    const totalMinutes = Math.round(durationMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours} hr${hours === 1 ? '' : 's'} ${minutes} min${minutes === 1 ? '' : 's'}`;
    }

    return `${minutes} min${minutes === 1 ? '' : 's'}`;
  }

  private mapRecord(record: any) {
    const doctorName = [
      record.doctor?.profileDetails?.firstName,
      record.doctor?.profileDetails?.lastName,
    ]
      .filter(Boolean)
      .join(' ');

    const specialty =
      record.doctor?.doctorSpecializations?.[0]?.specialization?.name ?? 'General Practice';

    return {
      id: record.id,
      appointmentId: record.appointmentId,
      doctorName: doctorName ? `Dr. ${doctorName}` : 'Doctor',
      specialty,
      date: this.formatDate(record.appointment?.appointmentDate ?? record.createdAt),
      duration: this.formatDuration(record.appointment?.startTime, record.appointment?.endTime),
      consultationType:
        record.consultationType ?? record.appointment?.consultationType ?? 'General Consult',
      clinicalFindings: record.clinicalFindings ?? record.diagnosis ?? '',
      recommendations: record.recommendations ?? record.consultationNotes ?? '',
      medicationPrescriptions: record.medicationSummary ?? '',
      finalSummary: record.finalSummary ?? '',
      diagnosis: record.diagnosis ?? '',
      treatmentNotes: record.consultationNotes ?? '',
      createdAt: record.createdAt,
    };
  }

  private mapAppointmentRecord(appointment: any) {
    const record = appointment.medicalRecord;
    const doctorName = [
      appointment.doctor?.profileDetails?.firstName,
      appointment.doctor?.profileDetails?.lastName,
    ]
      .filter(Boolean)
      .join(' ');

    const specialty =
      appointment.doctor?.doctorSpecializations?.[0]?.specialization?.name ?? 'General Practice';

    return {
      id: record?.id ?? appointment.id,
      appointmentId: appointment.id,
      doctorName: doctorName ? `Dr. ${doctorName}` : 'Doctor',
      specialty,
      date: this.formatDate(appointment.appointmentDate ?? record?.createdAt),
      duration: this.formatDuration(appointment.startTime, appointment.endTime),
      consultationType:
        record?.consultationType ?? appointment.consultationType ?? 'General Consult',
      clinicalFindings: record?.clinicalFindings ?? record?.diagnosis ?? '',
      recommendations: record?.recommendations ?? record?.consultationNotes ?? '',
      medicationPrescriptions: record?.medicationSummary ?? '',
      finalSummary: record?.finalSummary ?? '',
      diagnosis: record?.diagnosis ?? '',
      treatmentNotes: record?.consultationNotes ?? '',
      createdAt: record?.createdAt ?? appointment.updatedAt,
      hasMedicalRecord: Boolean(record),
    };
  }

  async getPatientConsultationRecords(userId: string, patientId: string) {
    const patient = await this.getAuthorizedPatient(userId, patientId);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        deletedAt: null,
        status: 'COMPLETED',
      },
      include: {
        medicalRecord: {
          where: { deletedAt: null },
        },
        doctor: {
          include: {
            profileDetails: true,
            doctorSpecializations: {
              where: { deletedAt: null },
              include: { specialization: true },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ appointmentDate: 'desc' }, { startTime: 'desc' }],
    });

    return appointments.map((appointment) => this.mapAppointmentRecord(appointment));
  }

  async getPatientConsultationRecord(userId: string, patientId: string, recordId: string) {
    const patient = await this.getAuthorizedPatient(userId, patientId);

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        patientId: patient.id,
        deletedAt: null,
        status: 'COMPLETED',
        OR: [
          { id: recordId },
          { medicalRecord: { id: recordId, deletedAt: null } },
        ],
      },
      include: {
        medicalRecord: {
          where: { deletedAt: null },
        },
        doctor: {
          include: {
            profileDetails: true,
            doctorSpecializations: {
              where: { deletedAt: null },
              include: { specialization: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Consultation record not found');
    }

    return this.mapAppointmentRecord(appointment);
  }
}
