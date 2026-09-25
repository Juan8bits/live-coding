export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  nationalId: string;
  medicalNotes?: string;
  createdAt: Date;
}
