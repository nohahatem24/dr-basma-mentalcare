export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'doctor' | 'admin';
  phoneNumber?: string;
  profileImage?: string;
  createdAt: Date;
  lastLogin?: Date;
  language: 'en' | 'ar';
}

export interface PatientProfile extends User {
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  sessionHistory?: SessionSummary[];
  preferredPaymentMethod?: 'card' | 'digital-wallet';
}

export interface DoctorProfile extends User {
  specialization: string;
  bio: string;
  shortBio?: string;
  experience: {
    title: string;
    organization: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications: {
    title: string;
    issuer: string;
    year: number;
    expiryDate?: Date;
  }[];
  languages: string[];
  consultationFee: number;
  rating: number;
  reviewCount: number;
  availableForImmediateSessions: boolean;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Rating {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  appointmentId: string;
  rating: number; // 1-5
  review?: string;
  createdAt: Date;
  doctorResponse?: {
    response: string;
    createdAt: Date;
  };
}

export interface SessionSummary {
  id: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  duration: number; // in minutes
  status: 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  rating?: number;
}

export interface Availability {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:MM in 24-hour format
  endTime: string; // HH:MM in 24-hour format
  isAvailable: boolean;
} 