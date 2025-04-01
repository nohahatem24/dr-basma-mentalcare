export type AppointmentType = 'standard' | 'custom' | 'immediate';

export interface AppointmentDetails {
  date?: Date;
  time?: string;
  doctorName: string;
  fee: number;
  appointmentType: AppointmentType;
  notes?: string;
}

export interface DoctorInfo {
  name: string;
  title: string;
  bio: string;
  certifications: string[];
  rating: number;
  reviewCount: number;
}