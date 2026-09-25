import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  patientId: number;

  @IsInt()
  doctorId: number;

  @IsDateString()
  startsAt: string;

  @IsInt()
  @Min(15)
  @Max(120)
  durationMinutes: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
