import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Patient } from '../patients/entities/patient.entity';

// Deterministic PRNG so every run produces the same data set
function createRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(42);
const pick = <T>(items: T[]): T => items[Math.floor(random() * items.length)];

const FIRST_NAMES = ['Ana', 'Luis', 'María', 'Carlos', 'Laura', 'Andrés', 'Sofía', 'Jorge', 'Valentina', 'Diego', 'Camila', 'Felipe'];
const LAST_NAMES = ['Gómez', 'Rodríguez', 'López', 'Martínez', 'García', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Díaz'];
const SPECIALTIES = ['Cardiology', 'Pediatrics', 'Dermatology', 'General Medicine', 'Neurology'];
const REASONS = ['Check-up', 'Headache', 'Annual exam', 'Lab results', 'Follow-up'];

export const seedPatients: Patient[] = Array.from({ length: 1000 }, (_, i) => {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const year = 1945 + Math.floor(random() * 75);
  const month = String(1 + Math.floor(random() * 12)).padStart(2, '0');
  const day = String(1 + Math.floor(random() * 28)).padStart(2, '0');
  return {
    id: i + 1,
    firstName,
    lastName,
    email: `${firstName}.${lastName}.${i + 1}@mail.com`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    birthDate: `${year}-${month}-${day}`,
    nationalId: String(10000000 + Math.floor(random() * 89999999)),
    medicalNotes: random() > 0.7 ? 'Patient with a history of hypertension' : undefined,
    createdAt: new Date(2024, 0, 1),
  };
});

export const seedDoctors: Doctor[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  fullName: `Dr. ${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
  specialty: SPECIALTIES[i % SPECIALTIES.length],
  workdayStart: '08:00',
  workdayEnd: '17:00',
  maxAppointmentsPerDay: 6 + (i % 3),
}));

function buildAppointments(): Appointment[] {
  const appointments: Appointment[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const doctor of seedDoctors) {
    for (let offset = -30; offset <= 60; offset++) {
      const day = new Date(today);
      day.setDate(today.getDate() + offset);
      if (day.getDay() === 0 || day.getDay() === 6) continue;

      const count = Math.floor(random() * 4);
      for (let slot = 0; slot < count; slot++) {
        const startsAt = new Date(day);
        startsAt.setHours(8 + slot * 2 + Math.floor(random() * 2), random() > 0.5 ? 30 : 0);
        const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);

        let status: AppointmentStatus = offset < 0 ? AppointmentStatus.COMPLETED : AppointmentStatus.SCHEDULED;
        if (random() < 0.1) status = AppointmentStatus.CANCELLED;

        appointments.push({
          id: appointments.length + 1,
          patientId: 1 + Math.floor(random() * seedPatients.length),
          doctorId: doctor.id,
          startsAt,
          endsAt,
          status,
          reason: pick(REASONS),
        });
      }
    }
  }
  return appointments;
}

export const seedAppointments: Appointment[] = buildAppointments();
