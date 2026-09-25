import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { addMinutes, isSameDay } from '../common/utils/date.utils';
import { InMemoryDatabase } from '../database/in-memory-database';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly db: InMemoryDatabase,
    private readonly patientsService: PatientsService,
    private readonly doctorsService: DoctorsService,
  ) {}

  async findAll() {
    const result = [];

    for (const appointment of this.db.appointments) {
      const patient = this.db.patients.find((p) => p.id === appointment.patientId);
      const doctor = await this.doctorsService.findOne(appointment.doctorId);

      result.push({
        ...appointment,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorName: doctor.fullName,
      });
    }

    return result;
  }

  async findByDoctor(doctorId: number): Promise<Appointment[]> {
    return this.db.appointments.filter((a) => a.doctorId === doctorId);
  }

  async getDoctorAgenda(doctorId: number) {
    const doctor = await this.doctorsService.findOne(doctorId);
    const appointments = this.findByDoctor(doctorId);

    return { doctor, appointments };
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const patientExists = await this.patientsService.exists(dto.patientId);
    if (!patientExists) {
      throw new NotFoundException(`Patient ${dto.patientId} not found`);
    }

    const doctor = await this.doctorsService.findOne(dto.doctorId);

    const startsAt = new Date(dto.startsAt);
    const endsAt = addMinutes(startsAt, dto.durationMinutes);

    if (startsAt < new Date()) {
      throw new BadRequestException('Cannot book an appointment in the past');
    }

    const activeThatDay = this.db.appointments.filter(
      (a) =>
        a.doctorId === doctor.id && a.status !== AppointmentStatus.CANCELLED && isSameDay(a.startsAt, startsAt),
    );

    if (activeThatDay.some((a) => startsAt < a.endsAt && endsAt > a.startsAt)) {
      throw new ConflictException('The doctor already has an appointment at that time');
    }
    if (activeThatDay.length >= doctor.maxAppointmentsPerDay) {
      throw new BadRequestException('The doctor has no availability for that day');
    }

    const appointment: Appointment = {
      id: this.db.nextId('appointments'),
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      startsAt,
      endsAt,
      status: AppointmentStatus.SCHEDULED,
      reason: dto.reason,
    };
    this.db.appointments.push(appointment);

    return appointment;
  }

  cancel(id: number): Appointment {
    const appointment = this.db.appointments.find((a) => a.id === id);
    if (!appointment) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }
    appointment.status = AppointmentStatus.CANCELLED;
    return appointment;
  }
}
