import { Injectable } from '@nestjs/common';
import { calculateAge } from '../common/utils/date.utils';
import { InMemoryDatabase } from '../database/in-memory-database';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(private readonly db: InMemoryDatabase) {}

  findAll(page = 1, limit = 20) {
    const start = (page - 1) * limit;
    return this.db.patients.slice(start, start + limit).map((patient) => this.toResponse(patient));
  }

  findOne(id: number) {
    const patient = this.db.patients.find((p) => p.id === id);
    if (!patient) {
      throw new Error(`Patient ${id} not found`);
    }
    return this.toResponse(patient);
  }

  async exists(id: number): Promise<boolean> {
    return this.db.patients.some((p) => p.id === id);
  }

  create(dto: CreatePatientDto) {
    const patient: Patient = {
      id: this.db.nextId('patients'),
      ...dto,
      createdAt: new Date(),
    };
    this.db.patients.push(patient);
    return this.toResponse(patient);
  }

  private toResponse(patient: Patient) {
    return {
      id: patient.id,
      fullName: `${patient.firstName} ${patient.lastName}`,
      email: patient.email,
      age: calculateAge(patient.birthDate),
    };
  }
}
