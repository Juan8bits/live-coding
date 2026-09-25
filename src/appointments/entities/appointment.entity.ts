export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
  reason?: string;
}
