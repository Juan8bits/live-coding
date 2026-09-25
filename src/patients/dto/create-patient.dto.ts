import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @IsOptional()
  @IsString()
  medicalNotes?: string;
}
