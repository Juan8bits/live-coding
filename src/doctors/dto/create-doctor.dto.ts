import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @Matches(/^\d{2}:\d{2}$/)
  workdayStart: string;

  @Matches(/^\d{2}:\d{2}$/)
  workdayEnd: string;

  @IsInt()
  @Min(1)
  maxAppointmentsPerDay: number;
}
