import { Injectable } from '@nestjs/common';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Patient } from '../patients/entities/patient.entity';
import { seedAppointments, seedDoctors, seedPatients } from './seed';

type Table = 'patients' | 'doctors' | 'appointments';

/**
 * Simulates the persistence layer. In the real project this would be a DB
 * accessed through an ORM; for this exercise everything lives in memory.
 */
@Injectable()
export class InMemoryDatabase {
  patients: Patient[] = structuredClone(seedPatients);
  doctors: Doctor[] = structuredClone(seedDoctors);
  appointments: Appointment[] = structuredClone(seedAppointments);

  private sequences: Record<Table, number> = {
    patients: seedPatients.length,
    doctors: seedDoctors.length,
    appointments: seedAppointments.length,
  };

  nextId(table: Table): number {
    this.sequences[table] += 1;
    return this.sequences[table];
  }
}
