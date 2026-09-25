import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { DatabaseModule } from './database/database.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [DatabaseModule, PatientsModule, DoctorsModule, AppointmentsModule],
})
export class AppModule {}
