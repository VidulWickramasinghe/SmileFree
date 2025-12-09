export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Patient {
  name: string;
  age: number;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patient: Patient;
  date: string; // ISO string
  timeSlot: string;
  problemDescription: string;
  status: AppointmentStatus;
  createdAt: string;
  imageUrl?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface User {
  id: string;
  name: string;
  role: 'doctor' | 'admin';
  email: string;
}