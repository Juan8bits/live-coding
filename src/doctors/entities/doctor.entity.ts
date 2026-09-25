export interface Doctor {
  id: number;
  fullName: string;
  specialty: string;
  /** HH:mm */
  workdayStart: string;
  /** HH:mm */
  workdayEnd: string;
  maxAppointmentsPerDay: number;
}
