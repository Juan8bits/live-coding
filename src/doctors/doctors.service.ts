import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory-database';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(private readonly db: InMemoryDatabase) {}

  async findAll(specialty?: string): Promise<Doctor[]> {
    if (!specialty) {
      return this.db.doctors;
    }
    return this.db.doctors.filter((d) => d.specialty.toLowerCase() === specialty.toLowerCase());
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = this.db.doctors.find((d) => d.id === id);
    if (!doctor) {
      throw new NotFoundException(`Doctor ${id} not found`);
    }
    return doctor;
  }

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const doctor: Doctor = { id: this.db.nextId('doctors'), ...dto };
    this.db.doctors.push(doctor);
    return doctor;
  }
}
