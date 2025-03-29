import { DoctorStatusType } from '@/components/doctor/DoctorStatus';

export interface TimeSlot {
  id: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  duration: number; // in minutes
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  timeSlotId: string;
  startTime: Date;
  endTime: Date;
  type: 'immediate' | 'scheduled';
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  doctorName: string;
  notes?: string;
  symptoms?: string[];
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorStatus {
  doctorId: string;
  status: DoctorStatusType;
  lastUpdated: Date;
}

export interface AppointmentFilter {
  patientId?: string;
  doctorId?: string;
  status?: Appointment['status'];
  startDate?: Date;
  endDate?: Date;
}

export interface PaymentDetails {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'insurance';
  paymentDate?: Date;
  transactionId?: string;
}

export interface AppointmentWithDoctor extends Appointment {
  doctor: {
    id: string;
    name: string;
    specialization: string;
    profileImage?: string;
  };
}

export interface AppointmentWithPatient extends Appointment {
  patient: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface AppointmentFeedback {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
} 