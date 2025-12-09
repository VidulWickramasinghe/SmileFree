import { Appointment, AppointmentStatus } from '../types';

const STORAGE_KEY = 'orthocare_appointments';

// Seed initial data if empty
const seedData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const mockAppointments: Appointment[] = [
      {
        id: 'mock-1',
        patient: {
          name: 'Sarah Perera',
          age: 24,
          email: 'sarah.p@example.com',
          phone: '0771234567'
        },
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: '10:00 AM',
        problemDescription: 'Interested in invisible aligners for gap correction.',
        status: AppointmentStatus.PENDING,
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-2',
        patient: {
          name: 'John Silva',
          age: 14,
          email: 'john.dad@example.com',
          phone: '0719876543'
        },
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        timeSlot: '04:00 PM',
        problemDescription: 'Regular braces tightening checkup.',
        status: AppointmentStatus.COMPLETED,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAppointments));
  }
};

seedData();

export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAppointment = (appointment: Appointment): void => {
  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

export const updateAppointmentStatus = (id: string, status: AppointmentStatus): void => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }
};

export const getAvailableSlots = (date: string): string[] => {
  // Logic to filter out taken slots for a specific date
  const appointments = getAppointments();
  const takenSlots = appointments
    .filter(a => a.date === date && a.status !== AppointmentStatus.CANCELLED)
    .map(a => a.timeSlot);
  
  const allSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  return allSlots.filter(slot => !takenSlots.includes(slot));
};